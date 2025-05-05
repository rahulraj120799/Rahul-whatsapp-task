import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectMongoDB from './mongodb';
import User from '@/server/model/user';
import { roles } from '@/utils/auth/roleAccess';
import { get } from 'lodash';
import { USER_TYPE } from '@/utils/constants';

interface CustomSession {
  accessToken?: string;
  user?: {
    id?: string;
    role?: string;
    email?: string;
    agencyId?: string;
    userId?: string;
    name?: {
      role?: string;
      userId?: string;
      agencyId?: string;
      isProfileInComplete?: boolean;
    };
  };
}

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || '',
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60, // 24 hours in seconds
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your.email@example.com',
        },
      },
      async authorize(credentials: any): Promise<any | null> {
        try {
          await connectMongoDB();
          const { id } = credentials || {};
          const userDetails = await User.findOne({
            _id: id,
          });
          return {
            name: userDetails?._id,
            email: userDetails?._id,
            image: { role: userDetails?.role },
          };
        } catch (error) {
          return Promise.resolve(null);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIEND_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    // @ts-ignore
    async session({
      token,
      user,
      session,
    }: {
      token: any;
      user: any;
      session: CustomSession;
    }) {
      try {
        session.accessToken = token.accessToken;
        if (session?.user?.email) {
          await connectMongoDB();
          const sessionUser = await User.findOne({
            emailAddress: session?.user?.email,
          });
          session.user.id = sessionUser._id;
          session.user.role = sessionUser.role;
          session.user.name = {
            role: sessionUser?.role,
            userId: sessionUser._id,
          };
        }
      } catch (err) {}
      return session;
    },
    async signIn({ user, account, profile }): Promise<any | boolean> {
      if (account?.provider === 'credentials') {
        // For Credentials authorize method handled signin part
        return user;
      }
      if (account?.provider === 'google' && !account?.email_verified) {
        if (!profile?.email) {
          throw new Error('No Profile');
        }
        await connectMongoDB();
        const data = await User.findOne({
          emailAddress: profile?.email,
        });
        if (!data?._id) {
          const params = {
            emailAddress: profile?.email,
            role: roles.whatsAppUser,
            isVerified: true,
            type: USER_TYPE.google,
            fullName: profile?.name,
            profileUrl: get(profile, 'picture', ''),
            loginType: [
              {
                type: 'google',
                name: profile?.name,
                profileUrl: get(profile, 'picture', ''),
                loggedTime: Date.now(),
              },
            ],
          };
          const createdAccount = await User.create(params);
          user.id = createdAccount?._id;
          return user;
        } else {
          await User.updateOne(
            { emailAddress: profile?.email },
            {
              $push: {
                loginType: {
                  type: 'google',
                  name: profile?.name,
                  profileUrl: get(profile, 'picture', ''),
                  loggedTime: Date.now(),
                },
              },
            }
          );
          user.id = data?._id;
          return user;
        }
      }
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user?.id;
        token.accessToken = user?.token;
      }

      return token;
    },
  },
  pages: {
    signIn: '/',
  },
};
