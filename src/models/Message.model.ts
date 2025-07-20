import mongoose, { Schema, Document } from "mongoose";

// only for typeScript write : "string" not "String"
export interface Message extends Document {
    content: string;
    createAt: Date;
}


// in mongoose always write capital : not "string" but this "String" ok
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createAt:{
        type: Date,
        required: true,
        default: Date.now
    }
});

export const Message = mongoose.models.Message as mongoose.Model<Message> || (mongoose.model<Message>('messages', MessageSchema))
