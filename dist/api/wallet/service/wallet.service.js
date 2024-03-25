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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const near_api_js_1 = require("near-api-js");
const userReg_model_1 = __importDefault(require("../../../database/model/userReg.model"));
const wallet_model_1 = __importDefault(require("../../../database/model/wallet.model"));
const encryption_config_1 = require("../../../config/encryption.config");
class WalletService {
    constructor({ nearConfig, encryption }) {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.nearConnet = (network) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, near_api_js_1.connect)({
                networkId: `${network}`, // Or 'mainnet'
                nodeUrl: `https://rpc.${network}.near.org `,
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
        //check if account is available
        this.checkAcount = ({ accountId }) => __awaiter(this, void 0, void 0, function* () {
            const network = process.env.NETWORK;
            const near = yield this.nearConnet(network);
            try {
                yield (yield near.account(accountId)).state();
                return { errors: [{ message: `${accountId} already taken` }] };
            }
            catch (error) {
                try {
                    return { status: true, data: { message: `${accountId} is avialble` } };
                }
                catch (error) {
                    return { errors: [{ message: 'unable to get account' }] };
                }
            }
        });
        //check if account is valid
        this.checkIfAcountIsCorrect = ({ accountId }) => __awaiter(this, void 0, void 0, function* () {
            const network = process.env.NETWORK;
            const near = yield this.nearConnet(network);
            try {
                yield (yield near.account(accountId)).state();
                return { status: true, data: { message: `${accountId} is valid` } };
            }
            catch (error) {
                try {
                    return { errors: [{ message: 'invalid account ID' }] };
                }
                catch (error) {
                    return { errors: [{ message: 'invalid account ID' }] };
                }
            }
        });
        // get account near token balance
        this.getAccountNearBalance = ({ accountId }) => __awaiter(this, void 0, void 0, function* () {
            const network = process.env.NETWORK;
            const near = yield this.nearConnet(network);
            try {
                const account = yield near.account(accountId);
                const balance = (yield account.getAccountBalance()).available;
                const availableBalance = parseInt(balance) / Math.pow(10, 24);
                return { status: true, data: { balance: availableBalance.toFixed(5) } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to get balance' }] };
            }
        });
        // create Account
        this.createAccount = ({ accountId, token }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryption.decryptToken(token, encryption_config_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegramId))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield userReg_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const network = process.env.NETWORK;
            const near = yield this.nearConnet(network);
            const keyPair = near_api_js_1.KeyPair.fromRandom('ed25519');
            try {
                const state = yield (yield near.account(accountId)).state();
                return { errors: [{ message: 'account already taken' }] };
            }
            catch (error) {
                try {
                    const publicKeyString = keyPair.getPublicKey().toString();
                    const publicKeyData = keyPair.getPublicKey().data.toString();
                    const publicKeyHex = Buffer.from(keyPair.getPublicKey().data).toString('hex');
                    const publicKeyBase64 = Buffer.from(keyPair.getPublicKey().data).toString('base64');
                    yield near.createAccount(accountId, keyPair.getPublicKey());
                    const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
                    yield keyStore.setKey('testnet', accountId, keyPair);
                    const signer = new near_api_js_1.InMemorySigner(keyStore);
                    const mnemonic = yield signer.keyStore.getKey(near.connection.networkId, accountId).finally();
                    // Retrieve the private key
                    const privateKey = keyPair.toString().split(':')[1];
                    const newWallet = new wallet_model_1.default({
                        telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId,
                        accountId,
                        privateKey: this.encryptToken(privateKey),
                        publicKeyString,
                        publicKeyData,
                        publicKeyHex,
                        publicKeyBase64
                    });
                    yield newWallet.save();
                    return { status: true, data: { accountId } };
                }
                catch (error) {
                    return { errors: [{ message: 'unable to create account' }] };
                }
            }
        });
        // export Account
        this.exportAccount = ({ accountId, token, password }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this._encryption.decryptToken(token, encryption_config_1.TokenType.accessToken);
                if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegramId))
                    return { errors: [{ message: 'Invalid request' }] };
                const user = yield userReg_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId });
                if (!user)
                    return { errors: [{ message: 'user not found' }] };
                if (!user.emailVerification)
                    return { errors: [{ message: 'email not verified' }] };
                const comparePassword = this._encryption.comparePassword(password, user.password);
                if (!comparePassword)
                    return { errors: [{ message: 'incorrect password' }] };
                const wallet = yield wallet_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId, accountId: accountId });
                if (!wallet)
                    return { errors: [{ message: 'unable to get account' }] };
                return { status: true, data: { privateKey: this.decryptToken(wallet.privateKey) } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to get Account' }] };
            }
        });
        // send near token 
        this.sendNearToken = ({ accountId, token, to, amount }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this._encryption.decryptToken(token, encryption_config_1.TokenType.accessToken);
                if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegramId))
                    return { errors: [{ message: 'Invalid request' }] };
                const user = yield userReg_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId });
                if (!user)
                    return { errors: [{ message: 'user not found' }] };
                if (!user.verified)
                    return { errors: [{ message: 'account not verified' }] };
                if (!user.emailVerification)
                    return { errors: [{ message: 'email not verified' }] };
                const wallet = yield wallet_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId, accountId: accountId });
                if (!wallet)
                    return { errors: [{ message: 'unable to get account' }] };
                const network = process.env.NETWORK;
                const near = yield this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId);
                // create a NEAR account object
                const senderAccount = yield near.account(accountId);
                const amountINYocNear = near_api_js_1.utils.format.parseNearAmount(amount.toString());
                const result = yield senderAccount.sendMoney(to, amountINYocNear);
                return { status: true, data: { transactionHash: result.transaction.hash } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to parform transaction' }] };
            }
        });
        this._nearConfig = nearConfig;
        this._encryption = encryption;
    }
}
exports.default = WalletService;
