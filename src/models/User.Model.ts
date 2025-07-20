import mongoose, { Schema, Document } from "mongoose";
import { Message } from "./Message.model";

// only for typeScript write : "string" not "String"
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}


// in mongoose always write capital : not "string" but this "String" ok
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required."],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        trim: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "please use a valid email address."]
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required.']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required.']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "messages"
        }
    ]
});

export const User = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('users', UserSchema))
