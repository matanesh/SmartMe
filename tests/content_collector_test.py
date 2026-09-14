"""Behavior tests for the no-model SmartMe content-radar collector."""

from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from content_collector import (  # noqa: E402
    advance_contiguous_cursor,
    classify_entry,
    normalize_url,
)


class ContentCollectorTests(unittest.TestCase):
    def test_normalize_url_removes_tracking_and_fragment(self):
        self.assertEqual(
            normalize_url("https://example.com/path/?utm_source=feed&utm_medium=x#section"),
            "https://example.com/path",
        )

    def test_cursor_does_not_advance_across_unparsed_numeric_gap(self):
        self.assertEqual(advance_contiguous_cursor(11074, [11076, 11077, 11079]), 11074)
        self.assertEqual(advance_contiguous_cursor(11074, [11075, 11076]), 11076)

    def test_classify_entry_flags_ai_with_primary_link_as_candidate(self):
        result = classify_entry(
            {
                "id": 11075,
                "text": "מודל AI חדש עם תיעוד רשמי ומאגר GitHub",
                "links": ["https://github.com/example/project"],
            },
            known_urls=set(),
        )
        self.assertEqual(result["decision"], "candidate")
        self.assertGreaterEqual(result["score"], 3)

    def test_classify_entry_skips_duplicate_or_rumor_without_calling_a_model(self):
        duplicate = classify_entry(
            {
                "id": 11076,
                "text": "דליפה: מכשיר חדש אולי מגיע",
                "links": ["https://example.com/already-known"],
            },
            known_urls={"https://example.com/already-known"},
        )
        self.assertEqual(duplicate["decision"], "skip")
        self.assertIn("duplicate", duplicate["reasons"])

        rumor = classify_entry(
            {"id": 11077, "text": "שמועה לא מאומתת על מודל חדש", "links": []},
            known_urls=set(),
        )
        self.assertEqual(rumor["decision"], "skip")
        self.assertIn("rumor-or-unverified", rumor["reasons"])


if __name__ == "__main__":
    unittest.main()
