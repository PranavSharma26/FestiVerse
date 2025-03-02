import NextAuth, {NextAuthOptions} from "next-auth";
import { userAuthOptions } from "../userOptions";
import { clubAuthOptions } from "../clubOptions";

const authOptions: NextAuthOptions = {
    providers: [...userAuthOptions.providers, ...clubAuthOptions.providers],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role as "user" | "club";
            return session;
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
