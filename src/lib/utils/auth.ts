import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/utils/zod";
// Your own logic for dealing with plaintext password strings; be careful!
import { saltAndHashPassword } from "@/lib/utils/password";
import { getUserFromDb, pool } from "@/lib/utils/db.mjs";
import PostgresAdapter from "@auth/pg-adapter";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";

// type UserInputs = typeof signInSchema._type;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  adapter: PostgresAdapter(pool),
  basePath: "/",
  // pages: {
  // signIn: "/auth/sign-in",
  // signOut: "/auth/signout",
  // error: "/auth/error",
  // verifyRequest: "/auth/verify-request",
  // newUser: "/auth/sign-up",
  // },
  providers: [
    Credentials({
      name: "Credentials",
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await signInSchema.parseAsync(credentials);
          // // logic to salt and hash password
          const pwHash = await saltAndHashPassword(email, password);

          // // logic to verify if the user exists
          user = await getUserFromDb(email, pwHash);

          if (!user) {
            throw new Error("User not found.");
          }

          // return JSON object with the user data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     return true;
  //   },
  //   async redirect({ url, baseUrl }) {
  //     if (url.startsWith("/admin")) {
  //       return baseUrl;
  //     }
  //     return "/admin";
  //   },
  //   async session({ session, user, token }) {
  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, session, trigger }) {
  //     return token;
  //   },
  //   // async jwt({ token, user, account, profile, session, trigger }) {
  //   //   if (user) {
  //   //     token.id = user.user.id;
  //   //   }
  //   //   return Promise.resolve(token);
  //   // },

  //   // async session(session, user) {
  //   //   session.jwt = user.jwt;
  //   //   session.id = user.id;
  //   //   session.username = user.username;
  //   //   return Promise.resolve(session);
  //   // },
  // },
});
