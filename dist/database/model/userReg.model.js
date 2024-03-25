"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userRegSchema = new mongoose_1.Schema({
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
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    emailVerification: {
        type: Boolean,
        default: false,
    },
    password: {
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
}, {
    timestamps: true,
});
const UserRegModel = (0, mongoose_1.model)("UserReg", userRegSchema);
exports.default = UserRegModel;
