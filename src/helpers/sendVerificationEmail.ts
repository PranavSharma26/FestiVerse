import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'FestiVerse : Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
      
        return {success: true, message: 'Successful'}
    } catch (error) {
        console.error("Error sending verification Email (sendVerificationEmail.ts) ",error)
        return {success: false, message: 'Failed to send email'}
    }
}