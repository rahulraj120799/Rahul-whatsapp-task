import ChatHeader from './chatHeader';
import ChatContainer from './chatContainer';
import MessageBar from './messageBar';

const Chat = () => {
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col -h-screen z-10">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
};

export default Chat;
