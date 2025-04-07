import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
import { sendVerificationRequest } from "~/app/mailers/auth-mailer";



import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;

      role: "USER" | "LIBRARIAN";
    } & DefaultSession["user"];
  }


}


export const authConfig = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest,
    })
  
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  events: {
    async createUser({ user }) {
      const librarianEmail = "librarian@library.com";
  
      const role = user.email === librarianEmail ? "LIBRARIAN" : "USER";
  
      await db.user.update({
        where: { id: user.id },
        data: { role },
      });
    },
  }
} satisfies NextAuthConfig;
