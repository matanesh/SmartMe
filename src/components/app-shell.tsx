"use client";

import { useState } from "react";
import { ArrowLeft, AudioLines, Bookmark, Compass, Headphones, Hourglass, Sparkles, Sprout } from "lucide-react";
import { knowledgeItems } from "@/data/knowledge";
import { TOPICS, type KnowledgeItem, type Topic } from "@/lib/models";
import { KnowledgeCard } from "./knowledge-card";

export function AppShell() {
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [view, setView] = useState("discover");
  const toggle = (id: string, list: string[], setter: (next: string[]) => void) => setter(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  const items = knowledgeItems.filter(item => (topic === "all" || item.topic === topic) && (view !== "saved" || saved.includes(item.id)));
  const share = async (item: KnowledgeItem) => { if (navigator.share) await navigator.share({ title: item.title, text: item.content }).catch(() => {}); else await navigator.clipboard?.writeText(`${item.title}\n\n${item.content}`); };
  const nav = [{ id: "discover", label: "לגלות", icon: Compass }, { id: "sessions", label: "יש לי 5 דקות", icon: Hourglass }, { id: "audio", label: "להקשיב", icon: Headphones }, { id: "saved", label: "השמורים שלי", icon: Bookmark }];
  return <div className="app-frame">
    <aside className="navigation-rail"><a className="brand" href="/" aria-label="רגע — לדף הבית"><span className="brand-symbol">✳</span>רגע<span className="brand-dot">.</span></a><p className="brand-caption">משהו קטן לדעת.</p><nav aria-label="ניווט ראשי">{nav.map(({id,label,icon:Icon}) => <button className={`nav-item ${view === id ? "active" : ""}`} key={id} onClick={() => setView(id)}><Icon size={21}/><span>{label}</span>{id === "saved" && saved.length > 0 && <span className="nav-count">{saved.length}</span>}</button>)}</nav><div className="rail-note"><span className="little-spark">✳</span><p>עוד קצת סקרנות.<br/>קצת פחות אוטומט.</p></div><div className="rail-footer"><span>נפגשים ברגע הפנוי הבא</span><span>גרסת ניסיון · עם סקרנות, בעברית</span></div></aside>
    <div className="workspace"><header className="mobile-header"><a className="brand" href="/"><span className="brand-symbol">✳</span>רגע<span className="brand-dot">.</span></a><span className="daily-pill"><Sprout size={16}/>{read.length ? `${read.length} רעיונות היום` : "רגע טוב להתחיל"}</span></header>
      <div className="page-topline"><span>קצת זמן פנוי, הרבה מה לגלות</span><span className="daily-pill"><Sprout size={16}/>{read.length ? `למדת היום ${read.length} רעיונות` : "כל רעיון הוא התחלה"}</span></div>
      <div className="workspace-columns"><main id="main-content"><div className="page-heading"><div><div className="eyebrow">לפנות מקום לסקרנות</div><h1>{view === "saved" ? "שווה לשמור." : "רגע, יש פה משהו מעניין."}</h1><p>רעיונות גדולים. במנות קטנות.</p></div><span className="heading-spark" aria-hidden="true">✳</span></div>
        <div className="topic-tabs" role="group" aria-label="בחירת נושא"><button className={topic === "all" ? "selected" : ""} aria-pressed={topic === "all"} onClick={() => setTopic("all")}><Sparkles size={15}/>בשבילך</button>{TOPICS.map(t => <button key={t} className={topic === t ? "selected" : ""} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>)}</div>
        <div className="feed-heading"><h2>{view === "saved" ? "הרעיונות שלך" : topic === "all" ? "הגילויים של היום" : `רגע של ${topic}`}</h2><span>{items.length} רעיונות לסקרנות שלך</span></div>
        <div className="feed">{items.map((item, index) => <KnowledgeCard key={item.id} item={item} featured={index === 0 && topic === "all" && view !== "saved"} saved={saved.includes(item.id)} liked={liked.includes(item.id)} read={read.includes(item.id)} onSave={id => toggle(id,saved,setSaved)} onLike={id => toggle(id,liked,setLiked)} onShare={share} onRead={id => setRead(prev => prev.includes(id) ? prev : [...prev,id])}/>)}</div>
        {items.length === 0 && <div className="empty-state"><Bookmark size={30}/><h2>מקום לרעיונות שיישארו איתך.</h2><p>לחיצה על סימניית השמירה בכרטיס, והרעיון יחכה לך כאן.</p><button className="primary-button" onClick={() => { setView("discover"); setTopic("all"); }}>לגלות רעיון <ArrowLeft size={17}/></button></div>}
      </main><aside className="discovery-sidebar"><section className="session-promo"><div className="side-eyebrow"><Hourglass size={16}/>יש לך רגע?</div><div className="session-number" aria-hidden="true">5<span>דקות של גילוי</span></div><h2>5 דברים שהמוח שלך עושה בלי שתשים לב</h2><p>מסע קצר בין קיצורי הדרך שבראש שלנו.</p><button className="dark-button" onClick={() => setView("sessions")}>בואו נתחיל <ArrowLeft size={17}/></button><div className="promo-foot"><span>5 רעיונות</span><span>פחות מגלילה אחת ארוכה</span></div></section><section className="sidebar-audio"><div className="section-title"><h2>לתת לאוזניים לגלות</h2><Headphones size={18}/></div><div className="audio-preview"><div className="audio-art accent-sage"><AudioLines size={31}/></div><div><h3>למה אנחנו דוחים דברים?</h3><p>7 דקות · פסיכולוגיה</p></div></div><button className="text-button" onClick={() => setView("audio")}>לכל רגעי ההקשבה <ArrowLeft size={16}/></button></section><section className="daily-note"><Sprout size={20}/><div><h3>לא צריך לדעת הכול.</h3><p>מספיק לגלות משהו אחד<br/>שלא ידעת לפני רגע.</p></div></section><p className="sidebar-signoff">ידע קטן. עולם קצת יותר גדול.</p></aside></div>
    </div><nav className="bottom-nav" aria-label="ניווט בנייד">{nav.map(({id,label,icon:Icon}) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><Icon size={22}/><span>{label}</span></button>)}</nav>
  </div>;
}
