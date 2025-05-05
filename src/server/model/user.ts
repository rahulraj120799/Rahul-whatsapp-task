import mongoose, { Schema } from 'mongoose';

const whatappUserSchema = new Schema(
  {
    displayName: {
      type: String,
      default: '',
    },
    fullName: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
    },
    emailAddress: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    profileUrl: {
      type: String,
      default: '',
    },
    chatList: {
      type: [
        {
          chatId: {
            type: String,
            default: '',
          },
        },
      ],
      default: [],
    },
    loginType: {
      type: [
        {
          type: {
            type: String,
            default: '',
          },
          name: {
            type: String,
            default: '',
          },
          profileUrl: {
            type: String,
            default: '',
          },
          loggedTime: {
            type: Date,
            default: '',
          },
        },
      ],
      default: [],
    },
    role: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const W_User =
  mongoose.models.W_User || mongoose.model('W_User', whatappUserSchema);

export default W_User;
