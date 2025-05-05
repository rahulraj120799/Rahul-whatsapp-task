import Image from 'next/image';

export const LoadingComponent = () => {
  return (
    <div className="w-full h-screen bg-white flex flex-col justify-center items-center">
      <div className="rounded-full relative w-28 h-28 flex items-center justify-center cursor-pointer overflow-hidden animate-spin">
        <Image
          src="/whatsapp.gif"
          alt="avatar"
          className="w-full h-full"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="text-xl font-semibold">Loading.....</div>
    </div>
  );
};
