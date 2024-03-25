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
exports.testTwo = void 0;
const near_api_js_1 = require("near-api-js");
const testTwo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize NEAR connection
        const near = yield (0, near_api_js_1.connect)({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
            //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
            deps: { keyStore: new near_api_js_1.keyStores.InMemoryKeyStore() },
            //masterAccount: 'akinyemisaheedwale4.testnet',
            helperUrl: "https://helper.testnet.near.org",
        });
        // Initialize a wallet connection
        //const wallet = new WalletConnection(near);
        const accountId = 'akinyemisaheedwale2000.testnet';
        const keyPair = near_api_js_1.KeyPair.fromRandom('ed25519');
        console.log("keyPair", keyPair);
        const publicKeyee = keyPair.getPublicKey().toString();
        console.log('publicKey', publicKeyee);
        const publicKey = keyPair.getPublicKey().data.toString();
        console.log('publicKey', publicKey);
        const publicKeyHex = Buffer.from(keyPair.getPublicKey().data).toString('hex');
        console.log("Public Key (Hex):", publicKeyHex);
        const publicKeyBase64 = Buffer.from(keyPair.getPublicKey().data).toString('base64');
        console.log("Public Key (Base64):", publicKeyBase64);
        // const state  = await (await near.account(accountId)).state()
        // console.log("state", state)
        const me = yield near.createAccount(accountId, keyPair.getPublicKey());
        console.log("newAccout", me);
        // Create an InMemorySigner using the generated key pair
        const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
        yield keyStore.setKey("testnet", accountId, keyPair);
        const signer = new near_api_js_1.InMemorySigner(keyStore);
        //const mnemonic = await signer.keyStore.getKey(near.connection.networkId, accountId).finally()
        //const mnemonic = await signer.keyStore.getAccounts()
        const mnemonic = yield keyPair.toString();
        console.log("Mnemonic Phrase:", mnemonic);
        // Retrieve the private key
        const privateKey = keyPair.toString().split(':')[1];
        console.log("Private Key:", privateKey);
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.testTwo = testTwo;
// Function to extract mnemonic from key store string
function extractMnemonicFromKeyStoreString(keyStoreString) {
    // Assuming the mnemonic phrase is separated by spaces
    const words = keyStoreString.split(' ');
    // Assuming the mnemonic phrase contains 12 words
    if (words.length >= 12) {
        return words.slice(0, 12).join(' ');
    }
    else {
        return undefined;
    }
}
