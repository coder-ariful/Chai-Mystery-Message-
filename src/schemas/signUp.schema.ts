import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(4, "Username must be At least 4 characters.")
    .max(20, "username must be no more than 20 characters.")
    .regex(/^[a-zA-Z0-9]{3,16}$/, "username must not contain special characters.")

export const emailValidation = z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email must not contain special characters.")

// export const passwordValidation = z
//     .string()
//     .min(6,"password must be At least 4 characters.")
//     .max(30, "password must be no more than 30 characters.")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: z
        .string()
        .min(6, { message: "password must be At least 6 characters." })
        .max(30, { message: "password must be no more than 30 characters." })
})