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
const near_api_js_1 = require("near-api-js");
class NearCofig {
    constructor(network) {
        this.connect = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, near_api_js_1.connect)({
                networkId: `${this._network}`,
                nodeUrl: `https://rpc.${this._network}.near.org`,
                deps: { keyStore: new near_api_js_1.keyStores.InMemoryKeyStore() },
                helperUrl: `https://helper.${this._network}.near.org`,
            });
        });
        this._network = network;
    }
}
exports.default = NearCofig;
