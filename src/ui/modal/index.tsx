'use client';
import { IoMdClose } from 'react-icons/io';
import { useRef } from 'react';
import useClickOutside from '@/utils/hooks/useOutsideClick';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  body: JSX.Element;
  className?: string;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  body,
  className,
}) => {
  const closeRef = useRef<HTMLDivElement>(null);

  useClickOutside(closeRef, () => {
    onClose();
  });
  return (
    <>
      {isOpen && (
        <div className="fixed flex justify-center items-center top-0 left-0 right-0 z-50 p-4 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100">
          <div
            className="relative flex justify-center max-w-xl max-h-full"
            ref={closeRef}
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 h-full">
              <div className="flex items-center justify-end p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <button
                  onClick={onClose}
                  type="button"
                  className="bg-transparent rounded-lg inline-flex justify-center items-center"
                >
                  <IoMdClose className="text-black" size={30} />
                </button>
              </div>
              {body}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
