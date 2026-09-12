"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Sparkles,
  Sprout,
} from "lucide-react";
import { contentRepository } from "@/lib/content-repository";
import { TOPICS, type KnowledgeItem, type Topic } from "@/lib/models";
import { getDailyProgressLabel } from "@/lib/progress-label";
import { useProgress } from "@/hooks/use-progress";
import { useRoute } from "@/hooks/use-route";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { KnowledgeCard } from "./knowledge-card";
import { Brand, Navigation } from "./navigation";
import { DiscoverySidebar, SessionPromo } from "./discovery-sidebar";
import { SessionView } from "./session-view";
import { AudioView } from "./audio-view";
import { MiniPlayer } from "./mini-player";
import { ShareSheet, type ShareDraft } from "./share-sheet";

const headings: Record<
  string,
  { title: string; subtitle: string; eyebrow: string }
> = {
  discover: {
    title: "רגע, יש פה משהו מעניין.",
    subtitle: "רעיונות גדולים. במנות קטנות.",
    eyebrow: "לפנות מקום לסקרנות",
  },
  saved: {
    title: "שווה לשמור.",
    subtitle: "הרעיונות שעצרו אותך לרגע, במקום אחד.",
    eyebrow: "אוסף קטן, לגמרי שלך",
  },
  sessions: {
    title: "יש לי 5 דקות.",
    subtitle: "נושא אחד. חמישה רעיונות. משהו לקחת להמשך.",
    eyebrow: "קצת זמן לעצמך",
  },
  audio: {
    title: "רגע להקשיב.",
    subtitle: "רעיונות טובים לא חייבים לקרוא.",
    eyebrow: "סקרנות, גם כשהעיניים נחות",
  },
  idea: {
    title: "רעיון ששווה רגע.",
    subtitle: "לפעמים רעיון אחד פותח כיוון חדש.",
    eyebrow: "משהו קטן לדעת",
  },
};

