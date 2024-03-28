import { Schema, model } from "mongoose";
import { IWallet } from "../interface/wallet.interface";

const WalletSchema = new Schema(
    {
      telgramId: {
        type: String,
        required: true,
      },
      accountId: {
        type: String,
        required: true,
      },
      privateKey: {
        type: String,
        required: true,
      },
      publicKeyString: {
        type: String,
        required: true,
      },
      publicKeyData: {
        type: String,
        required: true,
      },
      publicKeyHex: {
        type: String,
        
      },
      publicKeyBase64: {
        type: String,
        
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
  
  const WalletModel = model<IWallet>("Wallet", WalletSchema);
  
  export default WalletModel;