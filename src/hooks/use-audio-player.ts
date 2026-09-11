"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioEpisode } from "@/lib/models";

export function useAudioPlayer() {
  const [episode, setEpisode] = useState<AudioEpisode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [rate, setRate] = useState(1);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bindAudio = useCallback((node: HTMLAudioElement | null) => {
    audioRef.current = node;
  }, []);
  const duration = mediaDuration || episode?.durationSeconds || 0;
  const finished = position >= duration;
  useEffect(() => {
    if (!episode?.audioUrl || !audioRef.current) return;
    const media = audioRef.current;
    media.playbackRate = rate;
    if (playing) {
      let cancelled = false;
      media.play().catch(() => {
        if (!cancelled) {
          setPlaying(false);
          setError("ההקלטה לא נטענה. אפשר לנסות שוב.");
        }
      });
      return () => {
        cancelled = true;
        media.pause();
      };
    }
    media.pause();
  }, [episode, playing, rate]);
  useEffect(() => {
    if (!episode || episode.audioUrl || !playing || finished) return;
    // Deliberately silent preview; supply audioUrl to use the real media element.
    const timer = window.setInterval(
      () => setPosition((p) => Math.min(p + rate, duration)),
      1000,
    );
    return () => clearInterval(timer);
  }, [episode, playing, duration, rate, finished]);
  const isPlaying = playing && position < duration;
  function select(next: AudioEpisode) {
    if (next.id === episode?.id) {
      toggle();
      return;
    }
    setEpisode(next);
    setPosition(0);
    setMediaDuration(0);
    setError("");
    setPlaying(true);
  }
  function seek(next: number) {
    const bounded = Math.min(duration, Math.max(0, next));
    setPosition(bounded);
    if (audioRef.current && episode?.audioUrl)
      audioRef.current.currentTime = bounded;
  }
  function toggle() {
    setError("");
    if (position >= duration) {
      seek(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  }
  return {
    episode,
    isPlaying,
    position,
    rate,
    duration,
    error,
    bindAudio,
    select,
    toggle,
    seek,
    close: () => {
      setPlaying(false);
      setEpisode(null);
    },
    cycleRate: () => setRate((r) => (r === 1 ? 1.25 : r === 1.25 ? 1.5 : 1)),
    onTimeUpdate: () => {
      if (audioRef.current) setPosition(audioRef.current.currentTime);
    },
    onLoadedMetadata: () => {
      if (audioRef.current && Number.isFinite(audioRef.current.duration))
        setMediaDuration(audioRef.current.duration);
    },
    onEnded: () => setPlaying(false),
    onError: () => {
      setPlaying(false);
      setError("ההקלטה לא זמינה כרגע. אפשר לנסות שוב.");
    },
  };
}
export type AudioPlayerState = ReturnType<typeof useAudioPlayer>;
