// // for Login 
// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// // connect DB and model
// import DBconnect from "@/lib/dbConnect";
// import { User } from "@/models/User.Model";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             id: "Credentials",
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "text", placeholder: "Enter Your Email" },
//                 username: { label: "Username", type: "text", placeholder: "Enter Your Username" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 // ✅ 1. Check credentials exist
//                 if (!credentials || !credentials.email || !credentials.username || !credentials.password) {
//                     return null;
//                 }

//                 // ✅ 2. Connect to DB
//                 await DBconnect();

//                 try {
//                     //✅  3. Find user
//                     const user = await User.findOne({
//                         $or: [
//                             { email: credentials.email },
//                             { username: credentials.username }
//                         ]
//                     }).lean();

//                     if (!user) {
//                         // return null;
//                         throw new Error("No User Founded With this Email or username.")
//                     }

//                     // ✅ 4. Compare password
//                     const isValidPassword = await bcrypt.compare(
//                         credentials.password,
//                         user.password
//                     );

//                     if (!isValidPassword) {
//                         // return null;
//                         throw new Error("Please Verify Your Account Before Login.")
//                     }

//                     // ✅ 5. Return plain user object (must have `id`)
//                     return {
//                         id: user._id.toString(),
//                         email: user.email,
//                         username: user.username,
//                     };
//                 } catch (error) {
//                     throw new Error(String(error))
//                 }
//             },
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/signin",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// };



// for Login 
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// connect DB and model
import DBconnect from "@/lib/dbConnect";
import { User } from "@/models/User.Model";

//credentials types here
type CredentialsType = {
    email: string;
    username: string;
    password: string;
};


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                username: { label: "username", type: "text" },
            },
            async authorize(credentials: CredentialsType | undefined): Promise<{ id: string; email: string; username: string; isVerified: boolean } | null> {
                if (!credentials || !credentials.email || !credentials.username || !credentials.password) {
                    return null;
                }
                await DBconnect();

                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email } // Allow username as email
                        ]
                    }).lean();

                    if (!user) {
                        throw new Error("No User Found with this Email or Username.");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please Verify Your Account Before Login.");
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        throw new Error("Invalid Password.");
                    }
                    else {
                        console.log("Login Successfull");
                        return user ? {
                            id: user._id.toString(),
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified
                        } : null;
                    }

                    // return user 

                } catch (error) {
                    throw new Error(String(error));
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token;
        },
        async session({ session, token }) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,

}