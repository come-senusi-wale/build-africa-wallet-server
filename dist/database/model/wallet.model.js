"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
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
        required: true,
    },
    publicKeyBase64: {
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
}, {
    timestamps: true,
});
const WalletModel = (0, mongoose_1.model)("Wallet", WalletSchema);
exports.default = WalletModel;
