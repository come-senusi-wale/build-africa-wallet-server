import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";

export const testTwo = async () => {
    try {
        // Initialize NEAR connection
        const near = await connect({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', // Or 'https://rpc.mainnet.near.org' for mainnet
            //deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
            //masterAccount: 'akinyemisaheedwale4.testnet',
            helperUrl: "https://helper.testnet.near.org",
        });
        // Initialize a wallet connection
        //const wallet = new WalletConnection(near);
        const accountId = 'akinyemisaheedwale2000.testnet';
    
        const keyPair = KeyPair.fromRandom('ed25519');
        console.log("keyPair", keyPair)

        const publicKeyee = keyPair.getPublicKey().toString()
        console.log('publicKey', publicKeyee)

        const publicKey = keyPair.getPublicKey().data.toString()
        console.log('publicKey', publicKey)

        const publicKeyHex = Buffer.from( keyPair.getPublicKey().data).toString('hex');
        console.log("Public Key (Hex):", publicKeyHex);

        const publicKeyBase64 = Buffer.from(keyPair.getPublicKey().data).toString('base64');
        console.log("Public Key (Base64):", publicKeyBase64);

        // const state  = await (await near.account(accountId)).state()
        // console.log("state", state)
        const me = await near.createAccount(accountId, keyPair.getPublicKey());
        console.log("newAccout", me)

        // Create an InMemorySigner using the generated key pair
        const keyStore = new keyStores.InMemoryKeyStore();
        await keyStore.setKey("testnet", accountId, keyPair);

        const signer = new InMemorySigner(keyStore);
     
        //const mnemonic = await signer.keyStore.getKey(near.connection.networkId, accountId).finally()
        //const mnemonic = await signer.keyStore.getAccounts()
        const mnemonic = await keyPair.toString()
        console.log("Mnemonic Phrase:", mnemonic);
     
        // Retrieve the private key
        const privateKey = keyPair.toString().split(':')[1];

        console.log("Private Key:", privateKey);

    } catch (error) {
        console.log("error", error);
    }
}

// Function to extract mnemonic from key store string
function extractMnemonicFromKeyStoreString(keyStoreString: string): string | undefined {
    // Assuming the mnemonic phrase is separated by spaces
    const words = keyStoreString.split(' ');
    // Assuming the mnemonic phrase contains 12 words
    if (words.length >= 12) {
        return words.slice(0, 12).join(' ');
    } else {
        return undefined;
    }
}
