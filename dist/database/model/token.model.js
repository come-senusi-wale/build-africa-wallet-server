"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const TokenModel = (0, mongoose_1.model)("Tokens", TokenSchema);
exports.default = TokenModel;
