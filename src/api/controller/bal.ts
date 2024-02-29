import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";

export const balance = async () => {
    try {
        // Initialize NEAR connection
        const near = await connect({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
            //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
            //masterAccount: 'akinyemisaheedwale4.testnet',
            helperUrl: "https://helper.testnet.near.org",
            walletUrl: 'https://wallet.testnet.near.org',
        
        });
        // Initialize a wallet connection
        //const wallet = new WalletConnection(near);
        const accountId = 'wecome.testnet';
    
        const account = await near.account(accountId);
        const balance = await account.getAccountBalance();

        //KeyPair.fromString()

console.log('Balance:', balance);
    } catch (error) {
        console.log("error", error);
    }
}

