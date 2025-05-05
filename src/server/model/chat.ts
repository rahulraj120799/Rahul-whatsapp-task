import mongoose, { Schema } from 'mongoose';

const whatappChatSchema = new Schema(
  {
    fromUserId: {
      type: String,
      default: '',
    },
    fromProfileUrl: {
      type: String,
      default: '',
    },
    fromDisplayName: {
      type: String,
      default: '',
    },
    toUserId: {
      type: String,
      default: '',
    },
    toProfileUrl: {
      type: String,
      default: '',
    },
    toDisplayName: {
      type: String,
      default: '',
    },
    chats: {
      type: [
        {
          message: {
            type: String,
            default: '',
          },
          messageType: {
            type: String,
            default: '',
          },
          imageUrl: {
            type: String,
            default: '',
          },
          audioUrl: {
            type: String,
            default: '',
          },
          messageStatus: {
            type: String,
            default: '',
          },
          fromUserId: {
            type: String,
            default: '',
          },
          fromDisplayName: {
            type: String,
            default: '',
          },
          fromProfileUrl: {
            type: String,
            default: '',
          },
          toUserId: {
            type: String,
            default: '',
          },
          toDisplayName: {
            type: String,
            default: '',
          },
          toProfileUrl: {
            type: String,
            default: '',
          },
          createdAt: {
            type: Date,
            default: Date.now(),
          },
          updatedAt: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const W_Chat =
  mongoose.models.W_Chat || mongoose.model('W_Chat', whatappChatSchema);

export default W_Chat;
