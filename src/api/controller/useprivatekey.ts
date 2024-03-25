import { Console } from "console";
import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";

export const privatee = async () => {
    try {
        // Initialize Near object
        const near = new Near({
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            keyStore: new keyStores.InMemoryKeyStore(),
        });

        const privateKey = "JCNyNrmHPN2JtGCuDnCXHxevL7kQZrirE7nbcU8TaEPEjt3iXgCR17xGe2PvpLVhHwDZCTDWC1Ht8MHvqWbywfe";
        
        // Create key pair from private key
        const keyPair = KeyPair.fromString(privateKey);
        console.log('keyPair', keyPair)

    
        // get public key of account
        const publicKey = keyPair.getPublicKey().toString();
        console.log('publickey', publicKey)

          // Get account ID from key pair
            // Get account ID from key pair
           
        // const accountId = await near.connection.signer.(
        //     near.config.networkId,
        //     keyPair.getPublicKey()
        // );

        // Generate mnemonic phrase from key pair
        const mnemonicPhrase = keyPair.toString();
        console.log('mnemonicPhrase', mnemonicPhrase)
    } catch (error) {
        console.log("error", error);
    }
}

