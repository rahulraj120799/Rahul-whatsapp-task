import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import { useSnapshot } from 'valtio';
import { BsEmojiSmile } from 'react-icons/bs';
import { FaMicrophone } from 'react-icons/fa';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import Pusher from 'pusher-js';
import dynamic from 'next/dynamic';
import {
  getChatByChatId,
  sendImageMessage,
  sendTextMessage,
  updateMessageStatus,
} from '@/service/chat/serverSession';
import { useForm } from '@/utils/form/useForm';
import { valtioStore } from '@/utils/store/valtioStore';
import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/utils/constants';
import { sendPusher, uploadImage } from '@/utils/fetch/routes';
import useClickOutside from '@/utils/hooks/useOutsideClick';
import PhotoPicker from '../../common/photoPicker';

const CaptureAudio = dynamic(() => import('./captureAudio'), { ssr: false });

const MessageBar = () => {
  const { form, onChange, isDisabled } = useForm({
    values: {
      message: '',
    },
    required: ['message'],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const { message } = form;
  const { userDetails } = useSnapshot(valtioStore.user);
  const { chats, setChatList } = useSnapshot(valtioStore.chatList);
  const { chatDetails, setActiveChatDetails } = useSnapshot(
    valtioStore.activeChatDetails
  );

  useClickOutside(emojiRef, () => {
    setShowEmojiPicker(false);
  });

  useEffect(() => {
    if (userDetails?._id) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
      });

      const channel = pusher.subscribe('chat');
      // Whenever 'message' event is triggered this will get called for all users we need to display message for only
      // from and to users
      channel.bind(
        'message',
        async function (data: {
          toUserId: string;
          _id: string;
          fromUserId: string;
        }) {
          if (
            data?.toUserId === userDetails?._id ||
            data?.fromUserId === userDetails?._id
          ) {
            if (
              chatDetails?._id === data?._id &&
              data?.fromUserId === userDetails?._id
            ) {
              console.log('message socket');
              const res = await updateMessageStatus({
                chatId: data?._id,
                messageStatus: MESSAGE_STATUS.read,
              });
              console.log(JSON.parse(res), 'res-----');
            }
            const responseString = await getChatByChatId({ id: data?._id });
            const response = JSON.parse(responseString);
            const updatedChats = (chats || []).map((val) => {
              if (val?._id === data?._id && response?.data?._id) {
                if (chatDetails?._id === data?._id)
                  setActiveChatDetails(response?.data);
                return response?.data;
              }
              return val;
            });
            setChatList(updatedChats);
          }
        }
      );

      return () => {
        pusher.unsubscribe('chat');
      };
    }
  }, [userDetails?._id, chats]);

  const handleSendMessage = async () => {
    try {
      const responseString = await sendTextMessage({
        message,
        messageType: MESSAGE_TYPE.text,
        messageStatus: MESSAGE_STATUS.sent,
        chatId: chatDetails?._id || '',
        fromUserId: userDetails?._id,
        fromProfileUrl: userDetails?.profileUrl,
        fromDisplayName: userDetails?.displayName,
        toUserId:
          (chatDetails?.toUserId === userDetails?._id
            ? chatDetails?.fromUserId
            : chatDetails?.toUserId) || '',
        toProfileUrl: chatDetails?.toProfileUrl || '',
        toDisplayName: chatDetails?.toDisplayName || '',
      });
      const response = JSON.parse(responseString);
      if (response?.response) {
        const { toUserId, fromUserId, _id } = response?.data;
        // pusher has some limitations in request params so only sending limited parameters
        const res = await sendPusher({ toUserId, fromUserId, _id });
        if (res?.error) {
          toast.error(res?.error?.message);
        }
        onChange({ name: 'message', value: '' });
        setActiveChatDetails(response?.data);
      } else toast.error('Unexpected Error, Please try again later');
    } catch (error) {
      toast.error('Unexpected Error, Please try again later');
    }
  };

  const hideAudioRecorder = () => {
    setShowAudioRecorder(false);
  };

  const photoPickerChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement('img');
    reader.onload = (event: any) => {
      // onChange?.(reader.result);
      data.src = event.target.result as string;
      data.setAttribute('data-src', event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      // onChange(data?.src);
    }, 100);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const uploadResponse = await uploadImage({ file });
        const responseString = await sendImageMessage({
          message,
          imageUrl: uploadResponse.secure_url,
          messageType: MESSAGE_TYPE.image,
          messageStatus: MESSAGE_STATUS.sent,
          chatId: chatDetails?._id || '',
          fromUserId: userDetails?._id,
          fromProfileUrl: userDetails?.profileUrl,
          fromDisplayName: userDetails?.displayName,
          toUserId: chatDetails?.toUserId || '',
          toProfileUrl: chatDetails?.toProfileUrl || '',
          toDisplayName: chatDetails?.toDisplayName || '',
        });
        const response = JSON.parse(responseString);
        if (response?.response) {
          const { toUserId, fromUserId, _id } = response?.data;
          const res = await sendPusher({ toUserId, fromUserId, _id });
          if (res?.error) {
            toast.error(res?.error?.message);
          }
          onChange({ name: 'message', value: '' });
          setActiveChatDetails(response?.data);
        } else toast.error('Unexpected Error, Please try again later');
      } catch (error) {
        toast.error('Unexpected Error, Please try again later');
      }
    } else toast.error('Please select an image file.');
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        {!showAudioRecorder && (
          <>
            <div className="flex gap-6">
              <BsEmojiSmile
                className="text-panel-header-icon cursor-pointer text-xl"
                title="Emoji"
                id="emoji-open"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              />
              {showEmojiPicker && (
                <div className="absolute bottom-24 left-16 z-40" ref={emojiRef}>
                  <EmojiPicker
                    onEmojiClick={(emoji) => {
                      onChange?.({
                        name: 'message',
                        value: message + emoji?.emoji,
                      });
                    }}
                  />
                </div>
              )}
              <div>
                <ImAttachment
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Attachment"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .gif, .webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  hidden
                />
              </div>
            </div>
            <div className="w-full rounded-lg h-10 flex items-center">
              <input
                type="text"
                name="message"
                value={message}
                id="message"
                placeholder="Type a message"
                className="bg-input-background text-sm focus:outline-none text-white w-full h-10 px-5 py-4 rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                onChange={(e) =>
                  onChange({
                    name: e?.target?.name as keyof typeof form,
                    value: e?.target?.value,
                  })
                }
              />
            </div>
            <div className="flex w-10 items-center justify-center">
              <button>
                {message.length ? (
                  <MdSend
                    onClick={handleSendMessage}
                    className="text-panel-header-icon cursor-pointer text-xl"
                    title="Send Message"
                  />
                ) : (
                  <FaMicrophone
                    className="text-panel-header-icon cursor-pointer text-xl"
                    title="Record Audio"
                    onClick={() => setShowAudioRecorder(true)}
                  />
                )}
              </button>
            </div>
          </>
        )}
        {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
        {showAudioRecorder && (
          <CaptureAudio hideAudioRecorder={hideAudioRecorder} />
        )}
      </>
    </div>
  );
};

export default MessageBar;
