'use server';
import connectMongoDB from '@/server/libs/mongodb';
import User from '@/server/model/user';
import Chat from '@/server/model/chat';
import { MESSAGE_STATUS } from '@/utils/constants';

const getAllChatsByChatIdArray = async ({
  chatId,
  activeChatId,
  userId,
}: {
  chatId: Array<any>;
  activeChatId: string;
  userId: string;
}) => {
  let response = {};
  await connectMongoDB();
  let data = [];
  console.log(chatId, 'chatId');
  data = await Chat.find({
    _id: { $in: chatId },
  }).lean();
  console.log(activeChatId, 'activeChatId');
  if (activeChatId) {
    const activeChatData =
      (data || []).find((val) => val._id == activeChatId) || {};
    if (activeChatData?._id) {
      console.log(activeChatData?._id, 'activeChatData?._id');
      const isAllChatsAreSent = (activeChatData?.chats || []).every(
        (val: { messageStatus: string }) =>
          val.messageStatus === MESSAGE_STATUS.sent
      );
      console.log(userId, 'userId');
      console.log(isAllChatsAreSent, 'isAllChatsAreSent');
      console.log(activeChatData?.toUserId, 'toUserId');
      console.log(activeChatData?.fromUserId, 'fromUserId');
      if (!isAllChatsAreSent && activeChatData?.toUserId === userId) {
        const res = await Chat.updateOne(
          { _id: activeChatId },
          { $set: { 'chats.$[].messageStatus': MESSAGE_STATUS.read } }
        );
        console.log(res, 'updated response');
        data = await Chat.find({
          _id: { $in: chatId },
        });
        console.log(data.length, 'data');
      }
    }
  }
  response = {
    data,
    response: true,
    message: 'Success',
  };
  return JSON.stringify(response);
};

const getChatByChatId = async ({ id }: { id: string }) => {
  let response = {};
  await connectMongoDB();
  const data = await Chat.findOne({ _id: id });
  response = {
    data,
    response: true,
    message: 'Success',
  };
  return JSON.stringify(response);
};

// Method to push a new object to the chatList array
const createChatIdAndUpdateInUserChatList = async ({
  fromUserId,
  fromProfileUrl,
  toUserId,
  toProfileUrl,
  fromDisplayName,
  toDisplayName,
}: {
  fromUserId: string;
  fromProfileUrl: string;
  toUserId: string;
  toProfileUrl: string;
  fromDisplayName: string;
  toDisplayName: string;
}) => {
  let response: any = {};
  try {
    await connectMongoDB();
    const isChatAlreadyExists = await Chat.findOne({
      fromUserId,
      toUserId,
    });
    if (!isChatAlreadyExists?._id) {
      const newChat = await Chat.create({
        fromUserId,
        fromProfileUrl,
        toUserId,
        toProfileUrl,
        fromDisplayName,
        toDisplayName,
      });

      // Update chat list for both users
      const updateFromUser = await User.findOneAndUpdate(
        { _id: fromUserId },
        {
          $push: {
            chatList: {
              chatId: newChat?._id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        { new: true }
      );
      const updateToUser = await User.findOneAndUpdate(
        { _id: toUserId },
        {
          $push: {
            chatList: {
              chatId: newChat?._id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        { new: true }
      );
      response = {
        data: newChat,
        response: true,
        message: 'New chat entry added successfully.',
      };
    } else {
      response = {
        data: isChatAlreadyExists,
        response: true,
        message: 'Chat Details fetched successfully',
      };
    }
  } catch (error) {
    response = {
      data: error,
      response: false,
      message: 'Failure',
    };
  }
  return JSON.stringify(response);
};

const updateMessageStatus = async ({
  chatId,
  messageStatus,
}: {
  chatId: string;
  messageStatus: string;
}) => {
  let response: any = {};
  try {
    await connectMongoDB();

    const updatedChatDetails = await Chat.updateOne(
      { _id: chatId },
      { $set: { 'chats.$[].messageStatus': messageStatus } }
    );

    response = {
      data: updatedChatDetails,
      response: true,
      message: 'Chat updated successfully',
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

const sendTextMessage = async ({
  chatId,
  message,
  messageType,
  messageStatus,
  fromUserId,
  fromProfileUrl,
  toUserId,
  toProfileUrl,
  fromDisplayName,
  toDisplayName,
}: {
  chatId: string;
  message: string;
  messageType: string;
  messageStatus: string;
  fromUserId: string;
  fromProfileUrl: string;
  toUserId: string;
  toProfileUrl: string;
  fromDisplayName: string;
  toDisplayName: string;
}) => {
  let response: any = {};
  try {
    await connectMongoDB();

    const updatedChatDetails = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          chats: {
            message,
            messageType,
            messageStatus,
            fromUserId,
            fromDisplayName,
            fromProfileUrl,
            toUserId,
            toDisplayName,
            toProfileUrl,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    response = {
      data: updatedChatDetails,
      response: true,
      message: 'Chat updated successfully',
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

const sendImageMessage = async ({
  chatId,
  message,
  messageType,
  messageStatus,
  imageUrl,
  fromUserId,
  fromProfileUrl,
  toUserId,
  toProfileUrl,
  fromDisplayName,
  toDisplayName,
}: {
  chatId: string;
  message: string;
  messageType: string;
  messageStatus: string;
  imageUrl: string;
  fromUserId: string;
  fromProfileUrl: string;
  toUserId: string;
  toProfileUrl: string;
  fromDisplayName: string;
  toDisplayName: string;
}) => {
  let response: any = {};
  try {
    await connectMongoDB();

    const updatedChatDetails = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          chats: {
            message,
            messageType,
            messageStatus,
            imageUrl,
            fromUserId,
            fromDisplayName,
            fromProfileUrl,
            toUserId,
            toDisplayName,
            toProfileUrl,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    response = {
      data: updatedChatDetails,
      response: true,
      message: 'Chat updated successfully',
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

const sendAudioMessage = async ({
  audioUrl,
  messageType,
  messageStatus,
  chatId,
  fromUserId,
  fromProfileUrl,
  fromDisplayName,
  toUserId,
  toProfileUrl,
  toDisplayName,
}: {
  audioUrl: string;
  chatId: string;
  messageType: string;
  messageStatus: string;
  fromUserId: string;
  fromProfileUrl: string;
  toUserId: string;
  toProfileUrl: string;
  fromDisplayName: string;
  toDisplayName: string;
}) => {
  let response: any = {};
  try {
    await connectMongoDB();

    const updatedChatDetails = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          chats: {
            audioUrl,
            messageType,
            messageStatus,
            fromUserId,
            fromDisplayName,
            fromProfileUrl,
            toUserId,
            toDisplayName,
            toProfileUrl,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    response = {
      data: updatedChatDetails,
      response: true,
      message: 'Chat updated successfully',
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
  getAllChatsByChatIdArray,
  createChatIdAndUpdateInUserChatList,
  sendTextMessage,
  sendImageMessage,
  sendAudioMessage,
  getChatByChatId,
  updateMessageStatus,
};
