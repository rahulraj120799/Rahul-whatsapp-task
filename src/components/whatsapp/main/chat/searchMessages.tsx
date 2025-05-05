import React, { useState, useEffect } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { calculateTime } from '@/utils/date/CalculateTime';
import { useSnapshot } from 'valtio';
import { valtioStore } from '@/utils/store/valtioStore';
import { cn } from '@/utils/cn';
import { orderBy } from 'lodash';

interface Message {
  type: string;
  message: string;
  createdAt: string;
  fromUserId?: string;
}

const SearchMessages: React.FC = () => {
  const { chatDetails } = useSnapshot(valtioStore.activeChatDetails);
  const { searchValue, setMessageChatSearch, closeChatSearch } = useSnapshot(
    valtioStore.messageChatSearch
  );
  const [searchedMessages, setSearchedMessages] = useState<Message[]>([]);
  const { userDetails } = useSnapshot(valtioStore.user);

  useEffect(() => {
    const filteredArr = searchValue
      ? (chatDetails?.chats || []).filter((val: Message) =>
          val?.message?.toLowerCase().includes(searchValue.toLowerCase())
        )
      : [];
    setSearchedMessages(orderBy(filteredArr, ['createdAt'], ['desc']));
  }, [searchValue, chatDetails]);

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl"
          onClick={closeChatSearch}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex flex-col items-center w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex justify-between items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  name="searchValue"
                  value={searchValue}
                  placeholder="Search Messages"
                  className="bg-panel-header-background text-sm focus:outline-none text-white w-full"
                  onChange={(event) => setMessageChatSearch(event.target.value)}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchValue.length && (
              <span className="text-secondary">{`Search for Messages with current chat user`}</span>
            )}
          </span>
        </div>
        {searchValue.length > 0 && !searchedMessages.length && (
          <div className="flex flex-col justify-center h-full">
            <span className="text-secondary flex w-full justify-center">
              No messages found
            </span>
          </div>
        )}
        <div className="flex flex-col w-full h-full">
          {searchedMessages.map((val, index) => (
            <div
              className={cn(
                'flex cursor-pointer flex-col justify-center items-start hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5',
                val.fromUserId === userDetails?._id && 'items-end'
              )}
              key={index}
            >
              <div className="text-sm text-secondary">
                {calculateTime(val.createdAt)}
              </div>
              <div
                className={cn(
                  'text-gray-300',
                  val.fromUserId === userDetails?._id && 'text-icon-green'
                )}
              >
                {val.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchMessages;
