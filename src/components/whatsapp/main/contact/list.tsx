'use client';

import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { valtioStore } from '@/utils/store/valtioStore';
import { formatUserList } from '@/utils/format';
import ChatListItem from './chatListItem';
import { createChatIdAndUpdateInUserChatList } from '@/service/chat/serverSession';

export default function ContactList() {
  const { contacts = [] } = useSnapshot(valtioStore.contactList);
  const { userDetails } = useSnapshot(valtioStore.user);
  const { contactSearchValue, setContactSearch } = useSnapshot(
    valtioStore.search
  );
  const router = useRouter();
  const handleContactClick = async (values: {
    _id: string;
    profileUrl: string;
    displayName: string;
  }) => {
    try {
      const responseString = await createChatIdAndUpdateInUserChatList({
        fromUserId: userDetails?._id,
        fromProfileUrl: userDetails?.profileUrl,
        toUserId: values._id,
        toProfileUrl: values?.profileUrl,
        fromDisplayName: userDetails?.displayName,
        toDisplayName: values?.displayName,
      });
      const response = JSON.parse(responseString);
      router.push(`/${response?.data?._id}`);
      if (response?.response) {
      } else toast.error('Unexpected Error, Please try again later');
    } catch (error) {
      toast.error('Unexpected Error, Please try again later');
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.displayName.toLowerCase().includes(contactSearchValue.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-24 items-center px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => {
              valtioStore.sider.closeContacts();
            }}
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex justify-between items-center gap-5 px-3 py-1 rounded-lg mx-4 flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-panel-header-background text-sm focus:outline-none text-white w-full"
                onChange={(event) => setContactSearch(event.target.value)}
              />
            </div>
          </div>
        </div>
        {Object.entries(formatUserList(Array.from(filteredContacts))).map(
          ([initialLetter, userList]: any, index) => {
            return (
              <div key={index}>
                <div key={index} className="text-teal-light pl-10 py-5">
                  {initialLetter}
                </div>
                {(userList || []).map((contact: any, index: number) => (
                  <ChatListItem
                    key={index}
                    data={contact}
                    isContactPage={true}
                    handleContactClick={handleContactClick}
                  />
                ))}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
