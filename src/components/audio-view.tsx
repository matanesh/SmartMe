import { AudioLines, Headphones, Pause, Play } from "lucide-react";
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
        הפרקים כרגע בתצוגת הדגמה, ללא קול. אפשר לנסות את הנגן.
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
              <span>{Math.round(episode.durationSeconds / 60)} דקות</span>
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
                {episode.audioUrl ? "להקשיב" : "לנסות את הנגן"}
              </button>
              <span>{episode.audioUrl ? "הקלטה" : "הדגמה · ללא קול"}</span>
            </div>
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
