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
Object.defineProperty(exports, "__esModule", { value: true });
const emailVerifcationResTemplate_1 = require("../../../template/emailVerifcationResTemplate");
class AuthController {
    constructor({ authService }) {
        //sign up with email password
        this.signup = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._authService.registraion(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        this.emailVerifcation = ({ query }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._authService.emailVerifaction(query);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.send(emailVerifcationResTemplate_1.htmlEmailResponse);
        });
        this._authService = authService;
    }
}
exports.default = AuthController;
