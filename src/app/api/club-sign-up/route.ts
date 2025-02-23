import { ClubModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {clubname, email, college, password} = await request.json()
        const existingClubByClubname = await ClubModel.findOne({
            clubname,
            isVerified: true
        })

        if(existingClubByClubname){
            return Response.json(
                {
                    success: false, 
                    message: 'Club already exist'
                },
                { status: 400 }
            )
        }

        const existingClubByEmail = await ClubModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if(existingClubByEmail){
            if(existingClubByEmail.isVerified){
                return Response.json(
                    {
                        success: false, 
                        message: 'Club already exist'
                    },
                    { status: 400 }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingClubByEmail.password = hashedPassword
                existingClubByEmail.verifyCode=verifyCode
                existingClubByEmail.verifyCodeExpiry= new Date(Date.now()+3600000)
                await existingClubByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newClub = new ClubModel({
                clubname,
                email,
                password: hashedPassword,
                college,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false
            })
            await newClub.save()
        }
        const emailResponse = await sendVerificationEmail(email, clubname, verifyCode)
        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: 'Error sending verification code'
                },
                {
                    status: 400
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: 'Verification Code Sent'
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error signing the Club (catch)", error)
        return Response.json(
            {
                success: false,
                message: 'Error Signing up the club'
            },
            {
                status: 500
            }
        )
    }
}