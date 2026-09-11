"use client";

import { useState } from "react";
import {
  ArrowUpLeft,
  Bookmark,
  Check,
  ChevronDown,
  Heart,
  Lightbulb,
  Share2,
  Sparkles,
} from "lucide-react";
import type { KnowledgeItem, KnowledgeType } from "@/lib/models";

const labels: Record<KnowledgeType, string> = {
  insight: "רגע של תובנה",
  fact: "עובדה מפתיעה",
  tip: "משהו לנסות",
  quote: "מילים למחשבה",
  story: "סיפור קטן",
  "did-you-know": "הידעת?",
  reveal: "רגע, מה דעתך?",
  quiz: "שאלה קטנה",
  book: "רעיון מתוך ספר",
  research: "מבט מהמחקר",
};

interface Props {
  item: KnowledgeItem;
  saved: boolean;
  liked: boolean;
  onSave: (id: string) => void;
  onLike: (id: string) => void;
  onShare: (item: KnowledgeItem) => void;
  onRead?: (id: string) => void;
  featured?: boolean;
  read?: boolean;
}
export function KnowledgeCard({
  item,
  saved,
  liked,
  onSave,
  onLike,
  onShare,
  onRead,
  featured = false,
  read = false,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const hidden = item.type === "reveal" && !revealed;
  return (
    <article
      className={`knowledge-card accent-${item.accent ?? "cream"} ${featured ? "featured" : ""}`}
      id={`idea-${item.id}`}
      aria-labelledby={`title-${item.id}`}
    >
      {featured && item.image && (
        <div
          className="card-cover"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div className="cover-label">
            <Sparkles size={14} /> בחירת העורכת
          </div>
        </div>
      )}
      <div className="card-inner">
        <div className="card-meta">
          <span className="topic-label">{item.topic}</span>
          <span>{labels[item.type]}</span>
          <span className="read-time">
            {item.estimatedReadSeconds} שנ׳ קריאה
          </span>
        </div>
        {item.quote && (
          <blockquote className="quote-text">״{item.quote}״</blockquote>
        )}
        <h2 id={`title-${item.id}`}>{item.title}</h2>
        {hidden ? (
          <button
            className="reveal-button"
            onClick={() => {
              setRevealed(true);
              onRead?.(item.id);
            }}
          >
            יש כאן משהו מפתיע <ChevronDown size={17} />
          </button>
        ) : (
          <p className="card-content">{item.content}</p>
        )}
        {item.quiz && (
          <div className="quiz-options">
            {item.quiz.options.map((option, index) => (
              <button
                key={option}
                disabled={answer !== null}
                aria-pressed={answer === index}
                className={`quiz-option ${answer !== null && index === item.quiz!.correctIndex ? "correct" : ""} ${answer === index && index !== item.quiz!.correctIndex ? "incorrect" : ""}`}
                onClick={() => {
                  setAnswer(index);
                  onRead?.(item.id);
                }}
              >
                <span>{option}</span>
                {answer !== null && index === item.quiz!.correctIndex ? (
                  <Check size={17} />
                ) : (
                  <span className="option-letter">
                    {["א", "ב", "ג", "ד"][index]}
                  </span>
                )}
              </button>
            ))}
            {answer !== null && (
              <p className="quiz-explanation" role="status">
                <strong>
                  {answer === item.quiz.correctIndex
                    ? "בדיוק! "
                    : "כמעט — הנה הסיפור: "}
                </strong>
                {item.quiz.explanation}
              </p>
            )}
          </div>
        )}
        {item.takeaway && !hidden && (
          <div className="takeaway">
            <Lightbulb size={18} />
            <p>{item.takeaway}</p>
          </div>
        )}
        <div className="source-line">
          {item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`למקור: ${item.source}`}
            >
              {item.source}
              <ArrowUpLeft size={13} />
            </a>
          ) : (
            <span>{item.source}</span>
          )}
        </div>
        <div className="card-actions">
          <div className="actions-group">
            <button
              className={`icon-button ${saved ? "is-saved" : ""}`}
              aria-label={
                saved
                  ? `ביטול שמירה: ${item.title}`
                  : `שמירת רעיון: ${item.title}`
              }
              aria-pressed={saved}
              onClick={() => onSave(item.id)}
            >
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              className={`interesting-button ${liked ? "is-liked" : ""}`}
              aria-pressed={liked}
              aria-label={`מעניין: ${item.title}`}
              onClick={() => onLike(item.id)}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
              <span>{liked ? "מעניין אותי" : "מעניין"}</span>
            </button>
            <button
              className="icon-button"
              aria-label={`שיתוף: ${item.title}`}
              onClick={() => onShare(item)}
            >
              <Share2 size={19} />
            </button>
          </div>
          <button
            className={`read-button ${read ? "is-read" : ""}`}
            onClick={() => onRead?.(item.id)}
            disabled={read}
          >
            <Check size={15} />
            לקחתי משהו
          </button>
        </div>
      </div>
    </article>
  );
}
