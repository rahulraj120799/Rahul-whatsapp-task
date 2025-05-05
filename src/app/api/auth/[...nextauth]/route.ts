import { authConfig } from "@/server/libs/auth";
import NextAuth from "next-auth/next";


const handler = NextAuth(authConfig);

export {handler as GET, handler as POST}
