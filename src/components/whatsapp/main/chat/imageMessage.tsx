import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useSnapshot } from 'valtio';
import { valtioStore } from '@/utils/store/valtioStore';
import { calculateTime } from '@/utils/date/CalculateTime';
import MessageStatus from './messageStatus';

interface ImageMessageProps {
  message: {
    message: string;
    sender: string;
    messageStatus: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    fromUserId: string;
  };
}
const ImageMessage: React.FC<ImageMessageProps> = ({ message }) => {
  const { userDetails } = useSnapshot(valtioStore.user);
  const { openImageModal, setImage } = useSnapshot(valtioStore.imageModal);
  return (
    <div
      className={cn(
        'p-1 rounded-lg bg-incoming-background',
        message.fromUserId === userDetails?._id && 'bg-outgoing-background'
      )}
      onClick={() => {
        openImageModal();
        setImage(message?.imageUrl);
      }}
    >
      <div className="relative">
        <Image
          src={message?.imageUrl}
          className="rounded-lg"
          alt="asset"
          height={300}
          width={300}
        />
        <div className="abosolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[9px] pt-1 min-w-fit">
            {calculateTime(message?.updatedAt)}
          </span>
          <span className={cn('text-bubble-meta')}>
            {message?.sender && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageMessage;
