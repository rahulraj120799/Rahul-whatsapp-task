'use server';
import connectMongoDB from '@/server/libs/mongodb';
import User from '@/server/model/user';
import { roles } from '@/utils/auth/roleAccess';
import { USER_TYPE } from '@/utils/constants';
import { generateNumberFrom1to10 } from '@/utils/format';
import { get } from 'lodash';

const getUserDetails = async ({ id }: { id: string }) => {
  let response = {};
  await connectMongoDB();
  const data = await User.findOne({
    _id: id,
  });
  response = {
    data,
    response: true,
    message: 'Success',
  };
  return JSON.stringify(response);
};

const getAllUsers = async ({ id }: { id: string }) => {
  let response = {};
  await connectMongoDB();
  const data = await User.find({
    _id: { $ne: id },
    isSignedIn: true,
  });
  response = {
    data,
    response: true,
    message: 'Success',
  };
  return JSON.stringify(response);
};

const verifyIfUserExistsAndUpdateEmail = async ({ id }: { id: string }) => {
  let response = {};
  await connectMongoDB();
  const data = await User.findOneAndUpdate(
    { _id: id },
    {
      emailAddress: id, // Updating Email because session expects email to find data, we dont have email for visitors so using id as email
    },
    { new: true }
  );
  if (data?._id) {
    response = {
      data,
      response: true,
      message: 'Success',
    };
  } else {
    response = {
      data,
      response: false,
      message: 'Failure',
    };
  }
  return JSON.stringify(response);
};

const generateUserId = async () => {
  let response = {};
  await connectMongoDB();
  const params = {
    emailAddress: '',
    role: roles.whatsAppUser,
    fullName: '',
    type: USER_TYPE.visitor,
    profileUrl: `/avatars/${generateNumberFrom1to10()}.png`,
    loginType: [
      {
        type: USER_TYPE.visitor,
        name: '',
        profileUrl: '',
        loggedTime: Date.now(),
      },
    ],
  };
  const createdAccount = await User.create(params);
  if (createdAccount?._id) {
    response = {
      data: createdAccount,
      response: true,
      message: 'Success',
    };
  } else {
    response = {
      data: createdAccount,
      response: false,
      message: 'Failure',
    };
  }
  return JSON.stringify(response);
};

const verifyIfUserExists = async ({ id }: { id: string }) => {
  let response = {};
  await connectMongoDB();
  const data = await User.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        loginType: {
          type: USER_TYPE.visitor,
          name: '',
          profileUrl: '',
          loggedTime: Date.now(),
        },
      },
    }
  );
  if (data?._id) {
    response = {
      data,
      response: true,
      message: 'Success',
    };
  } else {
    response = {
      data,
      response: false,
      message: 'Failure',
    };
  }
  return JSON.stringify(response);
};

const updateUserDetails = async ({
  id,
  displayName,
  about,
}: {
  id: String;
  displayName: String;
  about: String;
}) => {
  let response = {};
  try {
    await connectMongoDB();
    const data = await User.findOneAndUpdate(
      { _id: id },
      {
        displayName,
        about,
        isSignedIn: true,
      },
      { new: true }
    );
    response = {
      data: data,
      response: true,
      message: 'Success',
    };
  } catch (error) {
    response = {
      data: error,
      response: false,
      message: 'Failure',
    };
  }
  return JSON.stringify(response);
};

export {
  getUserDetails,
  updateUserDetails,
  getAllUsers,
  generateUserId,
  verifyIfUserExistsAndUpdateEmail,
  verifyIfUserExists,
};
