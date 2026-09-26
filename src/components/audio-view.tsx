import {
  ArrowUpLeft,
  AudioLines,
  FileText,
  Headphones,
  Pause,
  Play,
  ShieldCheck,
} from "lucide-react";
import { contentRepository } from "@/lib/content-repository";
import type { AudioPlayerState } from "@/hooks/use-audio-player";

export function AudioView({
  player,
  navigate,
}: {
  player: AudioPlayerState;
  navigate: (route: string) => void;
}) {
  return (
    <div className="audio-library">
      <div className="audio-intro">
        <Headphones size={28} />
        <div>
          <h2>ללכת, לנוח, לגלות.</h2>
          <p>כמה דקות של רעיונות, בקצב שלך.</p>
        </div>
      </div>
      <p className="demo-notice">
        שני פרקים אמיתיים זמינים עכשיו. לכל פרק יש תמליל מלא, מקורות ופרטי בדיקה
        גלויים.
      </p>
      {contentRepository.getEpisodes().map((episode, index) => (
        <article className="episode-card" key={episode.id}>
          <div className={`episode-art accent-${episode.accent}`}>
            <AudioLines size={54} strokeWidth={1.3} />
            <span>רגע להקשיב</span>
            <small dir="ltr">0{index + 1}</small>
          </div>
          <div className="episode-info">
            <div className="card-meta">
              <span>{episode.topic}</span>
              <span>
                {Math.floor(episode.durationSeconds / 60)}:
                {String(episode.durationSeconds % 60).padStart(2, "0")} דקות
              </span>
              <span>{episode.sources.length} מקורות</span>
            </div>
            <h2>{episode.title}</h2>
            <p>{episode.description}</p>
            <div className="episode-footer">
              <button
                className="episode-play"
                aria-label={`${player.episode?.id === episode.id && player.isPlaying ? "השהיית" : "ניגון"} ${episode.title}`}
                onClick={() => player.select(episode)}
              >
                {player.episode?.id === episode.id && player.isPlaying ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
                להקשיב
              </button>
              <span>הקלטה נבדקה · {episode.reviewedAt}</span>
            </div>
            <details className="episode-transcript">
              <summary>
                <FileText size={16} /> תמליל מלא ומקורות
              </summary>
              <div className="episode-trust">
                <p className="episode-disclosure">
                  <ShieldCheck size={17} /> {episode.voiceDisclosure}
                </p>
                <p>{episode.editorialDisclosure}</p>
                <p>
                  פורסם {episode.publishedAt} · נבדק {episode.reviewedAt} · מזהה
                  קובץ <code>{episode.checksumSha256.slice(0, 12)}…</code>
                </p>
                <div className="episode-transcript-copy">
                  {episode.transcript.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <h3>מקורות</h3>
                <ul>
                  {episode.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.label} <ArrowUpLeft size={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
            <details className="episode-related">
              <summary>הרעיונות שמאחורי הפרק</summary>
              {episode.relatedItems.map((id) => {
                const item = contentRepository.getItem(id);
                return (
                  item && (
                    <button
                      key={id}
                      className="related-link"
                      onClick={() => navigate(`idea/${id}`)}
                    >
                      {item.title.replace(/\n/g, " ")}
                    </button>
                  )
                );
              })}
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
