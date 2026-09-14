#!/usr/bin/env python3
"""Deterministic, no-model discovery collector for SmartMe's public Telegram radar."""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PROJECT = Path(__file__).resolve().parents[1]
DEFAULT_STATE = PROJECT / ".hermes/content-radar/collector-state.json"
DEFAULT_OUTPUT = PROJECT / ".hermes/content-radar/runs"
FEED_URL = "https://t.me/s/TechNewsHeb"
TRACKING_PREFIXES = ("utm_", "fbclid", "gclid", "ref")
TOPIC_KEYWORDS = ("ai", "בינה", "מודל", "מחקר", "מדע", "טכנולוג", "github", "arxiv")
RUMOR_KEYWORDS = ("שמועה", "דליפה", "אולי", "rumor", "leak")


def normalize_url(raw: str) -> str:
    parsed = urllib.parse.urlsplit(raw)
    query = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    clean_query = [
        (key, value)
        for key, value in query
        if not any(key.lower().startswith(prefix) for prefix in TRACKING_PREFIXES)
    ]
    path = parsed.path.rstrip("/") or "/"
    return urllib.parse.urlunsplit(
        (parsed.scheme.lower(), parsed.netloc.lower(), path, urllib.parse.urlencode(clean_query), "")
    ).rstrip("/")


def strip_html(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(value))).strip()


def advance_contiguous_cursor(cursor: int, ids: list[int]) -> int:
    """Advance only through an uninterrupted sequence; unseen gaps stay deferred."""
    next_cursor = cursor
    for entry_id in sorted(set(ids)):
        if entry_id != next_cursor + 1:
            break
        next_cursor = entry_id
    return next_cursor


def classify_entry(entry: dict[str, Any], known_urls: set[str]) -> dict[str, Any]:
    text = entry.get("text", "").lower()
    links = [normalize_url(url) for url in entry.get("links", []) if url.startswith("https://")]
    reasons: list[str] = []
    score = 0
    if any(url in known_urls for url in links):
        reasons.append("duplicate")
    if any(word in text for word in RUMOR_KEYWORDS):
        reasons.append("rumor-or-unverified")
    if any(word in text for word in TOPIC_KEYWORDS):
        score += 2
        reasons.append("relevant-topic")
    if links:
        score += 1
        reasons.append("has-external-link")
    primary_candidates = [
        url for url in links if "t.me/" not in url and "telegram.me/" not in url
    ]
    if primary_candidates:
        score += 1
        reasons.append("has-primary-candidate")
    decision = "candidate" if not {"duplicate", "rumor-or-unverified"}.intersection(reasons) and score >= 3 else "skip"
    return {
        **entry,
        "links": links,
        "score": score,
        "decision": decision,
        "reasons": reasons,
    }


def fetch_entries(url: str) -> list[dict[str, Any]]:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 SmartMe content radar"})
    with urllib.request.urlopen(request, timeout=30) as response:
        page = response.read().decode("utf-8", "replace")
    entries: list[dict[str, Any]] = []
    for block in re.findall(r'<div class="tgme_widget_message_wrap[^>]*>(.*?)</div>\s*</div>', page, re.S):
        post = re.search(r'data-post="TechNewsHeb/(\d+)"', block)
        if not post:
            continue
        text_match = re.search(r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>', block, re.S)
        text = strip_html(text_match.group(1)) if text_match else ""
        links = re.findall(r'href="(https?://[^"#]+)', block)
        entries.append({"id": int(post.group(1)), "text": text, "links": links})
    # Telegram's HTML may have nested div changes; fail closed rather than advance a cursor.
    if not entries:
        raise RuntimeError("No Telegram message wrappers parsed; cursor not advanced")
    return entries


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--feed-url", default=FEED_URL)
    parser.add_argument("--state", type=Path, default=DEFAULT_STATE)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--commit-state", action="store_true", help="Advance local cursor after a reviewed run")
    args = parser.parse_args()
    state = json.loads(args.state.read_text()) if args.state.exists() else {"last_seen_post_id": 11074, "known_urls": []}
    cursor = int(state.get("last_seen_post_id", 0))
    known_urls = set(state.get("known_urls", []))
    entries = sorted((entry for entry in fetch_entries(args.feed_url) if entry["id"] > cursor), key=lambda entry: entry["id"])
    classified = [classify_entry(entry, known_urls) for entry in entries]
    contiguous_cursor = advance_contiguous_cursor(cursor, [entry["id"] for entry in entries])
    deferred_numeric_ids = list(range(contiguous_cursor + 1, max([cursor, *[entry["id"] for entry in entries]])))
    report = {
        "ran_at": datetime.now(timezone.utc).isoformat(),
        "feed_url": args.feed_url,
        "cursor_before": cursor,
        "fetched_unseen": len(entries),
        "candidates": [entry for entry in classified if entry["decision"] == "candidate"],
        "skipped": [entry for entry in classified if entry["decision"] == "skip"],
        "model_calls": 0,
        "publication_actions": 0,
        "cursor_after": contiguous_cursor,
        "deferred_numeric_ids": deferred_numeric_ids,
        "state_committed": False,
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)
    output = args.output_dir / f"collector-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    if args.commit_state:
        state["last_seen_post_id"] = report["cursor_after"]
        state["known_urls"] = sorted(known_urls | {url for entry in classified for url in entry["links"]})[-500:]
        args.state.parent.mkdir(parents=True, exist_ok=True)
        args.state.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
        report["state_committed"] = True
        output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: report[key] for key in ("fetched_unseen", "candidates", "skipped", "model_calls", "cursor_before", "cursor_after", "state_committed")}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
