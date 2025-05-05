import { sendAudioMessage } from '@/service/chat/serverSession';
import { cn } from '@/utils/cn';
import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/utils/constants';
import { sendPusher, uploadAudio } from '@/utils/fetch/routes';
import { formatTime } from '@/utils/format';
import { valtioStore } from '@/utils/store/valtioStore';
import { useEffect, useRef, useState } from 'react';
import { FaPauseCircle, FaPlay, FaStop, FaTrash } from 'react-icons/fa';
import { FaMicrophone } from 'react-icons/fa6';
import { MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSnapshot } from 'valtio';
import WaveSurfer from 'wavesurfer.js';

interface CaptureAudioProps {
  hideAudioRecorder: () => void;
}

const CaptureAudio: React.FC<CaptureAudioProps> = ({ hideAudioRecorder }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [waveForm, setWaveForm] = useState<WaveSurfer | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const waveFormRef = useRef<HTMLDivElement>(null);

  const { userDetails } = useSnapshot(valtioStore.user);
  const { chatDetails, setActiveChatDetails } = useSnapshot(
    valtioStore.activeChatDetails
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    if (waveFormRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: '#ccc',
        progressColor: '#4a9eff',
        cursorColor: '#7ae3c3',
        cursorWidth: 0,
        barWidth: 2,
        barGap: 3,
        height: 30,
      });
      setWaveForm(wavesurfer);
      wavesurfer.on('finish', () => {
        setIsPlaying(false);
      });
      return () => {
        wavesurfer.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener('timeupdate', updatePlayTime);
      return () => {
        recordedAudio.removeEventListener('timeupdate', updatePlayTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm?.stop();
      waveForm?.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm?.stop();
    recordedAudio?.pause();
    setIsPlaying(false);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm?.stop();

      const audioChunks: Blob[] = [];
      mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
        audioChunks.push(e.data);
      });
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], 'recording.mp3');
        setRenderedAudio(audioFile);
      });
    }
  };

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
        }
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);
          waveForm?.load(audioUrl);
        };
        mediaRecorder.start();
      })
      .catch((err) => {
        toast.error(
          (err as Error).message || 'Unexpected Error, Please try again later'
        );
      });
  };

  const sendRecording = async () => {
    try {
      if (!renderedAudio) {
        toast.error('Audio not found, Please stop recording and send audio');
        return;
      }
      setSendLoading(true);
      const audioResponse = await uploadAudio({ file: renderedAudio });
      if (audioResponse && audioResponse.secure_url) {
        const responseString = await sendAudioMessage({
          audioUrl: audioResponse.secure_url,
          messageType: MESSAGE_TYPE.audio,
          messageStatus: MESSAGE_STATUS.sent,
          chatId: chatDetails?._id || '',
          fromUserId: userDetails?._id,
          fromProfileUrl: userDetails?.profileUrl,
          fromDisplayName: userDetails?.displayName,
          toUserId: chatDetails?.toUserId || '',
          toProfileUrl: chatDetails?.toProfileUrl || '',
          toDisplayName: chatDetails?.toDisplayName || '',
        });
        const response = JSON.parse(responseString);
        if (response?.response) {
          const { toUserId, fromUserId, _id } = response?.data;
          const res = await sendPusher({ toUserId, fromUserId, _id });
          if (res?.error) {
            toast.error(res?.error?.message);
          }
          setSendLoading(false);
          hideAudioRecorder();
          setActiveChatDetails(response?.data);
        } else toast.error('Unexpected Error, Please try again later');
      }
    } catch (err) {
      setSendLoading(false);
      toast.error(
        (err as Error).message || 'Unexpected Error, Please try again later'
      );
    }
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1 cursor-pointer">
        <FaTrash
          className="text-panel-header-icon"
          onClick={hideAudioRecorder}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-83 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="bg-red-500 animate-pulse w-60 text-center">
            Recording
            <span className="pl-1">{recordingDuration}</span>s
          </div>
        ) : (
          <div className="">
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4 cursor-pointer">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div className="">
        <MdSend
          className={cn(
            'text-panel-header-icon cursor-pointer mr-4',
            (sendLoading || isRecording) && 'pointer-events-none text-slate-300'
          )}
          title="send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
};

export default CaptureAudio;
