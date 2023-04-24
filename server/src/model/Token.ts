import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose, { Date } from "mongoose";

// dam bao dang typescript phu hop voi mongo db 
export class Token{
    _id!: mongoose.Types.ObjectId

    @prop({required: true})
    userId!: string // token nay la cua ai 

    @prop({required: true})
    token!: string // token san sinh 

    @prop({default: Date.now, expires:60*5})
    createdAt: Date 
}

export const TokenModel = getModelForClass(Token)