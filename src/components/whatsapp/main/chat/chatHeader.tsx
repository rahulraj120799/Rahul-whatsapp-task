import { cn } from '@/utils/cn';
import { valtioStore } from '@/utils/store/valtioStore';
import Image from 'next/image';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoVideocam } from 'react-icons/io5';
import { MdCall } from 'react-icons/md';
import { useSnapshot } from 'valtio';

const ChatHeader = () => {
  const { chatDetails } = useSnapshot(valtioStore.activeChatDetails);
  const { userDetails } = useSnapshot(valtioStore.user);
  const { openChatSearch } = useSnapshot(valtioStore.messageChatSearch);
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex justify-center items-center gap-6">
        <div className="cursor-pointer">
          <div className={cn('flex items-center justify-center w-12 h-12')}>
            <Image
              src={
                (chatDetails.fromUserId === userDetails?._id
                  ? chatDetails?.toProfileUrl
                  : chatDetails?.fromProfileUrl) || ''
              }
              alt="avatar"
              className="rounded-full w-full h-full"
              width={48}
              height={48}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-primary-strong">
            {chatDetails.fromUserId === userDetails?._id
              ? chatDetails?.toDisplayName
              : chatDetails?.fromDisplayName}
          </span>
          <span className="text-secondary text-sm">Online/Offline</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-panel-header-icon cursor-pointer text-xl" />
        <IoVideocam className="text-panel-header-icon cursor-pointer text-xl" />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={openChatSearch}
        />
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" />
      </div>
    </div>
  );
};

export default ChatHeader;
