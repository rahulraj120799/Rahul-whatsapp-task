'use client';

import { useEffect } from 'react';
import { get, isEmpty } from 'lodash';
import { useSnapshot } from 'valtio';
import { cn } from '@/utils/cn';
import { valtioStore } from '@/utils/store/valtioStore';
import { getAllUsers } from '@/service/user/serverSession';
import {
  getAllChatsByChatIdArray,
  updateMessageStatus,
} from '@/service/chat/serverSession';
import Chat from './chat';
import Empty from './empty';
import ChatList from './list';
import SearchMessages from './chat/searchMessages';
import CustomModal from '@/ui/modal';
import Image from 'next/image';
import { MESSAGE_STATUS } from '@/utils/constants';

export default function HomePage({
  userDetails,
  activeChatId = '',
}: {
  userDetails: any;
  activeChatId?: string;
}) {
  const { chatDetails } = useSnapshot(valtioStore.activeChatDetails);
  const { isOpen, closeImageModal, image } = useSnapshot(
    valtioStore.imageModal
  );
  const { isSearchOpen } = useSnapshot(valtioStore.messageChatSearch);
  const fetchInitialStates = async () => {
    const chatId = [] as Array<any>;
    (userDetails?.chatList || []).forEach((val: { chatId: string }) => {
      chatId.push(val?.chatId);
    });
    console.log(activeChatId, 'activeChatId---------');
    // if (activeChatId && userDetails?._id === ) {
    //   // updates messages too read when viewing
    //   const res = await updateMessageStatus({
    //     chatId: activeChatId,
    //     messageStatus: MESSAGE_STATUS.read,
    //   });
    //   console.log(JSON.parse(res), 'res-----');
    // }
    const promiseArr = [
      getAllUsers({ id: userDetails?._id }),
      getAllChatsByChatIdArray({
        chatId: chatId,
        activeChatId,
        userId: userDetails?._id,
      }),
    ];
    const response = await Promise.all(promiseArr);
    const chatListArr = get(JSON.parse(response?.[1]), 'data', []);
    valtioStore.contactList.setContactList(
      get(JSON.parse(response?.[0]), 'data', [])
    );
    valtioStore.chatList.setChatList(chatListArr);
    const activechatDetailsObj =
      chatListArr.find((val: { _id: string }) => val?._id === activeChatId) ||
      {};
    valtioStore.activeChatDetails.setActiveChatDetails(activechatDetailsObj);
  };

  useEffect(() => {
    console.log('useEffect');
    valtioStore.user.setUserDetails(userDetails);
    fetchInitialStates();
  }, []);

  const postCommentBody = (
    <div className="bg-white rounded-md shadow w-full">
      <Image
        src={image}
        height="1000"
        width="1000"
        className="w-full object-cover"
        alt="thumbnail"
      />
    </div>
  );

  return (
    <div>
      <CustomModal
        isOpen={isOpen}
        onClose={closeImageModal}
        body={postCommentBody}
      />
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {isEmpty(userDetails?.chatList) || !chatDetails?._id ? (
          <Empty />
        ) : (
          <div
            className={cn(
              isSearchOpen ? 'grid grid-cols-2 grid-flow-col' : 'grid cols-2'
            )}
          >
            <Chat />
            {isSearchOpen && <SearchMessages />}
          </div>
        )}
      </div>
    </div>
  );
}
