import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

//=========== first option ================

// export default function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string,
// ): Promise<ApiResponse> {
//     try {

//         return Promise.resolve({ success: true, error: false, message: "Email has sended ."})
//     } catch (EmailError) {
//         console.error("there is an email error check : ",EmailError)
//         // return Promise.resolve({ success: false, error: true, message: "there is error in sending email verification code."})
//         return new Promise(resolve => resolve({ success:false, error: true, message: "there is an error in sending verification email."}))
//     }
//  }


// =========== second option =================

// export default async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string,
// ): Promise<ApiResponse> {
//     try {
//         // Your sending email logic here
//         return {
//             success: false,
//             error: true,
//             message: "there is error in sending email verification code."
//         };
//     } catch (EmailError) {
//         console.error("there is an email error check : ", EmailError);
//         return {
//             success: false,
//             error: true,
//             message: "there is error in sending email verification code."
//         };
//     }
// }

// ================ three option =====================

const sendVerificationEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {


        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: " Mystery Message | Verification Code",
            react: VerificationEmail({ username, otp: verifyCode }),
        });


        return {
            success: true,
            error: false,
            message: "Verification email sent successfully",
        };
    } catch (EmailError) {
        console.error("Email error:", EmailError);
        return {
            success: false,
            error: true,
            message: "There was an error sending the verification email.",
        };
    }
};

export default sendVerificationEmail;
