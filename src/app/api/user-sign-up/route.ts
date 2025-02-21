import { User, UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {username, email, college, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username already exist"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email,
            isVerified: true
        })        

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User already exist"
                    },
                    {
                        status: 400
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserVerifiedByEmail.password=hashedPassword
                existingUserVerifiedByEmail.verifyCode=verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existingUserVerifiedByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                college: college,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: "Error sending verification email (user-sign-up route.ts)" 
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Email sent successfully" 
            },
            {
                status: 200
            }
        )

    } catch (err) {
        console.error("Error in signing up. Error: ",err)
        return Response.json(
            {
                success: false,
                message: "Error Signing up"
            },
            {
                status: 500
            }
        )
    }
}