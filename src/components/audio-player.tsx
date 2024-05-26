"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume, LoaderCircle, X, ChevronLeft, ChevronRight, RotateCwSquare, RotateCw, RotateCcw, Settings } from "lucide-react";
import { cropAudio } from "@/lib/audioUtils";
import { useAudioPlayer } from "./audio-player-provider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface AudioPlayerProps {
  audioUrl: string;
  play?: boolean;
  transcript?: string;
}

export const AudioPlayer = ({ audioUrl, play, transcript }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(play);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1); // 1 is normal speed, 0.5 is half speed, etc.
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // Volume between 0 (mute) and 1 (max)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);

  const { closePlayer, saveTranscript } = useAudioPlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().then();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage);
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(Math.floor(audio.duration));
    }
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;

    if (progressBar && audio) {
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newTime = (clickX / rect.width) * audio.duration;

      audio.currentTime = newTime;
      setCurrentTime(newTime);

      const newProgress = (newTime / audio.duration) * 100;
      setProgress(newProgress);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Adjust the volume of the audio element
  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "snippet.wav");
    try {
      const response = await fetch("/api/whisper", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setIsFetchingTranscript(false);
      saveTranscript(data.text)
    } catch (error) {
      setIsFetchingTranscript(false);
      console.error("Error uploading audio:", error);
    }
  };

  const jump = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const adjustPlaybackSpeed = (rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const playbackRates = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.75, 2, 2.5, 3, 3.5];



  return (
    <div>
      {
        transcript && (
          <div className="p-4 bg-background/90 rounded max-h-40 overflow-y-scroll">
            <p className="text-lg">
              {transcript}
            </p>
          </div>
        )
      }
      <div className="shadow-md bg-background dark:bg-zinc-800 rounded-lg p-4 flex items-center space-x-4">
        <div className="flex flex-col w-full">
          <div className="flex justify-center items-center space-x-4">
            <Popover>
              <PopoverTrigger>
                <div>
                  {playbackRate}x
                </div>
              </PopoverTrigger>
              <PopoverContent className="space-y-2 overflow-y-scroll h-96">
                {
                  playbackRates.map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => adjustPlaybackSpeed(rate)}
                      variant="outline"
                      className="w-full"
                    >
                      {rate}x
                    </Button>
                  ))
                }
              </PopoverContent>
            </Popover>

            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={() => jump(-15)}
            >
              <div className="relative">
                <RotateCcw size={32} />
                <p className="absolute text-xs top-2 left-2.5">
                  15
                </p>
              </div>
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause /> : <Play />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={() => jump(15)}
            >
              <div className="relative">
                <RotateCw size={32} />
                <p className="absolute text-xs top-2 right-2.5">
                  15
                </p>
              </div>
              <span className="sr-only">forward 15 seconds</span>
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button className="rounded-full" size="icon" variant="outline">
                  <Settings />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex space-x-4">
                  <div className="relative w-8 h-8">
                    <Button
                      className="rounded-full"
                      size="icon"
                      variant="outline"
                      onClick={() => setIsVolumeVisible(!isVolumeVisible)}
                    >
                      <Volume />
                      <span className="sr-only">Volume</span>
                    </Button>
                    {isVolumeVisible && (
                      <div className="absolute left-3/4 bottom-full">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="origin-bottom-left -rotate-90 bg-zinc-200 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsFetchingTranscript(true)
                            cropAudio(audioRef.current, currentTime, 60, handleRecordingComplete);
                          }}
                        >
                          {
                            isFetchingTranscript
                              ? <LoaderCircle className="animate-spin" />
                              : "AI Transcribe"
                          }
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-56">
                        <p>
                          Clip one minute of audio from the current timestamp, and use AI to transcribe it. Please wait patiently as 3rd party podcast audio may take a while to fetch
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button variant={'outline'} size={'icon'} onClick={() => {
                    closePlayer()
                  }}>
                    <X />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

          </div>
          <div className="flex flex-row items-center space-x-4">
            <div className="justify-self-start">
              {formatTime(currentTime)}
            </div>
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              className="flex-grow relative h-2 bg-zinc-200 rounded-full cursor-pointer"
            >
              <div
                className="absolute left-0 top-0 h-full bg-zinc-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="justify-self-end">
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>


      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: "none" }} // Hide native controls
      />
    </div>
  );
};
