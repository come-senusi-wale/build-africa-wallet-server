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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTokenBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../template/message");
const useTokenBotRoutes = ({ bot, telegramService }) => {
    bot.action('trade-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('➕ Token detail', 'token_detail-menu'),
                    telegraf_1.Markup.button.callback('⬇️ Import token', 'import-token-menu')
                ],
                [telegraf_1.Markup.button.callback('📩 Send token', 'send-other-token-menu'),
                    telegraf_1.Markup.button.callback('🗑️ Delete Token', 'remove-token-menu')
                ],
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telgramId = ctx.chat.id.toString();
            const response = yield telegramService.userOpenChart({ telgramId });
            const text = "Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances";
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('import-token-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to trade menu', 'trade-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboardError);
            const telegramId = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDToken({ telegramId });
            if (!response.token)
                return ctx.reply(response.message, keyboardError);
            const wallets = yield telegramService.getAllWalletofAUser({ telegramId });
            if (!wallets.wallets)
                return ctx.reply(response.message, keyboardError);
            let walletBtns = [];
            wallets.wallets.forEach((wallet) => {
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'importToken', account: wallet.accountId });
                console.log(wallet.accountId, urlHost);
                const walletBtn = [
                    telegraf_1.Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn);
            });
            const backKey = [
                telegraf_1.Markup.button.callback('🔙 Back to trade menu', 'trade-menu')
            ];
            walletBtns.push(backKey);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard(walletBtns);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on any account you want to import token to"), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('token_detail-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to trade menu', 'trade-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboardError);
            const telegramId = ctx.chat.id.toString();
            const response = yield telegramService.getTokenBalanceOFWallet({ telegramId });
            if (!response.wallets)
                return ctx.reply(response.message, keyboardError);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback('🔙 Back 🔄', 'trade-menu'),
            ]);
            ctx.reply(message_1.MessageTemplete.tokenBalance(response.wallets), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('send-other-token-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to trade menu', 'trade-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboardError);
            const telegramId = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDToken({ telegramId });
            if (!response.token)
                return ctx.reply(response.message, keyboardError);
            const wallets = yield telegramService.getTokenBalanceOFWallet({ telegramId });
            if (!wallets.wallets)
                return ctx.reply(wallets.message, keyboardError);
            let walletBtns = [];
            wallets.wallets.forEach((wallet) => {
                wallet.tokens.forEach((token) => {
                    const urlHost = getUrlForDomainWallet({ token: response.token, type: 'sendOtherToken', account: wallet.accountId, contractId: token.contractId });
                    console.log(wallet.accountId, urlHost);
                    const walletBtn = [
                        telegraf_1.Markup.button.webApp(`${wallet.accountId}  =>  ${token.Symbol}`, urlHost),
                    ];
                    walletBtns.push(walletBtn);
                });
            });
            const backKey = [
                telegraf_1.Markup.button.callback('🔙 Back 🔄', 'trade-menu')
            ];
            walletBtns.push(backKey);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard(walletBtns);
            ctx.reply(message_1.MessageTemplete.defaultMessage('click on account you want to transfer token from'), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useTokenBotRoutes = useTokenBotRoutes;
const getUrlForDomainWallet = ({ token, type, account, contractId }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST;
    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}&account=${account}&contractId=${contractId}`;
    return url;
};
const getUrlForDomainWalletTwo = ({ token, type, account }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST;
    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}&account=${account}`;
    return url;
};
