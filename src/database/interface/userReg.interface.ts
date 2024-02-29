import { Document, Types, ObjectId } from "mongoose";

export interface IUserReg extends Document {
  _id: ObjectId;
  telgramId: string
  nin: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}