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
    constructor({ tokenService }) {
        this.tokenInfo = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tokenService.tokenInfo(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        this.storeToken = ({ body }, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tokenService.storeToken(body);
            if (response === null || response === void 0 ? void 0 : response.errors)
                return res
                    .status(401)
                    .json({ error: response.errors, status: false });
            res.json({ data: response, status: true });
        });
        this._tokenService = tokenService;
    }
}
exports.default = WalletController;
