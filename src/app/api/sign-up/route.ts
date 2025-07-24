import sendVerificationEmail from "@/helpers/sendVerificationEmail.helper";
import DBconnect from "@/lib/dbConnect";
import { User } from "@/models/User.Model";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await DBconnect();

    try {
        // we get data like:(username, email, password) from frontend in json format. and we get the json from request props. 
        // (always remember if anything we do in database we need to use "await")
        const { username, email, password } = await request.json();
        // create verify code---
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        // console.log(verifyCode);

        // now user is already registered or not . 
        // before that we need to find the user from MongoDB or Database. => (findOne)
        // check for the username already used or not
        
        const ExistingUserVerifiedByUsername = await User.findOne({ username, isVerified: true });

        if (ExistingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                error: true,
                message: "username Is Already Taken."
            }, { status: 400 })
        }

        // Check for the email is used or not
        const ExistingUserVerifiedByEmail = await User.findOne({ email });

        if (!ExistingUserVerifiedByEmail) {
            // if email didn't match then 
            // create new user but before that we need to make the simple_password to hast_password
            const hashPassword = await bcrypt.hash(password, 100);
            //send verify code and create verify code expiry time;
            const expiryData = new Date() // running time;
            expiryData.setHours(expiryData.getHours() + 1) // after 1 hour this code will be expired.
            // =================== now set New user.======================================================
            const newUser = new User({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryData,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            //========== Now Save in MongoDB or Database ==============
            await newUser.save();
        }
        else {
            // if this email already used :
            if(ExistingUserVerifiedByEmail.isVerified) {
                 return Response.json({
                success: false,
                error: true,
                message:  `User Already Exist with this Email : ${email} `
            }, { status: 400 })
            }
            else{
                const hashPassword = await bcrypt.hash(password,10);
                ExistingUserVerifiedByEmail.password = hashPassword;
                ExistingUserVerifiedByEmail.verifyCode = verifyCode;
                ExistingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // mean 1 hours

                // save data in mongoDB or Database.
                await ExistingUserVerifiedByEmail.save()
            }
        }

        // Now Send Verification Email.======= use "await" before using email related ==================
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log('Email Response : ', emailResponse);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                error: true,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            error: false,
            message: "User Registered Successfully. Please Verify Your Email." // or emailResponse.message
        },{status: 201})

    } catch (error) {
        console.error("Error in Sign-up : ", error);
        return Response.json({
            success: false,
            error: true,
            message: "Error in Register User.",
            data: error
        }, { status: 500 })
    }
}




