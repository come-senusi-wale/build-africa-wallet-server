"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const accessTokenSecret = process.env.ACCESS_TOKEN;
const adminAccessTokenSecret = process.env.ADMIN_ACCESS_TOKEN;
var TokenType;
(function (TokenType) {
    TokenType["accessToken"] = "ACCESS_TOKEN_SECRET";
    TokenType["adminAccessToken"] = "ADMIN_ACCESS_TOKEN_SECRET";
    TokenType["refreshToken"] = "REFRESH_TOKEN_SECRET";
    TokenType["resetPassword"] = "RESET_PASSWORD_SECRET";
    TokenType["emailVerification"] = "EMAIL_VERIFICATION_SECRET";
})(TokenType || (exports.TokenType = TokenType = {}));
class EncryptionRepository {
    constructor() {
        this.getTokenKeyByType = (type) => {
            if (type === TokenType.adminAccessToken) {
                return { key: `${adminAccessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 30 * 2 };
            }
            return { key: `${accessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 7 };
        };
        this.encryptToken = (data, type) => {
            const token = this.getTokenKeyByType(type);
            return this.jwt.sign(data, token.key, { expiresIn: token.expiresIn });
        };
        this.decryptToken = (data, type) => {
            try {
                const token = this.getTokenKeyByType(type);
                return this.jwt.verify(data, token.key);
            }
            catch (err) {
                console.log(err);
                return null;
            }
        };
        this.encryptPassword = (password) => {
            return this.bcrypt.hashSync(password, 10);
        };
        this.comparePassword = (password, userPassword) => {
            return this.bcrypt.compareSync(password, userPassword);
        };
        this.jwt = jsonwebtoken_1.default;
        this.bcrypt = bcryptjs_1.default;
    }
}
exports.default = EncryptionRepository;
