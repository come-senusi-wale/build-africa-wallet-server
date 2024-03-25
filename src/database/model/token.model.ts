import { Schema, model } from "mongoose";
import { IToken } from "../interface/token.interface";

const TokenSchema = new Schema(
    {
      telgramId: {
        type: String,
        required: true,
      },
      accountId: {
        type: String,
        required: true,
      },
      contractId: {
        type: String,
        required: true,
      },
      tokenName: {
        type: String,
        required: true,
      },
      tokenSymbol: {
        type: String,
        required: true,
      },
      tokenDecimal: {
        type: Number,
        required: true,
      },
      tokenImg: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
    
    },
    {
      timestamps: true,
    }
  );
  
  const TokenModel = model<IToken>("Tokens", TokenSchema);
  
  export default TokenModel;