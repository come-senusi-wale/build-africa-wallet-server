import jwt from 'jsonwebtoken';
import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";
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

    private nearConnet = async() => {
        return await connect({
            networkId: 'testnet', // Or 'mainnet'
            nodeUrl: 'https://rpc.testnet.near.org', 
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
            helperUrl: "https://helper.testnet.near.org",
        })
    } 

    //check if account is available
    public checkAcount = async ({accountId}: {
        accountId: string
    }) => {
        const near = await this.nearConnet()

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

    // create Account
    public createAccount = async ({accountId, token}: {
        accountId: string, 
        token: string
    }) => {
        const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
        if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
        const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
        if (!user) return { errors: [{ message: 'user not found'}] };

        const near = await this.nearConnet()

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

}

export default WalletService;