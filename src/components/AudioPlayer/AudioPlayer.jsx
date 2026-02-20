// SpotifyAudioPlayer.jsx
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward } from "react-icons/fa";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.floor(time % 60) || 0;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioPlayer = ({ src, title = "Now Playing", artist = "Unknown Artist" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <div className="bg-transparent text-white rounded-xl p-0 w-full max-w-xl flex flex-col gap-1">
      <div className="flex items-center justify-center gap-1">
        <button className="transform -scale-x-100">
          <FaStepForward fontSize={20} className="text-black dark:text-white" />
        </button>

        <button
          onClick={togglePlay}
          className="bg-transparent hover:scale-105 transition"
        >
          {isPlaying ? <FaPause fontSize={20} className="text-black dark:text-white" /> : <FaPlay fontSize={20} className="text-black dark:text-white" />}
        </button>

        <button>
          <FaStepForward fontSize={20} className="text-black dark:text-white" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="w-12 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 accent-white"
        />
        <span className="w-12">{formatTime(duration)}</span>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
