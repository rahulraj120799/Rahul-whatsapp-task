import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';
import { formatTime } from '@/utils/format';
import { useSnapshot } from 'valtio';
import { valtioStore } from '@/utils/store/valtioStore';
import { calculateTime } from '@/utils/date/CalculateTime';
import MessageStatus from './messageStatus';

interface VoiceMessageProps {
  message: {
    message: string;
    sender: string;
    messageStatus: string;
    fromUserId: string;
    updatedAt: string;
    fromProfileUrl: string;
    toProfileUrl: string;
    audioUrl: string;
  };
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ message }) => {
  const [audioMessage, setAudioMessage] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const { userDetails } = useSnapshot(valtioStore.user);

  const waveFormRef = useRef<HTMLDivElement>(null);
  const waveform = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveform?.current && waveFormRef?.current) {
      waveform.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: '#ccc',
        progressColor: '#4a9eff',
        cursorColor: '#7ae3c3',
        cursorWidth: 0,
        barWidth: 2,
        barGap: 3,
        height: 30,
      });
      waveform.current.on('finish', () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (waveform.current) {
        waveform.current?.destroy();
        waveform.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(message?.audioUrl);
    setAudioMessage(audio);
    waveform.current?.load(message?.audioUrl);
    waveform.current?.on('ready', () => {
      setTotalDuration(waveform.current?.getDuration() || 0);
    });
  }, [message.audioUrl]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlayTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener('timeupdate', updatePlayTime);
      return () => {
        audioMessage.removeEventListener('timeupdate', updatePlayTime);
      };
    }
  }, [audioMessage]);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current?.stop();
      waveform.current?.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    waveform.current?.stop();
    audioMessage?.pause();
    setIsPlaying(false);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md bg-incoming-background',
        message.fromUserId === userDetails?._id && 'bg-outgoing-background'
      )}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <div className={cn('flex items-center justify-center w-12 h-12')}>
          <Image
            src={
              message.fromUserId === userDetails?._id
                ? message.fromProfileUrl
                : message.toProfileUrl
            }
            alt="avatar"
            className="rounded-full w-full h-full"
            width={48}
            height={48}
          />
        </div>
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message?.updatedAt)}</span>
            {message?.sender && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;
