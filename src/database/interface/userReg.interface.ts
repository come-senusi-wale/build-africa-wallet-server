import { Document, Types, ObjectId } from "mongoose";

export interface IUserReg extends Document {
  _id: ObjectId;
  telgramId: string
  nin: string;
  verified: boolean;
  email: string;
  emailVerification: boolean;
  password: string
  createdAt: Date;
  updatedAt: Date;
}