export function AppShell() {
  const { route, navigate: go } = useRoute();
  const [routeView, detailId] = route.split("/");
  const view = headings[routeView] ? routeView : "discover";
  const state = useProgress();
  const player = useAudioPlayer();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [visibleCount, setVisibleCount] = useState(8);
  const [toast, setToast] = useState("");
  const [shareDraft, setShareDraft] = useState<ShareDraft | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(toastTimeout.current), []);
  const heading = headings[view];
  const navigate = (next: string) => {
    setTopic("all");
    setVisibleCount(8);
    go(next);
  };
  const notify = (text: string) => {
    setToast(text);
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(""), 2800);
  };
  const share = (item: KnowledgeItem) => {
    const url =
      window.location.origin + window.location.pathname + "#idea/" + item.id;
    const title = item.title.replace(/\n/g, " ");
    const text = [title, item.content, item.source, item.sourceUrl, url]
      .filter(Boolean)
      .join("\n\n");
    setShareDraft({
      title,
      text,
      url,
      supportsNative: typeof navigator.share === "function",
    });
  };
  const card = (item: KnowledgeItem, featured = false) => (
    <KnowledgeCard
      key={item.id}
      item={item}
      featured={featured}
      saved={state.progress.savedIds.includes(item.id)}
      liked={state.progress.likedIds.includes(item.id)}
      read={state.todayReads.includes(item.id)}
      onSave={(id) => {
        const wasSaved = state.progress.savedIds.includes(id);
        state.toggleSaved(id);
        notify(wasSaved ? "הרעיון הוסר מהשמורים" : "נשמר לך לרגע אחר");
      }}
      onLike={state.toggleLiked}
      onShare={share}
      onRead={(id) => {
        state.markRead(id);
        notify("עוד רעיון לקחת איתך היום");
      }}
    />
  );
  const items = contentRepository
    .getItems(topic === "all" ? undefined : topic)
    .filter(
      (item) => view !== "saved" || state.progress.savedIds.includes(item.id),
    );
  const detailItem =
    view === "idea" ? contentRepository.getItem(detailId) : undefined;
  const progressLabel = getDailyProgressLabel(state.todayReads.length);

  return (
    <div className={"app-frame " + (player.episode ? "has-player" : "")}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        דילוג לתוכן
      </a>
      <Navigation
        view={view}
        savedCount={state.progress.savedIds.length}
        navigate={navigate}
      />
      <div className="workspace">
        <header className="mobile-header">
          <Brand />
          <span className="daily-pill">
            <Sprout size={16} />
            {state.todayReads.length === 1
              ? "רעיון אחד היום"
              : state.todayReads.length
                ? state.todayReads.length + " רעיונות היום"
                : "רגע טוב להתחיל"}
          </span>
        </header>
        <div className="page-topline">
          <span>קצת זמן פנוי, הרבה מה לגלות</span>
          <span className="daily-pill">
            <Sprout size={16} />
            {progressLabel}
          </span>
        </div>
        <div className="workspace-columns">
          <main id="main-content" tabIndex={-1}>
            <div className="page-heading">
              <div>
                <div className="eyebrow">{heading.eyebrow}</div>
                <h1>{heading.title}</h1>
                <p>{heading.subtitle}</p>
              </div>
              <span className="heading-spark" aria-hidden="true">
                ✳
              </span>
            </div>
            {!state.storageAvailable && (
              <p className="storage-notice" role="status">
                השמירה במכשיר אינה זמינה. הרעיונות יישמרו רק עד סגירת העמוד.
              </p>
            )}
            {(view === "discover" || view === "saved") && (
              <>
                <div
                  className="topic-tabs"
                  role="group"
                  aria-label="בחירת נושא"
                >
                  <button
                    className={topic === "all" ? "selected" : ""}
                    aria-pressed={topic === "all"}
                    onClick={() => {
                      setTopic("all");
                      setVisibleCount(8);
                    }}
                  >
                    <Sparkles size={15} />
                    {view === "saved" ? "כל השמורים" : "בשבילך"}
                  </button>
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      className={topic === t ? "selected" : ""}
                      aria-pressed={topic === t}
                      onClick={() => {
                        setTopic(t);
                        setVisibleCount(8);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="feed-heading">
                  <h2>
                    {view === "saved"
                      ? "הרעיונות שלך"
                      : topic === "all"
                        ? "הגילויים של היום"
                        : "רגע של " + topic}
                  </h2>
                  <span>
                    {items.length === 1
                      ? "רעיון אחד לסקרנות שלך"
                      : `${items.length} רעיונות לסקרנות שלך`}
                  </span>
                </div>
                <div className="feed">
                  {items.slice(0, visibleCount).map((item, index) => (
                    <Fragment key={item.id}>
                      {card(
                        item,
                        item.id === "brain-shortcuts" &&
                          view === "discover" &&
                          topic === "all",
                      )}
                      {index === 1 &&
                        view === "discover" &&
                        topic === "all" && (
                          <div className="mobile-session-promo">
                            <SessionPromo navigate={navigate} compact />
                          </div>
                        )}
                    </Fragment>
                  ))}
                </div>
                {items.length > visibleCount && (
                  <button
                    className="more-button"
                    onClick={() => setVisibleCount((count) => count + 8)}
                  >
                    יש עוד מה לגלות <ArrowLeft size={17} />
                    <span>{items.length - visibleCount} רעיונות נוספים</span>
                  </button>
                )}
                {items.length > 0 && items.length <= visibleCount && (
                  <div className="feed-end">
                    <Sprout size={23} />
                    <p>קצת יותר ידע ממה שהיה לפני רגע.</p>
                    <span>זה גם רגע טוב לחזור ליום שלך.</span>
                  </div>
                )}
                {items.length === 0 && (
                  <div className="empty-state">
                    <Bookmark size={30} />
                    <h2>
                      {topic === "all"
                        ? "מקום לרעיונות שיישארו איתך."
                        : "עוד אין כאן רעיונות בנושא הזה."}
                    </h2>
                    <p>לחיצה על סימניית השמירה בכרטיס, והרעיון יחכה לך כאן.</p>
                    <button
                      className="primary-button"
                      onClick={() => navigate("discover")}
                    >
                      לגלות רעיון <ArrowLeft size={17} />
                    </button>
                  </div>
                )}
              </>
            )}
            {view === "sessions" && (
              <SessionView
                id={detailId}
                state={state}
                navigate={navigate}
                onShare={share}
              />
            )}
            {view === "audio" && (
              <AudioView player={player} navigate={navigate} />
            )}
            {view === "idea" && (
              <div className="idea-detail">
                <button
                  className="back-button"
                  onClick={() => navigate("discover")}
                >
                  <ArrowRight size={17} />
                  חזרה לגילויים
                </button>
                {detailItem ? (
                  card(detailItem)
                ) : (
                  <div className="empty-state">
                    <h2>הרעיון הזה לא נמצא.</h2>
                    <p>אולי הקישור השתנה. בפיד מחכים עוד רעיונות.</p>
                  </div>
                )}
              </div>
            )}
          </main>
          <DiscoverySidebar navigate={navigate} />
        </div>
      </div>
      <MiniPlayer player={player} />
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
      {shareDraft && (
        <ShareSheet draft={shareDraft} onClose={() => setShareDraft(null)} />
      )}
    </div>
  );
}
