import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/client";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and Password are required.");
        }

        const teacher = await db.teacher.findUnique({
          where: { email: credentials.email },
        });

        if (!teacher) {
          throw new Error("No teacher found with this email.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, teacher.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        return teacher;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  pages: {
    signIn: "/auth/signin", // Specify the path to your custom sign-in page
  },
};
