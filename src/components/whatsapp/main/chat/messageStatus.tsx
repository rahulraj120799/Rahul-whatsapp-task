import { MESSAGE_STATUS } from '@/utils/constants';
import { BsCheckAll, BsSend } from 'react-icons/bs';

const MessageStatus = ({ messageStatus }: { messageStatus: string }) => {
  return (
    <>
      {messageStatus === MESSAGE_STATUS.sent && <BsSend className="text-md" />}
      {messageStatus === MESSAGE_STATUS.delivered && (
        <BsCheckAll className="text-lg" />
      )}
      {messageStatus === MESSAGE_STATUS.read && (
        <BsCheckAll className="text-lg text-icon-ack" />
      )}
    </>
  );
};

export default MessageStatus;
