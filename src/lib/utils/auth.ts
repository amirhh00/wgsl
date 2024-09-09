import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/utils/zod";
import { saltAndHashPassword } from "@/lib/utils/password";
import { getUserFromDb, pool } from "@/lib/utils/db.mjs";
import PostgresAdapter from "@auth/pg-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  // debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  adapter: PostgresAdapter(pool),
  basePath: "/",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await signInSchema.parseAsync(credentials);
          // logic to salt and hash password
          const pwHash = await saltAndHashPassword(email, password);

          // logic to verify if the user exists
          user = await getUserFromDb(email, pwHash);

          if (!user) {
            throw new Error("User not found.");
          }

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
});
