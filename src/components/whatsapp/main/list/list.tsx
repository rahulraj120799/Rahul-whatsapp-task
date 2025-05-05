import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import ChatListItem from '../contact/chatListItem';
import { valtioStore } from '@/utils/store/valtioStore';
import { useEffect, useState } from 'react';
import { MESSAGE_STATUS } from '@/utils/constants';

const List = () => {
  const router = useRouter();
  const { chats } = useSnapshot(valtioStore.chatList);
  const { chatSearchValue } = useSnapshot(valtioStore.search);
  const [searchContacts, setSearchContacts] = useState(chats);
  const { userDetails } = useSnapshot(valtioStore.user);
  // const userContacts = [
  //   {
  //     name: "ABDUL",
  //     totalUnreadMessages: 0,
  //     messageStatus: "sent",
  //     type: "text",
  //     message: "Hello!",
  //     createdAt: "2021-09-01T10:00:00",
  //   },
  //   {
  //     name: "Bharath",
  //     totalUnreadMessages: 5,
  //     messageStatus: "delivered",
  //     type: "audio",
  //     message: "Hello!",
  //     createdAt: "2023-09-01T10:00:00",
  //   },
  //   {
  //     name: "Vicky",
  //     totalUnreadMessages: 5,
  //     messageStatus: "delivered",
  //     type: "image",
  //     message: "Hello!",
  //     createdAt: "2023-09-01T10:00:00",
  //   },
  // ];
  const handleContactClick = ({ _id }: { _id: string }) => {
    router.push(`/${_id}`);
  };

  useEffect(() => {
    const filteredArr = chatSearchValue
      ? chats.filter((val) =>
          val?.toDisplayName
            ?.toLowerCase()
            .includes(chatSearchValue.toLowerCase())
        )
      : chats;
    setSearchContacts(filteredArr);
  }, [chats, chatSearchValue]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {searchContacts.map((contact, index) => (
        <ChatListItem
          key={index}
          data={contact}
          handleContactClick={handleContactClick}
          totalUnReadMessages={
            (contact?.chats || [])?.filter(
              (message: { messageStatus: string; toUserId: string }) =>
                message.messageStatus === MESSAGE_STATUS.sent &&
                message?.toUserId === userDetails?._id
            )?.length
          }
        />
      ))}
    </div>
  );
};

export default List;
