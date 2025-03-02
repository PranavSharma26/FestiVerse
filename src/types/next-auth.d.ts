import 'next-auth'
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        username?: string;
        clubname?: string;
        role: "user" | "club";
        email?: string;
      }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            username?: string;
            clubname?: String;
            role: "user" | "club";
            email?: string;
        };
    }
    interface JWT {
        id: string;
        email?: string;
        role: "user" | "club";
    }
}

