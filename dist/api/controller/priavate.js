"use strict";
// import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";
// export const privateKey = async () => {
//     try {
//         // Initialize NEAR connection
//         const near = await connect({
//             networkId: 'testnet', // Or 'mainnet'
//             nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
//             //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
//             deps: { keyStore: new keyStores.InMemoryKeyStore() },
//             //masterAccount: 'akinyemisaheedwale4.testnet',
//             helperUrl: "https://helper.testnet.near.org",
//             walletUrl: 'https://wallet.testnet.near.org',
//         });
//         const privates = '4qhmiBQ8yh4UWU4rGTGKaSbxT8gXUZ5JDSh7fHjZp4PckeBS7nXNT6vm9oSrUxAGFq9PrMu6BGuLprS8p32hxZsf'
//         const keyPair = KeyPair.fromString(privates);
//         // const signer = new InMemorySigner(near.connection.signer.keyStore); // Corrected property name
//         // near.connection.signer = signer;
//         // const accountId = await signer.getAccountId();
//         // console.log('accountId', accountId)
//         const publicKey = keyPair.getPublicKey();
//         const signer = new InMemorySigner(near.connection.signer.keyStore); // Create a signer
//         await signer.keyStore.setKey(near.config.networkId, near.accountCreator, keyPair); // Set the key pair for the signer
//         const accountId = await near.accountIdFromPublicKey(publicKey); // Get the account ID associated with the public key
//         console.log('accountId', accountId);
//     } catch (error) {
//         console.log("error", error);
//     }
// }
