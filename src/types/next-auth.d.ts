import 'next-auth'
declare module 'next-auth'{
    interface User{
        _id?: string,
        isVerified?: string
        username?: string
    }
}
declare module 'next-auth'{
    interface Club{
        _id?: string
        isVerified?: string
        clubname?: string
    }
}
