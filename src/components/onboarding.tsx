"use client";

import { ArrowLeft, Check, Headphones, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  ONBOARDING_STORAGE_KEY,
  type ContentFormat,
  type OnboardingPreferences,
} from "@/lib/onboarding";
import { TOPICS, type Topic } from "@/lib/models";

export function Onboarding({
  onComplete,
}: {
  onComplete: (preferences: OnboardingPreferences) => void;
}) {
  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [format, setFormat] = useState<ContentFormat>("both");
  const finish = (preferences: OnboardingPreferences) => {
    try {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(preferences),
      );
    } catch {
      /* session still works */
    }
    onComplete(preferences);
  };
  const toggleTopic = (topic: Topic) =>
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic].slice(0, 3),
    );
  return (
    <section className="onboarding" aria-label="התאמה אישית קצרה">
      <div className="onboarding-orbit orbit-one" aria-hidden="true" />
      <div className="onboarding-orbit orbit-two" aria-hidden="true" />
      <div className="onboarding-card">
        <div className="onboarding-top">
          <span className="onboarding-brand">
            <Sparkles size={18} /> רגע
          </span>
          <button
            className="onboarding-skip"
            onClick={() => finish({ topics: [], format: "both" })}
          >
            דלג לפיד
          </button>
        </div>
        <div
          className="onboarding-progress"
          aria-label={`שלב ${step + 1} מתוך 3`}
        >
          <span className={step >= 0 ? "active" : ""} />
          <span className={step >= 1 ? "active" : ""} />
          <span className={step >= 2 ? "active" : ""} />
        </div>
        {step === 0 && (
          <div className="onboarding-step">
            <div className="onboarding-art art-spark" aria-hidden="true">
              ✦
            </div>
            <p className="onboarding-eyebrow">קודם כל, סקרנות</p>
            <h1>מה בא לך לגלות יותר?</h1>
            <p className="onboarding-copy">
              בחר עד שלושה נושאים. אפשר תמיד לשנות אחר כך.
            </p>
            <div className="onboarding-topics">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  className={topics.includes(topic) ? "chosen" : ""}
                  aria-pressed={topics.includes(topic)}
                  onClick={() => toggleTopic(topic)}
                >
                  {topics.includes(topic) && <Check size={15} />}
                  {topic}
                </button>
              ))}
            </div>
            <button className="onboarding-primary" onClick={() => setStep(1)}>
              המשך <ArrowLeft size={18} />
            </button>
          </div>
        )}
        {step === 1 && (
          <div className="onboarding-step">
            <div className="onboarding-art art-sound" aria-hidden="true">
              <Headphones size={48} />
            </div>
            <p className="onboarding-eyebrow">רגע בשבילך</p>
            <h1>איך נוח לך לגלות?</h1>
            <p className="onboarding-copy">
              נכין לך את הרגעים בפורמט שמתאים ליום שלך.
            </p>
            <div className="onboarding-formats">
              {(
                [
                  ["read", "קריאה קצרה", "רגע של דקה"],
                  ["listen", "הקשבה", "כשהעיניים נחות"],
                  ["both", "גם וגם", "מחליטים לפי הרגע"],
                ] as const
              ).map(([value, title, subtitle]) => (
                <button
                  key={value}
                  className={format === value ? "chosen" : ""}
                  aria-pressed={format === value}
                  onClick={() => setFormat(value)}
                >
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </button>
              ))}
            </div>
            <button className="onboarding-primary" onClick={() => setStep(2)}>
              המשך <ArrowLeft size={18} />
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="onboarding-step onboarding-ready">
            <div className="onboarding-art art-ready" aria-hidden="true">
              ✳
            </div>
            <p className="onboarding-eyebrow">מוכן להתחיל</p>
            <h1>הפיד שלך מחכה לך.</h1>
            <p className="onboarding-copy">
              בלי לחץ, בלי יעד יומי. רק משהו קטן ומעניין כשיש רגע.
            </p>
            <div className="onboarding-summary">
              <span>
                {topics.length
                  ? `${topics.length} נושאים שבחרת`
                  : "מכל העולמות"}
              </span>
              <span>
                {format === "listen"
                  ? "הקשבה"
                  : format === "read"
                    ? "קריאה"
                    : "קריאה והקשבה"}
              </span>
            </div>
            <button
              className="onboarding-primary"
              onClick={() => finish({ topics, format })}
            >
              לגלות רעיון ראשון <ArrowLeft size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
