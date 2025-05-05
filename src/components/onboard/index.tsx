'use client';
import Image from 'next/image';
import AuthInstagram from '../../../public/default_avatar.png';
import Avatar from '../whatsapp/common/avatar';
import { useForm } from '@/utils/form/useForm';
import { updateUserDetails } from '@/service/user/serverSession';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: any;
  onChange: (e: any) => void;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-teal-light text-lg px-1 flex justify-start"
      >
        {label}
      </label>
      <div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg py-4 px-5 w-full"
        />
      </div>
    </div>
  );
};

export default function OnBoardForm({
  userDetails,
}: {
  userDetails: { _id: string };
}) {
  const { form, onChange, isDisabled } = useForm({
    values: {
      displayName: '',
      about: '',
      image: AuthInstagram,
    },
    required: ['displayName', 'about'],
  });
  const { displayName, about, image } = form;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOnBoard = async () => {
    setLoading(true);
    try {
      const responseString = await updateUserDetails({
        id: userDetails?._id,
        displayName,
        about,
      });
      const response = JSON.parse(responseString);
      if (response?.response) {
        router.push('/whatsapp');
      } else toast.error('Unexpected Error, Please try again later');
    } catch (error) {
      toast.error('Unexpected Error, Please try again later');
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex justify-center items-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="whatapp" height={300} width={300} />
        <span className="text-7xl text-white">Whatsapp</span>
      </div>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <Input
            name="displayName"
            label="Name"
            placeholder="Enter Display Name"
            value={displayName}
            onChange={(e) =>
              onChange({
                name: e?.target?.name,
                value: e?.target?.value,
              })
            }
          />
          <Input
            name="about"
            label="About"
            placeholder="Enter About"
            value={about}
            onChange={(e) =>
              onChange({ name: e?.target?.name, value: e?.target?.value })
            }
          />
          <div className="flex justify-center items-center">
            <button
              onClick={handleOnBoard}
              className={cn(
                'flex justify-center items-center gap-7 text-white bg-search-input-container-background p-5 rounded-lg',
                (isDisabled || loading) &&
                  'opacity-50 cursor-not-allowed pointer-events-none'
              )}
            >
              Create Profile
              {loading && (
                <AiOutlineLoading className="animate-spin text-white text-lg" />
              )}
            </button>
          </div>
        </div>
        <div className="">
          <Avatar
            image={image}
            initialImage={AuthInstagram}
            onChange={(value: any) => {
              onChange({ name: 'image', value: value });
            }}
          />
        </div>
      </div>
    </div>
  );
}
