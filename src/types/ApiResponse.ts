import { Message } from "@/models/Message.model";
export interface ApiResponse {
    success: boolean;
    message: string;
    error: boolean;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}