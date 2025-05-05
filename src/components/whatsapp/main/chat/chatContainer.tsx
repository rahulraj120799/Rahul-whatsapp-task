import dynamic from 'next/dynamic';
import { useSnapshot } from 'valtio';
import { MESSAGE_TYPE } from '@/utils/constants';
import { calculateTime } from '@/utils/date/CalculateTime';
import { valtioStore } from '@/utils/store/valtioStore';
import { cn } from '@/utils/cn';
import MessageStatus from './messageStatus';
import ImageMessage from './imageMessage';

const VoiceMessage = dynamic(() => import('./voiceMessage'), { ssr: false });

const ChatContainer = () => {
  const { chatDetails } = useSnapshot(valtioStore.activeChatDetails);
  const { userDetails } = useSnapshot(valtioStore.user);
  const messages = [
    {
      message: 'Hello',
      type: 'text',
      sender: 'user1',
      messageStatus: 'sent',
      createdAt: new Date().toISOString(),
    },
    {
      message: 'Hi',
      type: 'text',
      sender: 'user1',
      messageStatus: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      message: 'Hi',
      type: 'image',
      sender: 'user1',
      messageStatus: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      message: 'Hi',
      type: 'image',
      sender: 'user2',
      messageStatus: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      message: 'Hi bro !',
      type: 'text',
      sender: 'user2',
      messageStatus: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      message: '',
      type: 'audio',
      sender: 'user1',
      messageStatus: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      message: '',
      type: 'audio',
      sender: 'user2',
      messageStatus: 'delivered',
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-green-400 bg-fixed h-full w-full opacity-5 absolute left-0 top-0 z-10"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {(chatDetails?.chats || []).map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex justify-start',
                  message.fromUserId === userDetails?._id && 'justify-end'
                )}
              >
                {message.messageType === MESSAGE_TYPE.text && (
                  <div
                    className={cn(
                      'text-white px-2 py-1 pt-[5px] text-sm rounded-md flex gap-2 mt-1 items-end max-w-[45%] bg-incoming-background',
                      message.fromUserId === userDetails?._id &&
                        'bg-outgoing-background'
                    )}
                  >
                    <span className="break-after-all flex-grow">
                      {message.message}
                    </span>
                    <div className="flex gap-1 items-end justify-end">
                      <span className="text-bubble-meta text-[10px] h-3 min-w-fit flex justify-center items-center">
                        {calculateTime(message?.createdAt)}
                      </span>
                      <span>
                        {message.fromUserId === userDetails?._id && (
                          <MessageStatus
                            messageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.messageType === MESSAGE_TYPE.image && (
                  <ImageMessage message={message} />
                )}
                {message.messageType === MESSAGE_TYPE.audio && (
                  <VoiceMessage message={message} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
