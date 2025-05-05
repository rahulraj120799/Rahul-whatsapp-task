'use client';
import { cn } from '@/utils/cn';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaPersonWalkingArrowRight } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

export default function WhatsAppLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    await signIn('google', {
      callbackUrl: `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/onboard`,
    });
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-white">
        <Image
          src="/whatsapp.gif"
          alt="whatapp"
          height={200}
          width={200}
          className="md:h-300 md:w-300"
        />
        <span className="text-4xl md:text-5xl lg:text-7xl text-white">
          Whatsapp
        </span>
      </div>
      <button
        onClick={handleLogin}
        className={cn(
          'flex justify-center items-center gap-4 md:gap-7 bg-search-input-container-background p-3 md:p-5 rounded-lg',
          loading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <FcGoogle className="text-2xl md:text-4xl" />
        <span className="text-xl md:text-2xl text-white">
          Login with Google
        </span>
        {loading && (
          <AiOutlineLoading className="animate-spin text-white text-lg" />
        )}
      </button>
      <button
        onClick={() => {
          router.push('/visitor');
        }}
        className={cn(
          'flex justify-center items-center gap-4 md:gap-7 bg-search-input-container-background p-3 md:p-5 rounded-lg'
        )}
      >
        <FaPersonWalkingArrowRight className="text-2xl md:text-4xl text-white" />
        <span className="text-xl md:text-2xl text-white">Login as Visitor</span>
      </button>
    </div>
  );
}
