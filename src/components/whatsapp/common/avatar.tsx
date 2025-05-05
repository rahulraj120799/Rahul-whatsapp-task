'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { FaCamera } from 'react-icons/fa';
import ContextMenu from './context';
import PhotoPicker from './photoPicker';
import PhotoLibrary from './photoLibrary';
import CapturePhoto from './capturePhoto';

const Avatar = ({
  image,
  className,
  initialImage,
  onChange,
}: {
  image: any;
  initialImage: any;
  className?: string;
  onChange?: any;
}) => {
  const [hover, setHover] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuCoordinates, setIsContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState<boolean>(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState<boolean>(false);

  const showContextMenu = (e: any) => {
    e.preventDefault();
    setIsContextMenuOpen(true);
    setIsContextMenuCoordinates({ x: e.clientX, y: e.clientY });
  };
  const contextMenuOptions = [
    {
      name: 'Take Photo',
      callback: () => {
        setShowCapturePhoto(true);
      },
    },
    {
      name: 'Choose From Library',
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: 'Upload Photo',
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: 'Remove Photo',
      callback: () => {
        onChange?.(initialImage);
      },
    },
  ];

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById('photo-picker');
      data?.click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const photoPickerChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement('img');
    reader.onload = (event: any) => {
      // onChange?.(reader.result);
      data.src = event.target.result as string;
      data.setAttribute('data-src', event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      onChange(data?.src);
    }, 100);
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div
          className="relative cursor-pointer z-0"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={showContextMenu}
          id="context-opener"
        >
          <div
            className={cn(
              'z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 visible text-white',
              !hover && 'hidden'
            )}
            onClick={showContextMenu}
            id="context-opener"
          >
            <FaCamera
              className="text-2xl"
              onClick={showContextMenu}
              id="context-opener"
            />
            <span>
              Change <br /> profile <br /> photo
            </span>
          </div>
          <div
            className={cn(
              'flex items-center justify-center w-60 h-60',
              className
            )}
          >
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        </div>
      </div>
      {showCapturePhoto && (
        <CapturePhoto onChange={onChange} hide={setShowCapturePhoto} />
      )}
      {isContextMenuOpen && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          contextMenu={isContextMenuOpen}
          setContextMenu={setIsContextMenuOpen}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          onChange={onChange}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
};

export default Avatar;
