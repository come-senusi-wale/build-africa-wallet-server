import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner, utils, transactions } from "near-api-js";

export const sendNearTokenTwo = async () => {
    try {
        // Initialize NEAR connection
        const near = await connect({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
            //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
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

        const account = await near.account(accountId);
        await account.sendMoney(
        "akinyemisaheedwale99.testnet", // receiver account
        "1000000000000000000000000" // amount in yoctoNEAR
        );


    } catch (error) {
        console.log("error", error);
    }
}

