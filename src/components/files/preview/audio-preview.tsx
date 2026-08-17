"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, VolumeX, Loader2, RotateCcw } from "lucide-react";

interface AudioPreviewProps {
  src: string;
  fileName: string;
  extension?: string;
}

export function AudioPreview({ src, fileName, extension }: AudioPreviewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsBuffering(true);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setIsBuffering(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full max-w-xl p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Audio Icon / Spinning Vinyl Disc Visual */}
      <div className="relative flex items-center justify-center">
        <div
          className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-blue-600/40 via-purple-600/30 to-indigo-600/40 border border-white/20 flex items-center justify-center shadow-2xl transition-transform duration-300 ${
            isPlaying ? "animate-[spin_6s_linear_infinite]" : ""
          }`}
        >
          {/* Outer vinyl groove ring */}
          <div className="w-28 h-28 md:w-34 md:h-34 rounded-full border border-white/10 flex items-center justify-center">
            {/* Inner vinyl groove ring */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/15 flex items-center justify-center">
              {/* Center vinyl label */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 border border-white/25 flex items-center justify-center shadow-inner">
                <Music size={24} className="text-blue-300" />
              </div>
            </div>
          </div>
        </div>

        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm">
            <Loader2 size={36} className="text-blue-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Track Title */}
      <div className="text-center w-full min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-white truncate px-4" title={fileName}>
          {fileName}
        </h3>
        <p className="text-xs uppercase tracking-wider text-white/50 font-mono mt-0.5">
          {extension ? `.${extension}` : "Audio Stream"}
        </p>
      </div>

      {/* Progress Slider */}
      <div className="w-full flex flex-col gap-1.5">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
        />
        <div className="flex justify-between text-[11px] font-mono text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls (3-Column Grid with Center Play Button) */}
      <div className="grid grid-cols-3 items-center w-full pt-2">
        {/* Left: Restart Button */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
              }
            }}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            title="Restart"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Center: Play/Pause Button (Strict Center) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            disabled={isBuffering && duration === 0}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* Right: Volume Controls */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
}
