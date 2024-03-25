import { Document, Types, ObjectId } from "mongoose";

export interface IToken extends Document {
  _id: ObjectId;
  telgramId: string
  accountId: string;
  contractId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: number;
  tokenImg: string;
  createdAt: Date;
  updatedAt: Date;
}