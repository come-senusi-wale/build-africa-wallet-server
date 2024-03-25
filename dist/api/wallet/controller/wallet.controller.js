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
class WalletController {
    constructor({ walletService }) {
        //check account Controller
        this.checkAccount = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._walletService.checkAcount(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        //check if account is valid account
        this.checkIfAcountIsCorrect = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._walletService.checkIfAcountIsCorrect(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        //get account near token balance
        this.getAccountNearBalance = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._walletService.getAccountNearBalance(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        this.createAccount = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._walletService.createAccount(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        this.exportAccount = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._walletService.exportAccount(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        //send near token
        this.sendNearToken = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._walletService.sendNearToken(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        this._walletService = walletService;
    }
}
exports.default = WalletController;
