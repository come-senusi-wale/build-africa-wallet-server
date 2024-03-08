import UserRegModel from "../database/model/userReg.model";
import WalletModel from "../database/model/wallet.model";
import EncryptionRepository from "../config/encryption.config";
import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";

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

    private nearConnet = async(network: any) => {
        return await connect({
            networkId: `${network}`, // Or 'mainnet'
            nodeUrl: `https://rpc.${network}.near.org`, 
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
            helperUrl: `https://helper.${network}.near.org`,
        })
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

}

export default TelegramService;