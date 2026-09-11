import {
  ArrowLeft,
  AudioLines,
  Headphones,
  Hourglass,
  Sprout,
} from "lucide-react";

export function SessionPromo({
  navigate,
  compact = false,
}: {
  navigate: (route: string) => void;
  compact?: boolean;
}) {
  return (
    <section className={`session-promo ${compact ? "compact-promo" : ""}`}>
      <div className="side-eyebrow">
        <Hourglass size={16} />
        יש לך רגע?
      </div>
      <div className="session-number" aria-hidden="true">
        5<span>דקות של גילוי</span>
      </div>
      <h2>5 דברים שהמוח שלך עושה בלי שתשים לב</h2>
      <p>מסע קצר בין קיצורי הדרך שבראש שלנו.</p>
      <button
        className="dark-button"
        onClick={() => navigate("sessions/brain")}
      >
        בואו נתחיל <ArrowLeft size={17} />
      </button>
      <div className="promo-foot">
        <span>5 רעיונות</span>
        <span>פחות מגלילה אחת ארוכה</span>
      </div>
    </section>
  );
}
export function DiscoverySidebar({
  navigate,
}: {
  navigate: (route: string) => void;
}) {
  return (
    <aside className="discovery-sidebar">
      <SessionPromo navigate={navigate} />
      <section className="sidebar-audio">
        <div className="section-title">
          <h2>לתת לאוזניים לגלות</h2>
          <Headphones size={18} />
        </div>
        <div className="audio-preview">
          <div className="audio-art accent-sage">
            <AudioLines size={31} />
          </div>
          <div>
            <h3>למה אנחנו דוחים דברים?</h3>
            <p>7 דקות · פסיכולוגיה</p>
          </div>
        </div>
        <button className="text-button" onClick={() => navigate("audio")}>
          לכל רגעי ההקשבה <ArrowLeft size={16} />
        </button>
      </section>
      <section className="daily-note">
        <Sprout size={20} />
        <div>
          <h3>לא צריך לדעת הכול.</h3>
          <p>
            מספיק לגלות משהו אחד
            <br />
            שלא ידעת לפני רגע.
          </p>
        </div>
      </section>
      <p className="sidebar-signoff">ידע קטן. עולם קצת יותר גדול.</p>
    </aside>
  );
}
