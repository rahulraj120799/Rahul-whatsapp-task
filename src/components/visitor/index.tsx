'use client';
import { cn } from '@/utils/cn';
import { useForm } from '@/utils/form/useForm';
import { signIn } from 'next-auth/react';
import {
  generateUserId,
  verifyIfUserExists,
  verifyIfUserExistsAndUpdateEmail,
} from '@/service/user/serverSession';
import Image from 'next/image';
import { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { IoReturnDownBackSharp } from 'react-icons/io5';
import { TbLogin2 } from 'react-icons/tb';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import { FaSave } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const CustomInput = ({
  label,
  name,
  id,
  type = 'text',
  placeholder = '',
  autoComplete = 'off',
  value,
  customClassName,
  disabled = false,
  required = false,
  onChange = () => {},
}: {
  label: string;
  name: string;
  id: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  customClassName?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label
      htmlFor={name}
      className="relative block overflow-hidden rounded-md border border-black bg-white px-3 pt-3 shadow-sm focus-within:border-black-600 focus-within:ring-1 focus-within:ring-black-600"
    >
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={cn(
          'peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm',
          customClassName
        )}
      />

      <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
        {label}
      </span>
    </label>
  );
};

export default function Visitor() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('initial');
  const [generatedUserId, setGeneratedUserId] = useState('');
  const router = useRouter();

  const { form, onChange } = useForm({
    values: {
      userIdLogin: '',
    },
  });
  const { userIdLogin } = form;

  const handleGenerateUserId = async () => {
    try {
      const responseString = await generateUserId();
      const response = JSON.parse(responseString);
      if (response?.response) {
        setGeneratedUserId(response?.data?._id);
        setStep('generateUserId');
      } else toast.error('Unexpected Error, Please try again later');
    } catch (error) {
      toast.error('Unexpected Error, Please try again later');
    }
  };

  const handleSignUp = async () => {
    if (!generatedUserId) return toast.error('No User id found!');
    setLoading(true);
    try {
      const responseString = await verifyIfUserExistsAndUpdateEmail({
        id: generatedUserId,
      });
      const response = JSON.parse(responseString);
      if (response?.response) {
        await signIn('credentials', {
          id: response?.data?._id,
          callbackUrl: `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/onboard`,
        });
      } else
        toast.error('User does not exists, Please Enter the correct user id.');
    } catch (error) {
      toast.error('Unexpected Error, Please try again later');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!userIdLogin) return toast.error('No User id found!');
    setLoading(true);
    try {
      const responseString = await verifyIfUserExists({
        id: userIdLogin,
      });
      const response = JSON.parse(responseString);
      if (response?.response) {
        await signIn('credentials', {
          id: response?.data?._id,
          type: 'instagram',
          callbackUrl: `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/onboard`,
        });
      } else toast.error('User does not exists');
    } catch (error) {
      toast.error('Unexpected Error, Please try again later');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-start items-center bg-panel-header-background h-screen w-screen flex-col gap-6 pt-10 px-4 md:px-10 lg:px-20">
      <div className="flex justify-center items-center gap-2 text-white">
        <Image
          src="/whatsapp.gif"
          alt="whatapp"
          height={150}
          width={150}
          className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40"
        />
        <span className="text-2xl md:text-4xl lg:text-5xl text-white">
          Whatsapp
        </span>
      </div>
      {step === 'initial' && (
        <>
          <div className="text-base md:text-lg lg:text-xl text-white max-w-3xl text-center">
            If you&apos;d like to explore this website without authenticating
            via Google or other methods, we will provide you with a user ID and
            password. Log in to discover the features and feel free to send your
            feedback to{' '}
            <a
              className="underline text-blue-300"
              href={`mailto:${process.env.NEXT_PUBLIC_MAIL_ID}`}
            >
              {process.env.NEXT_PUBLIC_MAIL_ID}
            </a>{' '}
            anytime. Please click the button below to generate your user ID.
          </div>
          <button
            onClick={() => {
              setStep('userIdLogin');
            }}
            className={cn(
              'flex justify-center items-center gap-3 md:gap-5 lg:gap-7 bg-search-input-container-background p-3 md:p-4 lg:p-5 rounded-lg',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <TbLogin2 className="text-xl md:text-2xl lg:text-3xl text-blue-600" />
            <span className="text-base md:text-lg lg:text-xl text-white">
              Login with User Id (If you already have one)
            </span>
            {loading && (
              <AiOutlineLoading className="animate-spin text-white text-lg" />
            )}
          </button>
          <button
            onClick={handleGenerateUserId}
            className={cn(
              'flex justify-center items-center gap-3 md:gap-5 lg:gap-7 bg-search-input-container-background p-3 md:p-4 lg:p-5 rounded-lg',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <VscGitPullRequestCreate className="text-xl md:text-2xl lg:text-3xl text-blue-600" />
            <span className="text-base md:text-lg lg:text-xl text-white">
              Generate UserId
            </span>
            {loading && (
              <AiOutlineLoading className="animate-spin text-white text-lg" />
            )}
          </button>
          <div
            className="flex justify-center items-center gap-2 text-xl md:text-2xl lg:text-3xl text-blue-600 cursor-pointer"
            onClick={() => {
              router.push('/login');
            }}
          >
            <IoReturnDownBackSharp className="text-3xl md:text-4xl lg:text-5xl" />
            <div>Go Back</div>
          </div>
        </>
      )}
      {step === 'userIdLogin' && (
        <>
          <div className="text-base md:text-lg lg:text-xl text-white max-w-3xl text-center">
            Enter the user ID you previously received from this website to log
            in to the application.
          </div>
          <CustomInput
            id="userIdLogin"
            label="User Id"
            name="userIdLogin"
            value={userIdLogin}
            placeholder="Enter User Id"
            customClassName="w-full md:w-80 lg:w-96"
            onChange={(e: any) =>
              onChange({ name: e.target?.name, value: e.target?.value })
            }
          />
          <button
            onClick={handleLogin}
            className={cn(
              'flex justify-center items-center gap-3 md:gap-5 lg:gap-7 bg-search-input-container-background p-3 md:p-4 lg:p-5 rounded-lg',
              (loading || !userIdLogin) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <FaSave className="text-xl md:text-2xl lg:text-3xl text-blue-600" />
            <span className="text-base md:text-lg lg:text-xl text-white">
              Login
            </span>
            {loading && (
              <AiOutlineLoading className="animate-spin text-white text-lg" />
            )}
          </button>
          <div
            className="flex justify-center items-center gap-2 text-xl md:text-2xl lg:text-3xl text-blue-600 cursor-pointer"
            onClick={() => {
              setStep('initial');
              onChange({ name: 'userIdLogin', value: '' });
            }}
          >
            <IoReturnDownBackSharp className="text-3xl md:text-4xl lg:text-5xl" />
            <div>Go Back</div>
          </div>
        </>
      )}
      {step === 'generateUserId' && (
        <>
          <div className="text-base md:text-lg lg:text-xl text-white max-w-3xl text-center">
            Here is your User ID. You can copy and save it for future use. Next
            time, simply use this ID to log in.
            <div className="flex gap-2 text-center justify-center">
              <span className="text-blue-600 cursor-pointer">
                {generatedUserId}
              </span>{' '}
              <span
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard
                    .writeText(generatedUserId)
                    .then(() => {
                      toast.success('User ID copied to clipboard!');
                    })
                    .catch((err) => {
                      toast.error('Could not copy text:');
                    });
                }}
              >
                <FiCopy />
              </span>
            </div>
          </div>
          <CustomInput
            id="userIdLogin"
            label="User Id"
            name="userIdLogin"
            value={userIdLogin}
            placeholder="Enter User Id"
            customClassName="w-full md:w-80 lg:w-96"
            onChange={(e: any) =>
              onChange({ name: e.target?.name, value: e.target?.value })
            }
          />
          <button
            onClick={handleSignUp}
            className={cn(
              'flex justify-center items-center gap-3 md:gap-5 lg:gap-7 bg-search-input-container-background p-3 md:p-4 lg:p-5 rounded-lg',
              (loading || !userIdLogin) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <FaSave className="text-xl md:text-2xl lg:text-3xl text-blue-600" />
            <span className="text-base md:text-lg lg:text-xl text-white">
              Login Account
            </span>
            {loading && (
              <AiOutlineLoading className="animate-spin text-white text-lg" />
            )}
          </button>
          <div
            className="flex justify-center items-center gap-2 text-xl md:text-2xl lg:text-3xl text-blue-600 cursor-pointer"
            onClick={() => {
              setStep('initial');
              onChange({ name: 'userIdLogin', value: '' });
            }}
          >
            <IoReturnDownBackSharp className="text-3xl md:text-4xl lg:text-5xl" />
            <div>Go Back</div>
          </div>
        </>
      )}
    </div>
  );
}
