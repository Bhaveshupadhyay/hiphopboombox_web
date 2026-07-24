import ReactPlayer from 'react-player';
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaExpand, FaCompress } from 'react-icons/fa';
import { LoadingSpinner } from "../index";

const CustomVideoPlayer = ({ id, videoUrl, thumbnailUrl }) => {
  // console.log(isLoading);
  
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [volRange, setVolRange] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  const handleProgress = (state) => {
    // Only update progress if we're not currently seeking
    setProgress(state.played * 100);
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value) / 100;
    // Set the progress state
    setProgress(parseFloat(e.target.value));
    // Use the seek method of ReactPlayer
    if (videoRef.current) {
      videoRef.current.seekTo(seekTo);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Handle video container clicks to toggle play/pause
  const handleVideoClick = (e) => {
    // Only toggle play/pause if the click is on the video area and not on the controls
    if (e.target === e.currentTarget || e.target.classList.contains('video-player-overlay')) {
      togglePlayPause();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs =
        document.fullscreenElement === containerRef.current ||
        document.webkitFullscreenElement === containerRef.current ||
        document.mozFullScreenElement === containerRef.current ||
        document.msFullscreenElement === containerRef.current;
      setIsFullscreen(isFs);
      setShowControls(true);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="relative w-full pb-[56.25%] bg-black">

      {/*<div className="absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse rounded-sm" />*/}

        <ReactPlayer
          url={videoUrl}
          controls={false}
          light={!hasStarted ? thumbnailUrl : false}
          playing={isPlaying}
          volume={volume}
          width="100%"
          height="100%"
          className="absolute top-0 left-0 object-contain"
          onProgress={handleProgress}
          onDuration={handleDuration}
          progressInterval={500}
          ref={videoRef}
        />
      
      {/* Transparent overlay for click to play/pause */}
      {hasStarted && (
        <div 
          className="absolute top-0 left-0 w-full h-full cursor-pointer video-player-overlay"
          onClick={handleVideoClick}
        />
      )}

      {/* Play Button at center on first load */}
      {!hasStarted && (
        <button
          onClick={handlePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 px-6 py-4 border-1 border-bg-white rounded-md hover:bg-black/40 cursor-pointer"
        >
          <FaPlay className="text-white text-xl" />
        </button>
      )}

      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black via-transparent to-transparent flex items-center gap-4">
          {/* Play / Pause Toggle */}
          <button onClick={togglePlayPause}>
            {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
          </button>

          {/* Volume Icon + Slider */}
          <div className="flex items-center gap-2">
            <FaVolumeUp className="text-white" onClick={() => setVolRange(p => !p)} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className={`w-20 accent-gray-500 cursor-pointer ${volRange ? 'inline-block' : 'hidden'}`}
            />
          </div>

          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.01"
            value={progress}
            onChange={handleSeek}
            className="flex-grow h-1 accent-gray-500 cursor-pointer"
          />

          {/* Fullscreen */}
          <button onClick={handleFullscreen}>
            {isFullscreen ? <FaCompress className="text-white" /> : <FaExpand className="text-white" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;