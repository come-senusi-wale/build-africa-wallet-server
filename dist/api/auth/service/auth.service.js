"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userReg_model_1 = __importDefault(require("../../../database/model/userReg.model"));
const encryption_config_1 = require("../../../config/encryption.config");
const emailTemplate_1 = require("../../../template/emailTemplate");
class AuthService {
    constructor({ encryption, emailRespotory }) {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        // registration
        this.registraion = ({ email, password, token }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this._encryption.decryptToken(token, encryption_config_1.TokenType.accessToken);
                if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegramId))
                    return { errors: [{ message: 'Invalid request' }] };
                const user = yield userReg_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId });
                if (!user)
                    return { errors: [{ message: 'user not found' }] };
                const checkEmail = yield userReg_model_1.default.findOne({ email });
                if (checkEmail && checkEmail.emailVerification)
                    return { errors: [{ message: 'email already exist' }] };
                const hashPassword = this._encryption.encryptPassword(password);
                user.email = email;
                user.password = hashPassword;
                yield user.save();
                const port = process.env.PORT;
                const emaiHtml = (0, emailTemplate_1.htmlMailTemplate)(port, email, decoded === null || decoded === void 0 ? void 0 : decoded.telegramId);
                this._emailRespotory.sendEmail({ emailTo: email, subject: "Email verification", html: emaiHtml });
                return { status: true, data: { message: 'please! check your email for verification' } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to create account' }] };
            }
        });
        // email verification
        this.emailVerifaction = ({ email, telegramId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userReg_model_1.default.findOne({ telgramId: telegramId });
                if (!user)
                    return { errors: [{ message: 'user not found' }] };
                const checkEmail = yield userReg_model_1.default.findOne({ email });
                if (!checkEmail)
                    return { errors: [{ message: 'invalid Email' }] };
                if (checkEmail.emailVerification)
                    return { errors: [{ message: 'Email Already verify' }] };
                user.emailVerification = true;
                yield user.save();
                return { status: true, data: { message: 'email successfully verified' } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to verified email' }] };
            }
        });
        this._encryption = encryption;
        this._emailRespotory = emailRespotory;
    }
}
exports.default = AuthService;
