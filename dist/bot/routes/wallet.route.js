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
exports.useWalletBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../template/message");
const useWalletBotRoutes = ({ bot, telegramService }) => {
    bot.action('wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                    telegraf_1.Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                    telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('📩 Send', 'send-token-menu'),
                    telegraf_1.Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
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
    bot.action('create-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                    telegraf_1.Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                    telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('📩 Send', 'send-token-menu'),
                    telegraf_1.Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
                ],
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegramId = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDToken({ telegramId });
            if (!response.token)
                return ctx.reply(response.message, keyboard);
            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'createAccount' });
            console.log(urlHost);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp('Add New', urlHost),
                telegraf_1.Markup.button.callback('🔙 Back 🔄', 'wallet-menu'),
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on 'Add New' to create a new wallet"), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('wallet-balance-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to load wallets', keyboard);
            const telegramId = ctx.chat.id.toString();
            const response = yield telegramService.getWalletBalance({ telegramId });
            if (!response.walletDetail)
                return ctx.reply(response.message, keyboard);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback('🔙 Back 🔄', 'wallet-menu'),
            ]);
            ctx.reply(message_1.MessageTemplete.walletBalance(response.walletDetail), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('export-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
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
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'getPrivateKey', account: wallet.accountId });
                console.log(wallet.accountId, urlHost);
                const walletBtn = [
                    telegraf_1.Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn);
            });
            const backKey = [
                telegraf_1.Markup.button.callback('🔙 Back to wallet menu', 'wallet-menu')
            ];
            walletBtns.push(backKey);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard(walletBtns);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on any account you want to export"), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('export-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
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
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'getPrivateKey', account: wallet.accountId });
                console.log(wallet.accountId, urlHost);
                const walletBtn = [
                    telegraf_1.Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn);
            });
            const backKey = [
                telegraf_1.Markup.button.callback('🔙 Back to wallet menu', 'wallet-menu')
            ];
            walletBtns.push(backKey);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard(walletBtns);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on any account you want to export"), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('send-token-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
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
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'sendNearToken', account: wallet.accountId });
                console.log(wallet.accountId, urlHost);
                const walletBtn = [
                    telegraf_1.Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn);
            });
            const backKey = [
                telegraf_1.Markup.button.callback('🔙 Back to wallet menu', 'wallet-menu')
            ];
            walletBtns.push(backKey);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard(walletBtns);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on any account you want to transfer from"), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useWalletBotRoutes = useWalletBotRoutes;
const getUrlForDomainWallet = ({ token, type }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST;
    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}`;
    return url;
};
const getUrlForDomainWalletTwo = ({ token, type, account }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST;
    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}&account=${account}`;
    return url;
};
