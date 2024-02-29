import { Schema, model } from "mongoose";
import { IUserReg } from "../interface/userReg.interface";

const userRegSchema = new Schema(
    {
      telgramId: {
        type: String,
        required: true,
        unique: true,
      },
      nin: {
        type: String,
        // required: true,
        // unique: true,
      },
      verified: {
        type: Boolean,
        default: true,
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
  
  const UserRegModel = model<IUserReg>("UserReg", userRegSchema);
  
  export default UserRegModel;