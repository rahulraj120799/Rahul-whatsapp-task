import { useSnapshot } from 'valtio';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CgProfile } from 'react-icons/cg';
import { MdLogout } from 'react-icons/md';
import { BsFillChatLeftFill, BsThreeDotsVertical } from 'react-icons/bs';
import { cn } from '@/utils/cn';
import { valtioStore } from '@/utils/store/valtioStore';
import { useRef, useState } from 'react';
import useClickOutside from '@/utils/hooks/useOutsideClick';

const ChatListHeader = () => {
  const { userDetails } = useSnapshot(valtioStore.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(menuRef, () => {
    setShowMenu(false);
  });

  const options = [
    {
      icon: <CgProfile />,
      label: 'Profile',
      onClick: () => {},
    },
    {
      icon: <MdLogout className="text-red-500" />,
      label: 'Logout',
      onClick: () => {
        signOut();
        router.push('/login');
      },
    },
  ];
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div
        className="relative cursor-pointer"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className={cn('flex items-center justify-center w-12 h-12')}>
          <Image
            src={userDetails?.profileUrl}
            alt="avatar"
            className="rounded-full w-full h-full"
            width={48}
            height={48}
          />
        </div>
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-16 left-0 bg-white shadow-md rounded-md z-10"
          >
            <ul className="w-52 flex flex-col justify-center">
              {options.map((val, key) => (
                <li
                  key={key}
                  className="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 cursor-pointer border-b-2 border-slate-200 rounded-md"
                  onClick={() => {
                    val?.onClick();
                  }}
                >
                  <div>{val?.icon}</div>
                  {val?.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={() => valtioStore.sider.openContacts()}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="menu"
          />
        </>
      </div>
    </div>
  );
};

export default ChatListHeader;
