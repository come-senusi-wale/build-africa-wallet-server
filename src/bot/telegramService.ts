import UserRegModel from "../database/model/userReg.model";
import WalletModel from "../database/model/wallet.model";
import TokenModel from "../database/model/token.model";
import EncryptionRepository from "../config/encryption.config";
import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner, Contract } from "near-api-js";
import jwt from 'jsonwebtoken';

class TelegramService {
    userRegModel: typeof UserRegModel
    walletmodel: typeof WalletModel
    encryptionRepository: EncryptionRepository

    constructor({userRegModel, walletmodel, encryptionRepository}: {
        userRegModel: typeof UserRegModel
        walletmodel: typeof WalletModel
        encryptionRepository: EncryptionRepository
    }){
        this.userRegModel = userRegModel;
        this.encryptionRepository = encryptionRepository
        this.walletmodel = walletmodel
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
            nodeUrl: `https://rpc.${network}.near.org`, 
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

    userOpenChart = async ({ telgramId }: { telgramId: string }) => {
        const user = await this.userRegModel.findOne({telgramId})
        if (!user) {
            const newUser = new this.userRegModel({
                telgramId
            })

            await newUser.save()
        }
    }

    generateUserIDToken = async ( { telegramId, }: { telegramId: string; } ) => {
        try {
            const user = await this.userRegModel.findOne({telgramId: telegramId})
            if (!user) {
                return { status: false, message: 'error please send "/start" request again' };
            }
            const token = this.encryptionRepository.encryptToken({telegramId});

            return { status: true, token };
        } catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    getWalletBalance = async ( { telegramId, }: { telegramId: string; } ) => {
        try {
            const user = await this.userRegModel.findOne({telgramId: telegramId})
            console.log('user', user)
            if (!user) {
                return { status: false, message: 'error please send "/start" request again' };
            }

            const wallets = await this.walletmodel.find({telgramId: telegramId})

            let walletDetail = []

            const network = process.env.NETWORK
            const near = await this.nearConnet(network)

            for (let i = 0; i < wallets.length; i++) {
                const element = wallets[i];

                const account = await near.account(element.accountId);
                const balance = (await account.getAccountBalance()).available;

                const availableBalance = parseInt(balance) / 10**24

                const obj = {
                    wallet: element.accountId,
                    amount: availableBalance.toFixed(5)
                }
                
                walletDetail.push(obj)
            }
            
            return { status: true, walletDetail };

        } catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    getAllWalletofAUser = async ( { telegramId, }: { telegramId: string; } ) => {
        try {
            const user = await this.userRegModel.findOne({telgramId: telegramId})
            console.log('user', user)
            if (!user) {
                return { status: false, message: 'error please send "/start" request again' };
            }

            const wallets = await this.walletmodel.find({telgramId: telegramId})

            if (wallets.length < 1) {
                if (!user) {
                    return { status: false, message: 'error please create atleat one account' };
                }
            }

            return { status: true, wallets };

        } catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    getTokenBalanceOFWallet = async({ telegramId, }: { telegramId: string; }) => {
        try {
            const user = await this.userRegModel.findOne({telgramId: telegramId})
            console.log('user', user)
            if (!user) {
                return { status: false, message: 'error please send "/start" request again' };
            }

            const wallets = await this.walletmodel.find({telgramId: telegramId})

            if (wallets.length < 1) {
                if (!user) {
                    return { status: false, message: 'error please create atleat one account' };
                }
            }

            const network = process.env.NETWORK

            let walletDetail = []

            for (let i = 0; i < wallets.length; i++) {
                const wallet = wallets[i];

                const tokens = await TokenModel.find({accountId: wallet.accountId})

                if (tokens.length < 1) continue
                const near = await this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), wallet.accountId)

                // create a NEAR account object
                const senderAccount = await near.account(wallet.accountId);

                let tokenDetal = []
                for (let j = 0; j < tokens.length; j++) {
                    const token = tokens[j];
                    
                    const contract = new Contract(senderAccount, token.contractId, {
                        viewMethods: [],
                        changeMethods: [],
                        useLocalViewExecution: false
                    });

                    const accountBalance = await contract.account.viewFunction({
                        contractId: token.contractId,
                        methodName: "ft_balance_of",
                        args: {account_id: wallet.accountId}
                    })

                    const objTwo = {
                        decimal: token.tokenDecimal,
                        Symbol: token.tokenSymbol,
                        amount: accountBalance,
                        contractId: token.contractId
                    }
                    
                    tokenDetal.push(objTwo)
                }

                const obj = {
                    accountId: wallet.accountId,
                    tokens: tokenDetal
                }

                walletDetail.push(obj)
            }

            return { status: true, wallets: walletDetail };

        } catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

}

export default TelegramService;