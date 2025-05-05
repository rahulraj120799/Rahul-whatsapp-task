import { cn } from '@/utils/cn';
import { useEffect, useRef } from 'react';

const ContextMenu = ({
  coordinates,
  options,
  contextMenu,
  setContextMenu,
}: {
  options: any[];
  contextMenu: boolean;
  setContextMenu: any;
  coordinates: any;
}) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const handleClick = (e: any, callback: any) => {
    e.stopPropagation();
    callback();
    setContextMenu(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        setContextMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  return (
    <div
      ref={contextMenuRef}
      className={cn('bg-dropdown-background fixed py-2 z-[100] shadow-xl')}
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      <ul>
        {options.map(
          (
            { name, callback }: { name: string; callback: any },
            index: number
          ) => (
            <li
              key={index}
              onClick={(e) => handleClick(e, callback)}
              className="py-2 px-4 cursor-pointer hover:bg-dropdown-hover-background"
            >
              <span className="text-white">{name}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;
