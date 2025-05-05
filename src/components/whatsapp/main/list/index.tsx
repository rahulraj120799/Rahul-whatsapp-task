import { useState } from 'react';
import ChatListHeader from './chatListHeader';
import List from './list';
import SearchBar from './searchBar';
import ContactList from '../contact/list';
import { valtioStore } from '@/utils/store/valtioStore';
import { useSnapshot } from 'valtio';

const ChatList = () => {
  const [pageType, setPageType] = useState('default'); // ["default", "allContacts"]
  const { activeSection } = useSnapshot(valtioStore.sider);
  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {activeSection === 'chat' && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {activeSection === 'contacts' && <ContactList />}
    </div>
  );
};

export default ChatList;
