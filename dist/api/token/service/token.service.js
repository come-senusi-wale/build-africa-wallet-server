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
const token_model_1 = __importDefault(require("../../../database/model/token.model"));
const encryption_config_1 = require("../../../config/encryption.config");
class TokenService {
    constructor({ encryption }) {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
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
        this.tokenInfo = ({ contractId, accountId, token }) => __awaiter(this, void 0, void 0, function* () {
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
                const contract = new near_api_js_1.Contract(senderAccount, contractId, {
                    viewMethods: [],
                    changeMethods: [],
                    useLocalViewExecution: false
                });
                const tokenMetadata = yield contract.account.viewFunction({
                    contractId,
                    methodName: "ft_metadata",
                });
                const accountBalance = yield contract.account.viewFunction({
                    contractId,
                    methodName: "ft_balance_of",
                    args: { account_id: accountId }
                });
                return { status: true, data: { accountBalance, tokenMetadata } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to get token info' }] };
            }
        });
        this.storeToken = ({ contractId, accountId, token }) => __awaiter(this, void 0, void 0, function* () {
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
                const checkToken = yield token_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId, contractId, accountId });
                if (checkToken)
                    return { errors: [{ message: 'token already imported' }] };
                const network = process.env.NETWORK;
                const near = yield this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId);
                // create a NEAR account object
                const senderAccount = yield near.account(accountId);
                const contract = new near_api_js_1.Contract(senderAccount, contractId, {
                    viewMethods: [],
                    changeMethods: [],
                    useLocalViewExecution: false
                });
                const tokenMetadata = yield contract.account.viewFunction({
                    contractId,
                    methodName: "ft_metadata",
                });
                const newToken = new token_model_1.default({
                    telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId,
                    accountId,
                    contractId,
                    tokenName: tokenMetadata.name,
                    tokenSymbol: tokenMetadata.symbol,
                    tokenDecimal: tokenMetadata.decimals,
                    tokenImg: tokenMetadata.icon
                });
                yield newToken.save();
                return { status: true, data: { tokenMetadata } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to parform transaction' }] };
            }
        });
        this.sentToken = ({ contractId, accountId, token, amount, recieverId }) => __awaiter(this, void 0, void 0, function* () {
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
                const checkToken = yield token_model_1.default.findOne({ telgramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId, contractId, accountId });
                if (!checkToken)
                    return { errors: [{ message: 'token not imported' }] };
                const network = process.env.NETWORK;
                const near = yield this.nearPrivateKeyConnet(network, this.decryptToken(wallet.privateKey), accountId);
                // create a NEAR account object
                const senderAccount = yield near.account(accountId);
                const contract = new near_api_js_1.Contract(senderAccount, contractId, {
                    viewMethods: [],
                    changeMethods: [],
                    useLocalViewExecution: false
                });
                const accountBalance = yield contract.account.viewFunction({
                    contractId,
                    methodName: "ft_balance_of",
                    args: { account_id: accountId }
                });
                const amountInYoc = near_api_js_1.utils.format.parseNearAmount(amount.toString());
                if (amountInYoc > accountBalance)
                    return { errors: [{ message: 'insufficient balance' }] };
                const sendToken = yield contract.account.functionCall({
                    contractId: contractId,
                    methodName: 'ft_transfer',
                    args: { receiver_id: recieverId, amount: amountInYoc },
                    attachedDeposit: near_api_js_1.utils.format.parseNearAmount("0.000000000000000000000001")
                });
                return { status: true, data: { sendToken } };
            }
            catch (error) {
                return { errors: [{ message: 'unable to parform transaction' }] };
            }
        });
        this._encryption = encryption;
    }
}
exports.default = TokenService;
