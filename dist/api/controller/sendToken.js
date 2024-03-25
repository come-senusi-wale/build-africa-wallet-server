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
exports.sendNearToken = void 0;
const near_api_js_1 = require("near-api-js");
const sendNearToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize NEAR connection
        const near = yield (0, near_api_js_1.connect)({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
            //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
            deps: { keyStore: new near_api_js_1.keyStores.InMemoryKeyStore() },
            //masterAccount: 'akinyemisaheedwale4.testnet',
            // helperUrl: "https://helper.testnet.near.org",
            // walletUrl: 'https://wallet.testnet.near.org',
        });
        // Initialize a wallet connection
        //const wallet = new WalletConnection(near);
        const accountId = 'walecomese.testnet';
        const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
        const privateKey = 'sx7eHBCgwvUBKM8AX8Tb9gMyni6adCzbsauwcXm4UgymYKeQq7BRrszjorSX6bTd47agkhbqgQJKhqN6rQXHud7';
        const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
        yield keyStore.setKey('testnet', accountId, keyPair);
        // Create a signer with the key store
        const signer = new near_api_js_1.InMemorySigner(keyStore);
        const me = (yield signer.keyStore.getAccounts('testnet'))[0];
        console.log('signer', me);
        const see = yield keyStore.getKey('testnet', accountId);
        // Use the signer to create an account
        // const account = await near.account('your-account-id', signer);
        const account = yield near.account(me);
        //console.log("Key store:", await keyStore.getKey('testnet', accountId));
        //const walletConnection = new WalletConnection(near);
        const parsedAmount = near_api_js_1.utils.format.parseNearAmount('1'); // Convert to yoctoNEAR
        const result = yield account.sendMoney('akinyemisaheedwale99.testnet', parsedAmount);
        console.log({ success: true, transactionHash: result.transaction.hash });
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.sendNearToken = sendNearToken;
