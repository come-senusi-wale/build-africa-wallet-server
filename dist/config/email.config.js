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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailRespotory {
    constructor() {
        this.transporterInit = () => {
            return nodemailer_1.default.createTransport({
                service: "gmail",
                secureConnection: false,
                port: 465,
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: true,
                },
            });
        };
        this.sendEmail = ({ emailTo, subject, html }) => __awaiter(this, void 0, void 0, function* () {
            // Init the nodemailer transporter
            const transporter = this.transporterInit();
            try {
                let response = yield transporter.sendMail({
                    from: "BuidlAfrica",
                    to: emailTo,
                    subject: subject,
                    html: html,
                });
                return response;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
    }
}
exports.default = EmailRespotory;
