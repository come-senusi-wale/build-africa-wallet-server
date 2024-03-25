"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_model_1 = __importDefault(require("../database/model/token.model"));
const near_api_js_1 = require("near-api-js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TelegramService {
    constructor({ userRegModel, walletmodel, encryptionRepository }) {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.nearConnet = (network) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, near_api_js_1.connect)({
                networkId: `${network}`, // Or 'mainnet'
                nodeUrl: `https://rpc.${network}.near.org`,
                deps: { keyStore: new near_api_js_1.keyStores.InMemoryKeyStore() },
                helperUrl: `https://helper.${network}.near.org`,
            });
        });
        this.nearPrivateKeyConnet = (network, privateKey, sender) => __awaiter(this, void 0, void 0, function* () {
            // sets up an empty keyStore object in memory using near-api-js
            const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
            // creates a keyPair from the private key provided in your .env file
            const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
            // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
            yield keyStore.setKey(network, sender, keyPair);
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
            return yield (0, near_api_js_1.connect)(config);
        });
        this.userOpenChart = ({ telgramId }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRegModel.findOne({ telgramId });
            if (!user) {
                const newUser = new this.userRegModel({
                    telgramId
                });
                yield newUser.save();
            }
        });
        this.generateUserIDToken = ({ telegramId, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRegModel.findOne({ telgramId: telegramId });
                if (!user) {
                    return { status: false, message: 'error please send "/start" request again' };
                }
                const token = this.encryptionRepository.encryptToken({ telegramId });
                return { status: true, token };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.getWalletBalance = ({ telegramId, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRegModel.findOne({ telgramId: telegramId });
                console.log('user', user);
                if (!user) {
                    return { status: false, message: 'error please send "/start" request again' };
                }
                const wallets = yield this.walletmodel.find({ telgramId: telegramId });
                let walletDetail = [];
                const network = process.env.NETWORK;
                const near = yield this.nearConnet(network);
                for (let i = 0; i < wallets.length; i++) {
                    const element = wallets[i];
                    const account = yield near.account(element.accountId);
                    const balance = (yield account.getAccountBalance()).available;
                    const availableBalance = parseInt(balance) / Math.pow(10, 24);
                    const obj = {
                        wallet: element.accountId,
                        amount: availableBalance.toFixed(5)
                    };
                    walletDetail.push(obj);
                }
                return { status: true, walletDetail };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.getAllWalletofAUser = ({ telegramId, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRegModel.findOne({ telgramId: telegramId });
                console.log('user', user);
                if (!user) {
                    return { status: false, message: 'error please send "/start" request again' };
                }
                const wallets = yield this.walletmodel.find({ telgramId: telegramId });
                if (wallets.length < 1) {
                    if (!user) {
                        return { status: false, message: 'error please create atleat one account' };
                    }
                }
                return { status: true, wallets };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.getTokenBalanceOFWallet = ({ telegramId, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRegModel.findOne({ telgramId: telegramId });
                console.log('user', user);
                if (!user) {
                    return { status: false, message: 'error please send "/start" request again' };
                }
                const wallets = yield this.walletmodel.find({ telgramId: telegramId });
                if (wallets.length < 1) {
                    if (!user) {
                        return { status: false, message: 'error please create atleat one account' };
                    }
                }
                const network = process.env.NETWORK;
                let walletDetail = [];
                for (let i = 0; i < wallets.length; i++) {
                    const wallet = wallets[i];
                    const tokens = yield token_model_1.default.find({ accountId: wallet.accountId });
                    if (tokens.length < 1)
                        continue;
                    const near = yield this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), wallet.accountId);
                    // create a NEAR account object
                    const senderAccount = yield near.account(wallet.accountId);
                    let tokenDetal = [];
                    for (let j = 0; j < tokens.length; j++) {
                        const token = tokens[j];
                        const contract = new near_api_js_1.Contract(senderAccount, token.contractId, {
                            viewMethods: [],
                            changeMethods: [],
                            useLocalViewExecution: false
                        });
                        const accountBalance = yield contract.account.viewFunction({
                            contractId: token.contractId,
                            methodName: "ft_balance_of",
                            args: { account_id: wallet.accountId }
                        });
                        const objTwo = {
                            decimal: token.tokenDecimal,
                            Symbol: token.tokenSymbol,
                            amount: accountBalance,
                            contractId: token.contractId
                        };
                        tokenDetal.push(objTwo);
                    }
                    const obj = {
                        accountId: wallet.accountId,
                        tokens: tokenDetal
                    };
                    walletDetail.push(obj);
                }
                return { status: true, wallets: walletDetail };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.userRegModel = userRegModel;
        this.encryptionRepository = encryptionRepository;
        this.walletmodel = walletmodel;
    }
}
exports.default = TelegramService;
