// import { Near, WalletConnection, keyStores, KeyPair, Account, connect } from "near-api-js";

// export const test = async() => {
//     try {

//         const near =  new Near({
//             networkId: 'testnet', // or 'mainnet'
//             nodeUrl: 'https://rpc.testnet.near.org', // or 'https://rpc.mainnet.near.org'
//             walletUrl: 'https://wallet.testnet.near.org', // or 'https://wallet.mainnet.near.org'
//             //keyStore: new keyStores.InMemoryKeyStore() // You can create your own key store or use the default
//             //keyStore: new KeyPair. // You can create your own key store or use the default
//             keyStore: new keyStores.InMemoryKeyStore(),
//             helperUrl: "https://helper.testnet.near.org",
           
//         });

//         console.log("near", near)

//         const connectionConfig = {
//             networkId: "testnet",
//             keyStore: new keyStores.InMemoryKeyStore(),
//             nodeUrl: "https://rpc.testnet.near.org",
//             walletUrl: "https://testnet.mynearwallet.com/",
//             helperUrl: "https://helper.testnet.near.org",
//             explorerUrl: "https://testnet.nearblocks.io",
//           };

//         const nearConnection = await connect(connectionConfig);

//         console.log('nearConnection', nearConnection)


//         // const accountCreator = await near.account('akinyemisaheedwale5.testnet');

//         // // Generate a new key pair
//         // const keyPair = await near.connection.signer.keyStore

//         // // Create a new account
//         // const newAccountId = `new-account-${Math.floor(Math.random() * 100000)}`;
//         // //const publicKey = await accountCreator.connection.signer.getPublicKey('akinyemisaheedwale5.testnet', near.connection.networkId);
        
//         // //  const newaddress = await accountCreator.createAccount(newAccountId, keyPair, '10')

//         // console.log('accoutCreator', accountCreator)
//         // console.log('newAccoutId', newAccountId)
//         //  console.log('publicKey', keyPair)
//         // // console.log('newAdresss', newaddress)

//         const accountId = 'akinyemisaheedwale5.testnet'; // Extract account ID from request body
//         const newAccount = await near.account(accountId);
//         console.log("newAccount", newAccount)

         
//         const account = await nearConnection.account("akinyemisaheedwale5.testnet");
//         const keyPair1 = KeyPair.fromRandom('ed25519');
//         await account.createAccount(
//         "akinyemisaheedwale9.testnet", // new account name
//         keyPair1.getPublicKey(), // public key for new account
//         "10000000000000000000" // initial balance for new account in yoctoNEAR
//         );
        
//         // Create a new key pair
//         const keyPair = KeyPair.fromRandom('ed25519');
//         console.log("keyPair", keyPair)

//         // Create the account
//         // const newAccoutCreate = await newAccount.createAccount('akinyemisaheedwale8.testnet', keyPair.getPublicKey().toString(), '');
//         console.log("newAccountCreate", keyPair.getPublicKey())

//         // Generate mnemonic phrase
//         const mnemonicPhrase = keyPair.toString();
//         console.log("mnemonicPhrase", mnemonicPhrase)
    
        
//     } catch (error) {
//         console.log("erorr", error)
//     }

// }