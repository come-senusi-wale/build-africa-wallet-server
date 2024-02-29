import { Document, Types, ObjectId } from "mongoose";

export interface IWallet extends Document {
  _id: ObjectId;
  telgramId: string
  accountId: string;
  privateKey: string;
  publicKeyString: string;
  publicKeyData: string;
  publicKeyHex: string;
  publicKeyBase64: string;
  createdAt: Date;
  updatedAt: Date;
}