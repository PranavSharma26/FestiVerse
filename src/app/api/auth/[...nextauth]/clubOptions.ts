import dbConnect from "@/lib/dbConnect";
import { ClubModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: AuthOptions = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              username: { label: "Clubname", type: "text", placeholder: "clubname" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any):Promise<any> {
                await dbConnect()
                try {
                    const club = await ClubModel.findOne({
                        $or: [
                            {clubname: credentials.identifier},
                            {email: credentials.identifier}
                        ]
                    })
                    if(!club){
                        throw new Error('No Club Found')
                    }
                    if(!club.isVerified){
                        throw new Error('Club Not Verified')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,club.password)
                    if(isPasswordCorrect){
                        return club
                    }
                    else{
                        throw new Error('Password does not match')
                    }
                } catch (error) {
                    throw new Error('Error Signing In')
                }
            }
          })
    ],
    callbacks: {
        async jwt({ token, user}) {
            // if(user){
            //     token._id=user._id?.toString()
            //     token.isVerified=user.isVerified
            //     token.clubname=user.clubname
            // }
            return token
        },
        async session({ session, token }) {
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}