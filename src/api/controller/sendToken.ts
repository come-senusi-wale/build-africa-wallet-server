import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner, utils } from "near-api-js";

export const sendNearToken = async () => {
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

        const keyStore = new keyStores.InMemoryKeyStore();
        const privateKey = 'sx7eHBCgwvUBKM8AX8Tb9gMyni6adCzbsauwcXm4UgymYKeQq7BRrszjorSX6bTd47agkhbqgQJKhqN6rQXHud7';
        const keyPair = KeyPair.fromString(privateKey);
        await keyStore.setKey('testnet', accountId, keyPair);
  
        
        // Create a signer with the key store
        const signer = new InMemorySigner(keyStore);

        const me = (await signer.keyStore.getAccounts('testnet'))[0]

        console.log('signer', me)

        const see = await keyStore.getKey('testnet', accountId)

    
        
        // Use the signer to create an account
        // const account = await near.account('your-account-id', signer);
        const account = await near.account(me);

        //console.log("Key store:", await keyStore.getKey('testnet', accountId));

        


    

       
        //const walletConnection = new WalletConnection(near);

        const parsedAmount = utils.format.parseNearAmount('1'); // Convert to yoctoNEAR

        const result = await account.sendMoney('akinyemisaheedwale99.testnet', parsedAmount);

        console.log({ success: true, transactionHash: result.transaction.hash });


    } catch (error) {
        console.log("error", error);
    }
}

