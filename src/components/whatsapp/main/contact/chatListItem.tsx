import { cn } from '@/utils/cn';
import Image from 'next/image';
import { FaCamera, FaMicrophone } from 'react-icons/fa';
import { useSnapshot } from 'valtio';
import { valtioStore } from '@/utils/store/valtioStore';
import { calculateTime } from '@/utils/date/CalculateTime';
import MessageStatus from '../chat/messageStatus';

const ChatListItem = ({
  data,
  isContactPage = false,
  handleContactClick = () => {},
  totalUnReadMessages = 0,
}: {
  data: any;
  isContactPage?: boolean;
  totalUnReadMessages?: number;
  handleContactClick?: (data: {
    _id: string;
    profileUrl: string;
    displayName: string;
  }) => void;
}) => {
  const { userDetails } = useSnapshot(valtioStore.user);
  const { chatDetails } = useSnapshot(valtioStore.activeChatDetails);

  const getSrcUrl = () => {
    if (isContactPage) {
      return data?.profileUrl;
    }
    return data.fromUserId === userDetails?._id
      ? data.toProfileUrl
      : data.fromProfileUrl;
  };

  const getName = () => {
    if (isContactPage) return data?.displayName;
    return data?.fromUserId === userDetails?._id
      ? data?.toDisplayName
      : data?.fromDisplayName;
  };

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center hover:bg-background-default-hover',
        chatDetails?._id === data?._id && 'bg-background-default-hover'
      )}
      onClick={() => handleContactClick(data)}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <div className={cn('flex items-center justify-center w-12 h-12')}>
          <Image
            src={getSrcUrl()}
            alt="avatar"
            className="rounded-full w-full h-full"
            width={48}
            height={48}
          />
        </div>
      </div>
      <div className="min-h-full flex flex-col justify-between mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white">{getName()}</span>
          </div>
          {!isContactPage && (
            <div>
              <span
                //check the condition once ternary might be reverse
                className={cn(
                  'text-sm',
                  !(data?.totalUnreadMessages > 0)
                    ? 'text-secondary'
                    : 'text-icon-green'
                )}
              >
                {calculateTime(data?.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactPage ? (
                data?.about || '\u00A0'
              ) : (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px] ">
                  {data?.sender && (
                    <MessageStatus messageStatus={data.messageStatus} />
                  )}
                  {data?.type === 'text' && (
                    <span className="truncate">{data?.message}</span>
                  )}
                  {data?.type === 'audio' && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data?.type === 'image' && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {Number(totalUnReadMessages) > 0 && (
              <span className="bg-icon-green px-[5px] rounded-full text-sm">
                {totalUnReadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
