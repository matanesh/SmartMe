"use client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Hourglass,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { contentRepository } from "@/lib/content-repository";
import type { KnowledgeItem } from "@/lib/models";
import type { ProgressActions } from "@/hooks/use-progress";
import { KnowledgeCard } from "./knowledge-card";

export function SessionView({
  id,
  state,
  navigate,
  onShare,
}: {
  id?: string;
  state: ProgressActions;
  navigate: (route: string) => void;
  onShare: (item: KnowledgeItem) => void;
}) {
  const sessions = contentRepository.getSessions();
  const session = id ? contentRepository.getSession(id) : undefined;
  if (!session)
    return (
      <div className="session-list">
        {sessions.map((s, index) => {
          const step = state.progress.sessionProgress[s.id] ?? 0;
          return (
            <button
              className={`session-tile accent-${s.accent}`}
              onClick={() => navigate(`sessions/${s.id}`)}
              key={s.id}
            >
              <div className="session-tile-top">
                <span>
                  <Hourglass size={16} /> {s.estimatedMinutes} דקות ·{" "}
                  {s.itemIds.length} רעיונות
                </span>
                <span className="collection-number">0{index + 1}</span>
              </div>
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <div className="session-tile-footer">
                <span>
                  {step === 5
                    ? "המסע הושלם — אפשר לחזור אליו"
                    : step
                      ? `להמשיך מרעיון ${step + 1} מתוך 5`
                      : "לצאת למסע קצר"}
                </span>
                <ArrowLeft size={20} />
              </div>
              {step > 0 && (
                <progress value={step} max={5} aria-label="התקדמות במסע" />
              )}
            </button>
          );
        })}
      </div>
    );
  const step = Math.min(
    state.progress.sessionProgress[session.id] ?? 0,
    session.itemIds.length,
  );
  const item = contentRepository.getItem(session.itemIds[step]);
  const complete = () => {
    if (item) state.markRead(item.id);
    state.setSessionProgress(session.id, step + 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <div className="session-reader">
      <button className="back-button" onClick={() => navigate("sessions")}>
        <ArrowRight size={16} />
        לכל המסעות הקצרים
      </button>
      <div className="session-reader-title">
        <span className="eyebrow">יש לי 5 דקות</span>
        <h2>{session.title}</h2>
      </div>
      <div className="session-progress">
        <div
          className="progress-segments"
          role="progressbar"
          aria-label="התקדמות במסע"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={step}
        >
          {session.itemIds.map((itemId, index) => (
            <span
              className={
                index < step ? "done" : index === step ? "current" : ""
              }
              key={itemId}
            />
          ))}
        </div>
        <span>
          {step === 5 ? "5 מתוך 5 · הושלם" : `רעיון ${step + 1} מתוך 5`}
        </span>
      </div>
      {item ? (
        <>
          <KnowledgeCard
            key={`${session.id}-${step}`}
            item={item}
            saved={state.progress.savedIds.includes(item.id)}
            liked={state.progress.likedIds.includes(item.id)}
            read={state.todayReads.includes(item.id)}
            onSave={state.toggleSaved}
            onLike={state.toggleLiked}
            onRead={state.markRead}
            onShare={onShare}
          />
          <div className="session-controls">
            <button
              className="back-button"
              disabled={step === 0}
              onClick={() => state.setSessionProgress(session.id, step - 1)}
            >
              <ArrowRight size={16} />
              הקודם
            </button>
            <button className="primary-button" onClick={complete}>
              {step === 4 ? "לסיום המסע" : "לקחתי משהו, לרעיון הבא"}
              {step === 4 ? <Check size={17} /> : <ArrowLeft size={17} />}
            </button>
          </div>
          <p className="session-footnote">אפשר לעצור כאן. נזכור איפה היית.</p>
        </>
      ) : (
        <div className="session-complete">
          <span className="completion-symbol" aria-hidden="true">
            ✳
          </span>
          <span className="eyebrow">חמישה רעיונות. רגע אחד לעצמך.</span>
          <h2>יצאת עם קצת יותר.</h2>
          <p>
            איזה רעיון בא לך לקחת איתך להמשך היום?
            <br />
            הרעיונות ששמרת מחכים לך בשמורים.
          </p>
          <button className="primary-button" onClick={() => navigate("saved")}>
            לרעיונות ששמרתי <ArrowLeft size={17} />
          </button>
          <button
            className="text-button"
            onClick={() => {
              state.setSessionProgress(session.id, 0);
            }}
          >
            <RotateCcw size={15} />
            לעבור שוב על המסע
          </button>
          <button className="text-button" onClick={() => navigate("discover")}>
            <Sparkles size={15} />
            עוד משהו לגלות
          </button>
        </div>
      )}
    </div>
  );
}
