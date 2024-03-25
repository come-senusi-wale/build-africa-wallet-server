import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner, utils, transactions, Contract } from "near-api-js";

export const viewCall = async () => {
    try {
        const sender = "walecomese.testnet";
        const receiver = "akinyemisaheedwale99.testnet";
        const networkId = "testnet";
        const privateKey = 'sx7eHBCgwvUBKM8AX8Tb9gMyni6adCzbsauwcXm4UgymYKeQq7BRrszjorSX6bTd47agkhbqgQJKhqN6rQXHud7';

        const amount = utils.format.parseNearAmount("1");

        // sets up an empty keyStore object in memory using near-api-js
        const keyStore = new keyStores.InMemoryKeyStore();
        // creates a keyPair from the private key provided in your .env file
        const keyPair = KeyPair.fromString(privateKey);
        // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
        await keyStore.setKey(networkId, sender, keyPair);

        const prefix = (networkId === "testnet") ? "testnet" : "www";

        const config = {
            networkId,
            keyStore,
            nodeUrl: `https://rpc.${networkId}.near.org`,
            walletUrl: `https://wallet.${networkId}.near.org`,
            helperUrl: `https://helper.${networkId}.near.org`,
            explorerUrl: `https://${prefix}.nearblocks.io`,
        };

        // connect to NEAR! :)
        const near = await connect(config);
        
        // create a NEAR account object
        const senderAccount = await near.account(sender);

        // const result = await senderAccount.sendMoney(receiver, amount);

        // console.log({ success: true, transactionHash: result.transaction.hash });

        const contractId = "ico.akinyemisaheedwale2.testnet"; // Replace this with your actual contract ID
        const contract = new Contract(senderAccount, contractId, {
            viewMethods: ["investor_details"
            ],
            changeMethods: [],
            useLocalViewExecution: false
        });

        const veiwFunction = await contract.account.viewFunction({
            contractId: "ico.akinyemisaheedwale2.testnet",
            methodName: "investor_details",
            args: {account: 'akinyemisaheedwale3.testnet'}
        })
        
        console.log('veiwFunction', veiwFunction)

        const callFunction = await contract.account.functionCall({
            contractId: 'ico.akinyemisaheedwale2.testnet',
            methodName: 'invest',
            args: {"amount": 2000},
            attachedDeposit: utils.format.parseNearAmount("0.03")
        })

        console.log('callFunction', callFunction)

    } catch (error) {
        console.log("error", error);
    }
}

