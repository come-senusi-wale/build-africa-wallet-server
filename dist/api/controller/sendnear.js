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
exports.sendNearTokenTwo = void 0;
const near_api_js_1 = require("near-api-js");
const sendNearTokenTwo = () => __awaiter(void 0, void 0, void 0, function* () {
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
        //const privateKey = 'sx7eHBCgwvUBKM8AX8Tb9gMyni6adCzbsauwcXm4UgymYKeQq7BRrszjorSX6bTd47agkhbqgQJKhqN6rQXHud7';
        const privateKey = '3xWoXpSWFnY523QAKB53NkFrvdizJ7z4AixTztqTrkdV';
        // const keyStore = new keyStores.InMemoryKeyStore();
        // const keyPair = KeyPair.fromString(privateKey);
        // //const keyPair = KeyPair.fromRandom('ed25519');
        // await keyStore.setKey('testnet', accountId, keyPair);
        // // Create a signer with the key store
        // const signer = new InMemorySigner(keyStore);
        // console.log("Key pair set in key store:", await keyStore.getKey('testnet', accountId));
        // const transaction = {
        //     receiverId: 'akinyemisaheedwale99.testnet', // receiver's account ID
        //     actions: [
        //         transactions.transfer(utils.format.parseNearAmount('1')) // transfer action (send 1 NEAR)
        //     ]
        // };
        // // Get the sender's account
        // const account = await near.account(accountId);
        // // Create, sign, and send the transaction
        // const result = await account.signAndSendTransaction(transaction);
        // console.log({ success: true, transactionHash: result.transaction.hash });
        const account = yield near.account(accountId);
        yield account.sendMoney("akinyemisaheedwale99.testnet", // receiver account
        "1000000000000000000000000" // amount in yoctoNEAR
        );
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.sendNearTokenTwo = sendNearTokenTwo;
