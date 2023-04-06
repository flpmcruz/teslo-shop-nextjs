import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import { dbUsers } from "@/database";

export const authOptions = {

  providers: [
    // CredentialsProvider({
    Credentials({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Tu Correo" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Tu password",
        },
      },
      async authorize(credentials): Promise<any> {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),

    // ...add more providers here
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  //pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  //duracion de la sesion
  session: {
    maxAge: 259200, // 30 days
    strategy: "jwt" as const, // o "refreshable" o no definirla para usar la predeterminada
    updateAge: 86400, // 1 day
  },

  //Callbacks
  callbacks: {
    async jwt({ token, account, user }: any) {
      // console.log({ token, account, user });

      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "oauth":
            token.user = await dbUsers.oAUthToDbUser(
              user?.email || "",
              user?.name || ""
            );
            break;

          case "credentials":
            token.user = user;
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
};

export default NextAuth(authOptions);
