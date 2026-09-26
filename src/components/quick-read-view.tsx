"use client";

import { ArrowRight, ArrowUpLeft, BookOpen, Clock3, Scale } from "lucide-react";
import type { QuickRead } from "@/data/quick-reads";

interface Props {
  quickRead: QuickRead;
  navigate: (route: string) => void;
}

export function QuickReadView({ quickRead, navigate }: Props) {
  return (
    <article className="quick-read" aria-labelledby="quick-read-title">
      <button className="back-button" onClick={() => navigate("discover")}>
        <ArrowRight size={17} />
        חזרה לגילויים
      </button>

      <header className="quick-read-hero">
        <div className="quick-read-kicker">
          <BookOpen size={17} />
          קריאה מהירה · {quickRead.topic}
        </div>
        <h2 id="quick-read-title">{quickRead.title}</h2>
        <p>{quickRead.dek}</p>
        <div className="quick-read-byline">
          <span>
            <Clock3 size={15} /> {quickRead.estimatedMinutes} דקות
          </span>
          <span>{quickRead.sourceCreator}</span>
        </div>
      </header>

      <div className="quick-read-body">
        {quickRead.sections.map((section) => (
          <section key={section.heading}>
            <h3>{section.heading}</h3>
            <p>{section.body}</p>
          </section>
        ))}
        <aside className="quick-read-action" aria-label="משהו לנסות">
          <strong>ניסוי קטן להיום</strong>
          <p>{quickRead.action}</p>
        </aside>
      </div>

      <footer className="quick-read-provenance">
        <div className="provenance-title">
          <Scale size={18} />
          <h3>מקור, עיבוד וזכויות</h3>
        </div>
        <p>{quickRead.editorialDisclosure}</p>
        <dl>
          <div>
            <dt>סטטוס</dt>
            <dd>מקור בנחלת הכלל · עיבוד מערכתי מקורי</dd>
          </div>
          <div>
            <dt>בסיס הבדיקה</dt>
            <dd>{quickRead.rights.basis}</dd>
          </div>
          <div>
            <dt>שיטת העיבוד</dt>
            <dd>{quickRead.rights.method}</dd>
          </div>
          <div>
            <dt>נבדק</dt>
            <dd>
              {quickRead.rights.reviewedAt} ·{" "}
              {quickRead.rights.jurisdictionsReviewed.join("; ")}
            </dd>
          </div>
        </dl>
        <ul aria-label="מקורות הקריאה ובדיקת הזכויות">
          {quickRead.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label} <ArrowUpLeft size={13} />
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
