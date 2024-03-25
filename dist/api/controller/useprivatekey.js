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
exports.privatee = void 0;
const near_api_js_1 = require("near-api-js");
const privatee = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize Near object
        const near = new near_api_js_1.Near({
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
        });
        const privateKey = "JCNyNrmHPN2JtGCuDnCXHxevL7kQZrirE7nbcU8TaEPEjt3iXgCR17xGe2PvpLVhHwDZCTDWC1Ht8MHvqWbywfe";
        // Create key pair from private key
        const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
        console.log('keyPair', keyPair);
        // get public key of account
        const publicKey = keyPair.getPublicKey().toString();
        console.log('publickey', publicKey);
        // Get account ID from key pair
        // Get account ID from key pair
        // const accountId = await near.connection.signer.(
        //     near.config.networkId,
        //     keyPair.getPublicKey()
        // );
        // Generate mnemonic phrase from key pair
        const mnemonicPhrase = keyPair.toString();
        console.log('mnemonicPhrase', mnemonicPhrase);
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.privatee = privatee;
