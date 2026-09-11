import { Bookmark, Compass, Headphones, Hourglass } from "lucide-react";

const nav = [
  { id: "discover", label: "לגלות", icon: Compass },
  { id: "sessions", label: "יש לי 5 דקות", icon: Hourglass },
  { id: "audio", label: "להקשיב", icon: Headphones },
  { id: "saved", label: "השמורים שלי", icon: Bookmark },
];
export function Brand() {
  return (
    <a className="brand" href="#discover" aria-label="רגע — לדף הבית">
      <span className="brand-symbol" aria-hidden="true">
        ✳
      </span>
      רגע<span className="brand-dot">.</span>
    </a>
  );
}
export function Navigation({
  view,
  savedCount,
  navigate,
}: {
  view: string;
  savedCount: number;
  navigate: (view: string) => void;
}) {
  return (
    <>
      <aside className="navigation-rail">
        <Brand />
        <p className="brand-caption">משהו קטן לדעת.</p>
        <nav aria-label="ניווט ראשי">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              className={`nav-item ${view === id ? "active" : ""}`}
              aria-current={view === id ? "page" : undefined}
              key={id}
              onClick={() => navigate(id)}
            >
              <Icon size={21} />
              <span>{label}</span>
              {id === "saved" && savedCount > 0 && (
                <span className="nav-count">{savedCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="rail-note">
          <span className="little-spark" aria-hidden="true">
            ✳
          </span>
          <p>
            עוד קצת סקרנות.
            <br />
            קצת פחות אוטומט.
          </p>
        </div>
        <div className="rail-footer">
          <span>נפגשים ברגע הפנוי הבא</span>
          <span>גרסת ניסיון · עם סקרנות, בעברית</span>
        </div>
      </aside>
      <nav className="bottom-nav" aria-label="ניווט בנייד">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            aria-current={view === id ? "page" : undefined}
            onClick={() => navigate(id)}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
