import jwt from 'jsonwebtoken';
import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner, utils, Contract } from "near-api-js";
import UserRegModel from "../../../database/model/userReg.model";
import WalletModel from "../../../database/model/wallet.model";
import TokenModel from "../../../database/model/token.model";
import Encryption, {TokenType} from "../../../config/encryption.config";

class TokenService {
    private _encryption: Encryption

    constructor({encryption}: {
        encryption: Encryption
    }) {
        this._encryption = encryption
    }

    public encryptToken = (data: any) => {
        return jwt.sign(data, process.env.SECRET_ENCRYPTION_KEY!);
    }

    public decryptToken = (data: any): string => { 
        return jwt.verify(data, process.env.SECRET_ENCRYPTION_KEY!) as string;
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
    
    tokenInfo = async({contractId, accountId, token}: {
        contractId: string, 
        accountId: string, 
        token: string,
    }) => {
        try {
            const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
            if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
            const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            if (!user.verified) return { errors: [{ message: 'account not verified'}] };

            if (!user.emailVerification) return { errors: [{ message: 'email not verified'}] };

            const wallet = await WalletModel.findOne({telgramId: decoded?.telegramId, accountId: accountId})
            if (!wallet) return { errors: [{ message: 'unable to get account'}] };

            const network = process.env.NETWORK
            const near = await this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId)

            // create a NEAR account object
            const senderAccount = await near.account(accountId);

            const contract = new Contract(senderAccount, contractId, {
                viewMethods: [],
                changeMethods: [],
                useLocalViewExecution: false
            });

            const tokenMetadata = await contract.account.viewFunction({
                contractId,
                methodName: "ft_metadata",
            })

            const accountBalance = await contract.account.viewFunction({
                contractId,
                methodName: "ft_balance_of",
                args: {account_id: accountId}
            })

            return {status: true, data: {accountBalance, tokenMetadata} };
        } catch (error) {
            return { errors: [{ message: 'unable to get token info'}] };
        }
    }

    storeToken = async({contractId, accountId, token}: {
        contractId: string, 
        accountId: string, 
        token: string,
    }) => {
        try {
            const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
            if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
            const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            if (!user.verified) return { errors: [{ message: 'account not verified'}] };

            if (!user.emailVerification) return { errors: [{ message: 'email not verified'}] };

            const wallet = await WalletModel.findOne({telgramId: decoded?.telegramId, accountId: accountId})
            if (!wallet) return { errors: [{ message: 'unable to get account'}] };

            const checkToken = await TokenModel.findOne({telgramId: decoded?.telegramId, contractId, accountId })
            if (checkToken) return { errors: [{ message: 'token already imported'}] };

            const network = process.env.NETWORK
            const near = await this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId)

            // create a NEAR account object
            const senderAccount = await near.account(accountId);

            const contract = new Contract(senderAccount, contractId, {
                viewMethods: [],
                changeMethods: [],
                useLocalViewExecution: false
            });

            const tokenMetadata = await contract.account.viewFunction({
                contractId,
                methodName: "ft_metadata",
            })

            const newToken = new TokenModel({
                telgramId: decoded?.telegramId,
                accountId,
                contractId,
                tokenName: tokenMetadata.name,
                tokenSymbol: tokenMetadata.symbol,
                tokenDecimal: tokenMetadata.decimals,
                tokenImg: tokenMetadata.icon
            })

            await newToken.save()

            return {status: true, data: {tokenMetadata} };
        } catch (error) {
            return { errors: [{ message: 'unable to parform transaction'}] };
        }
    }

    sentToken = async({contractId, accountId, token, amount, recieverId}: {
        contractId: string, 
        accountId: string, 
        token: string,
        amount: number,
        recieverId: string
    }) => {
        try {
            const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
            if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };
            const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            if (!user.verified) return { errors: [{ message: 'account not verified'}] };

            if (!user.emailVerification) return { errors: [{ message: 'email not verified'}] };

            const wallet = await WalletModel.findOne({telgramId: decoded?.telegramId, accountId: accountId})
            if (!wallet) return { errors: [{ message: 'unable to get account'}] };

            const checkToken = await TokenModel.findOne({telgramId: decoded?.telegramId, contractId, accountId })
            if (!checkToken) return { errors: [{ message: 'token not imported'}] };

            const network = process.env.NETWORK
            const near = await this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId)

            // create a NEAR account object
            const senderAccount = await near.account(accountId);

            const contract = new Contract(senderAccount, contractId, {
                viewMethods: [],
                changeMethods: [],
                useLocalViewExecution: false
            });

            const accountBalance: any = await contract.account.viewFunction({
                contractId,
                methodName: "ft_balance_of",
                args: {account_id: accountId}
            })

            const amountInYoc: any = utils.format.parseNearAmount(amount.toString());
            
            if (amountInYoc > accountBalance) return { errors: [{ message: 'insufficient balance'}] };
            
            const sendToken = await contract.account.functionCall({
                contractId: contractId,
                methodName: 'ft_transfer',
                args: {receiver_id: recieverId, amount: amountInYoc},
                attachedDeposit: utils.format.parseNearAmount("0.000000000000000000000001")
            })
            

            return {status: true, data: {sendToken} };
        } catch (error) {
            return { errors: [{ message: 'unable to parform transaction'}] };
        }
    }

}

export default TokenService;


