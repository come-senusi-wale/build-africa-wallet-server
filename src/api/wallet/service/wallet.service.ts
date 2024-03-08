import jwt from 'jsonwebtoken';
import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner, utils } from "near-api-js";
import UserRegModel from "../../../database/model/userReg.model";
import WalletModel from "../../../database/model/wallet.model";
import NearConfig from "../../../config/near.config";
import Encryption, {TokenType} from "../../../config/encryption.config";


class WalletService {
    private _nearConfig: NearConfig
    private _encryption: Encryption

    constructor({nearConfig, encryption}: {
        nearConfig: NearConfig, 
        encryption: Encryption
    }) {
        this._nearConfig = nearConfig
        this._encryption = encryption
    }

    public encryptToken = (data: any) => {
        return jwt.sign(data, process.env.SECRET_ENCRYPTION_KEY!);
    }

    public decryptToken = (data: any): string => { 
        return jwt.verify(data, process.env.SECRET_ENCRYPTION_KEY!) as string;
    }

    private nearConnet = async(network: any) => {
        return await connect({
            networkId: `${network}`, // Or 'mainnet'
            nodeUrl: `https://rpc.${network}.near.org `, 
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
            helperUrl: `https://helper.${network}.near.org`,
        })
    } 

    private nearPrivateKeyConnet = async(network: any, privateKey: string, sender: string) => {
        // sets up an empty keyStore object in memory using near-api-js
        const keyStore = new keyStores.InMemoryKeyStore();

        // creates a keyPair from the private key provided in your .env file
        const keyPair = KeyPair.fromString(privateKey);

        // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
        await keyStore.setKey(network, sender, keyPair);

        const prefix = (network === "testnet") ? "testnet" : "www";

        const config = {
            networkId: network,
            keyStore,
            nodeUrl: `https://rpc.${network}.near.org`,
            walletUrl: `https://wallet.${network}.near.org`,
            helperUrl: `https://helper.${network}.near.org`,
            explorerUrl: `https://${prefix}.nearblocks.io`,
        };

        // connect to NEAR! :)
        return await connect(config);
    } 

    //check if account is available
    public checkAcount = async ({accountId}: {
        accountId: string
    }) => {
        const network = process.env.NETWORK
        const near = await this.nearConnet(network)

        try {
            await (await near.account(accountId)).state()
            return { errors: [{ message: `${accountId} already taken`}] };
        } catch (error) {
            try {
                return {status: true, data: {message: `${accountId} is avialble`} };
            } catch (error) {
                return { errors: [{ message: 'unable to get account'}] };
            }
            
        }
    }

    //check if account is valid
    public checkIfAcountIsCorrect = async ({accountId}: {
        accountId: string
    }) => {
        const network = process.env.NETWORK
        const near = await this.nearConnet(network)

        try {
            await (await near.account(accountId)).state()
            return {status: true, data: {message: `${accountId} is valid`} };
        } catch (error) {
            try {
                return { errors: [{ message: 'invalid account ID'}] };
                
            } catch (error) {
                return { errors: [{ message: 'invalid account ID'}] };
            }
            
        }
    }


    // get account near token balance
    public getAccountNearBalance = async ({accountId}: {
        accountId: string
    }) => {
        const network = process.env.NETWORK
        const near = await this.nearConnet(network)

        try {
            const account = await near.account(accountId);
            const balance = (await account.getAccountBalance()).available;

            const availableBalance = parseInt(balance) / 10**24
            return {status: true, data: {balance: availableBalance.toFixed(5)} };
        } catch (error) {
           
            return { errors: [{ message: 'unable to get balance'}] };
            
        }
    }

    // create Account
    public createAccount = async ({accountId, token}: {
        accountId: string, 
        token: string
    }) => {
        const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
        if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
        const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
        if (!user) return { errors: [{ message: 'user not found'}] };

        const network = process.env.NETWORK
        const near = await this.nearConnet(network)

        const keyPair = KeyPair.fromRandom('ed25519');

        try {
            const state  = await (await near.account(accountId)).state()
            return { errors: [{ message: 'account already taken'}] };
        } catch (error) {
            try {
                const publicKeyString = keyPair.getPublicKey().toString()
            
                const publicKeyData = keyPair.getPublicKey().data.toString()

                const publicKeyHex = Buffer.from( keyPair.getPublicKey().data).toString('hex');

                const publicKeyBase64 = Buffer.from(keyPair.getPublicKey().data).toString('base64');

                await near.createAccount(accountId, keyPair.getPublicKey());

                const keyStore = new keyStores.InMemoryKeyStore();
                await keyStore.setKey('testnet', accountId, keyPair);
        
                const signer = new InMemorySigner(keyStore);
                const mnemonic = await signer.keyStore.getKey(near.connection.networkId, accountId).finally()
             
                // Retrieve the private key
                const privateKey = keyPair.toString().split(':')[1];

                const newWallet = new WalletModel({
                    telgramId: decoded?.telegramId,
                    accountId,
                    privateKey: this.encryptToken(privateKey),
                    publicKeyString,
                    publicKeyData,
                    publicKeyHex,
                    publicKeyBase64
                })

                await newWallet.save()

                return {status: true, data: {accountId} };

            } catch (error) {
                return { errors: [{ message: 'unable to create account'}] };
            }
        }

    }

    // export Account
    public exportAccount = async ({accountId, token, password}: {
        accountId: string, 
        token: string,
        password: string
    }) => {
        try {
            const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
            if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
            const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            if (!user.emailVerification) return { errors: [{ message: 'email not verified'}] };

            const comparePassword = this._encryption.comparePassword(password, user.password)
            if (!comparePassword) return { errors: [{ message: 'incorrect password'}] };

            const wallet = await WalletModel.findOne({telgramId: decoded?.telegramId, accountId: accountId})
            if (!wallet) return { errors: [{ message: 'unable to get account'}] };

            return {status: true, data: {privateKey: this.decryptToken(wallet.privateKey)} };

        } catch (error) {
            return { errors: [{ message: 'unable to get Account'}] };
        }

    }

    // send near token 
    public sendNearToken = async ({accountId, token, to, amount}: {
        accountId: string, 
        token: string,
        to: string,
        amount: number
    }) => {
        try {
            console.log(1)
            const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
            if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
            const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            console.log(2)

            // if (!user.verified) return { errors: [{ message: 'account not verified'}] };

            if (!user.emailVerification) return { errors: [{ message: 'email not verified'}] };

            console.log(3)

            const wallet = await WalletModel.findOne({telgramId: decoded?.telegramId, accountId: accountId})
            if (!wallet) return { errors: [{ message: 'unable to get account'}] };

            console.log(4)

            const network = process.env.NETWORK
            const near = await this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId)

            console.log(5)

            // create a NEAR account object
            const senderAccount = await near.account(accountId);

            console.log(6)

            const amountINYocNear = utils.format.parseNearAmount(amount.toString());

            const result = await senderAccount.sendMoney(to, amountINYocNear)

            console.log(7)

            return {status: true, data: {transactionHash: result.transaction.hash} };

        } catch (error) {
            return { errors: [{ message: 'unable to parform transaction'}] };
        }

    }

}

export default WalletService;