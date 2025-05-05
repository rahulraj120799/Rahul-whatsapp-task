import { use, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

const CapturePhoto = ({
  onChange,
  hide,
}: {
  onChange: (e: any) => void;
  hide: (e: any) => void;
}) => {
  const vedioRef = useRef(null);

  useEffect(() => {
    let stream = null as any;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        const vedio = vedioRef.current as any;
        vedio.srcObject = stream;
      } catch (error) {}
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((track: any) => {
        track.stop();
      });
    };
  }, []);
  const handleCapturePhoto = () => {
    const vedio = vedioRef.current as any;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context?.drawImage(vedio, 0, 0, 300, 150);
    const data = canvas.toDataURL('image/png');
    onChange(data);
    hide(false);
  };
  return (
    <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-dropdown-background gap-3 rounded-lg flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full justify-center items-center">
        <div
          className="pt-2 pr-2 cursor-pointer flex justify-end items-end"
          onClick={() => hide(false)}
        >
          <IoClose className="h-10 w-10 text-white cursor-pointer" />
        </div>
        <div className="flex justify-center">
          <video id="vedio" width="400" autoPlay ref={vedioRef}></video>
        </div>
        <button
          onClick={handleCapturePhoto}
          className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
        ></button>
      </div>
    </div>
  );
};

export default CapturePhoto;
