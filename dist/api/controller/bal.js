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
exports.balance = void 0;
const near_api_js_1 = require("near-api-js");
const balance = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize NEAR connection
        const near = yield (0, near_api_js_1.connect)({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
            //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
            deps: { keyStore: new near_api_js_1.keyStores.InMemoryKeyStore() },
            //masterAccount: 'akinyemisaheedwale4.testnet',
            helperUrl: "https://helper.testnet.near.org",
            walletUrl: 'https://wallet.testnet.near.org',
        });
        // Initialize a wallet connection
        //const wallet = new WalletConnection(near);
        const accountId = 'wecome.testnet';
        const account = yield near.account(accountId);
        const balance = yield account.getAccountBalance();
        //KeyPair.fromString()
        console.log('Balance:', balance);
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.balance = balance;
