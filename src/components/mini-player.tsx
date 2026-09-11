import { AudioLines, Pause, Play, RotateCcw, RotateCw, X } from "lucide-react";
import type { AudioPlayerState } from "@/hooks/use-audio-player";
export function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
export function MiniPlayer({ player }: { player: AudioPlayerState }) {
  const episode = player.episode;
  if (!episode) return null;
  return (
    <section className="mini-player" aria-label="נגן שמע">
      <div className="mini-main">
        <div className={`mini-art accent-${episode.accent}`}>
          <AudioLines size={24} />
        </div>
        <div className="mini-title">
          <h2>{episode.title}</h2>
          <p role={player.error ? "alert" : undefined}>
            {player.error ||
              (episode.audioUrl ? episode.topic : "תצוגת הדגמה · ללא קול")}
          </p>
        </div>
        <button
          className="icon-button player-skip"
          aria-label="אחורה 15 שניות"
          onClick={() => player.seek(player.position - 15)}
        >
          <RotateCcw size={20} />
          <small>15</small>
        </button>
        <button
          className="mini-play"
          aria-label={player.isPlaying ? "השהיה" : "ניגון"}
          onClick={player.toggle}
        >
          {player.isPlaying ? (
            <Pause size={21} fill="currentColor" />
          ) : (
            <Play size={21} fill="currentColor" />
          )}
        </button>
        <button
          className="icon-button player-skip"
          aria-label="קדימה 15 שניות"
          onClick={() => player.seek(player.position + 15)}
        >
          <RotateCw size={20} />
          <small>15</small>
        </button>
        <button
          className="playback-rate"
          aria-label={`מהירות ניגון ${player.rate}`}
          onClick={player.cycleRate}
          dir="ltr"
        >
          {player.rate}×
        </button>
        <button
          className="icon-button mini-close"
          aria-label="סגירת הנגן"
          onClick={player.close}
        >
          <X size={18} />
        </button>
      </div>
      <div className="player-timeline" dir="ltr">
        <span>{formatTime(player.position)}</span>
        <input
          type="range"
          aria-label="מיקום בפרק"
          min={0}
          max={player.duration}
          step={1}
          value={player.position}
          onChange={(event) => player.seek(Number(event.target.value))}
        />
        <span>{formatTime(player.duration)}</span>
      </div>
      {episode.audioUrl && (
        <audio
          ref={(node) => player.bindAudio(node)}
          src={episode.audioUrl}
          preload="metadata"
          onTimeUpdate={player.onTimeUpdate}
          onLoadedMetadata={player.onLoadedMetadata}
          onEnded={player.onEnded}
          onError={player.onError}
        />
      )}
    </section>
  );
}
