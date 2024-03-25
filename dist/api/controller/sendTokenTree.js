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
exports.sendNearTokenTree = void 0;
const near_api_js_1 = require("near-api-js");
const sendNearTokenTree = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = "walecomese.testnet";
        const receiver = "akinyemisaheedwale99.testnet";
        const networkId = "testnet";
        const privateKey = 'sx7eHBCgwvUBKM8AX8Tb9gMyni6adCzbsauwcXm4UgymYKeQq7BRrszjorSX6bTd47agkhbqgQJKhqN6rQXHud7';
        const amount = near_api_js_1.utils.format.parseNearAmount("1");
        // sets up an empty keyStore object in memory using near-api-js
        const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
        // creates a keyPair from the private key provided in your .env file
        const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
        // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
        yield keyStore.setKey(networkId, sender, keyPair);
        const prefix = (networkId === "testnet") ? "testnet" : "www";
        const config = {
            networkId,
            keyStore,
            nodeUrl: `https://rpc.${networkId}.near.org`,
            walletUrl: `https://wallet.${networkId}.near.org`,
            helperUrl: `https://helper.${networkId}.near.org`,
            explorerUrl: `https://${prefix}.nearblocks.io`,
        };
        // connect to NEAR! :)
        const near = yield (0, near_api_js_1.connect)(config);
        // create a NEAR account object
        const senderAccount = yield near.account(sender);
        const result = yield senderAccount.sendMoney(receiver, amount);
        console.log({ success: true, transactionHash: result.transaction.hash });
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.sendNearTokenTree = sendNearTokenTree;
