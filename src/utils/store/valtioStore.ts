import { proxy } from 'valtio';

interface siderStore {
  closeContacts: () => void;
  activeSection: string;
  openContacts: () => void;
}

interface userStore {
  setUserDetails: (values: any) => void;
  userDetails: any;
}

interface chatListStore {
  setChatList: (values: Array<any>) => void;
  chats: Array<any>;
}

interface contactListStore {
  setContactList: (values: Array<any>) => void;
  contacts: Array<any>;
}

interface activeChatDetailsStore {
  setActiveChatDetails: (values: any) => void;
  chatDetails: {
    _id?: string;
    chats?: Array<any>;
    toProfileUrl?: string;
    fromProfileUrl?: string;
    fromUserId?: string;
    fromDisplayName?: string;
    toDisplayName?: string;
    toUserId?: string;
    updatedAt?: string;
  };
}

interface imageModalStore {
  isOpen: boolean;
  image: string;
  openImageModal: () => void;
  closeImageModal: () => void;
  setImage: (values: string) => void;
}

interface searchStore {
  chatSearchValue: string;
  contactSearchValue: string;
  setChatSearch: (value: string) => void;
  setContactSearch: (value: string) => void;
}

interface messageChatSearchStore {
  isSearchOpen: boolean;
  searchValue: string;
  setMessageChatSearch: (value: string) => void;
  openChatSearch: () => void;
  closeChatSearch: () => void;
}

interface ModalsInterface {
  sider: siderStore;
  user: userStore;
  chatList: chatListStore;
  contactList: contactListStore;
  activeChatDetails: activeChatDetailsStore;
  imageModal: imageModalStore;
  messageChatSearch: messageChatSearchStore;
  search: searchStore;
}

export const valtioStore = proxy<ModalsInterface>({
  sider: {
    activeSection: 'chat',
    openContacts: () => {
      valtioStore.sider.activeSection = 'contacts';
    },
    closeContacts: () => {
      valtioStore.sider.activeSection = 'chat';
    },
  },
  user: {
    userDetails: {},
    setUserDetails: (values) => {
      valtioStore.user.userDetails = values;
    },
  },
  chatList: {
    chats: [],
    setChatList: (values) => {
      valtioStore.chatList.chats = values;
    },
  },
  contactList: {
    contacts: [],
    setContactList: (values) => {
      valtioStore.contactList.contacts = values;
    },
  },
  activeChatDetails: {
    chatDetails: {},
    setActiveChatDetails: (values) => {
      valtioStore.activeChatDetails.chatDetails = values;
    },
  },
  imageModal: {
    isOpen: false,
    image: '',
    openImageModal: () => {
      valtioStore.imageModal.isOpen = true;
    },
    closeImageModal: () => {
      valtioStore.imageModal.isOpen = false;
      valtioStore.imageModal.image = '';
    },
    setImage: (value) => {
      valtioStore.imageModal.image = value;
    },
  },
  messageChatSearch: {
    isSearchOpen: false,
    searchValue: '',
    openChatSearch: () => {
      valtioStore.messageChatSearch.isSearchOpen = true;
    },
    setMessageChatSearch: (value) => {
      valtioStore.messageChatSearch.searchValue = value;
    },
    closeChatSearch: () => {
      valtioStore.messageChatSearch.isSearchOpen = false;
      valtioStore.messageChatSearch.searchValue = '';
    },
  },
  search: {
    chatSearchValue: '',
    contactSearchValue: '',
    setChatSearch: (value) => {
      valtioStore.search.chatSearchValue = value;
    },
    setContactSearch: (value) => {
      valtioStore.search.contactSearchValue = value;
    },
  },
});
