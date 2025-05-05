import Image from "next/image";

const Empty = () => {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col justify-center items-center h-[100vh] border-b-4 border-b-icon-green">
      <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
    </div>
  );
};

export default Empty;
