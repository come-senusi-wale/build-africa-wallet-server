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
exports.useRegistrationBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../template/message");
const useRegistrationBotRoutes = ({ bot, telegramService }) => {
    bot.action('verification', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboardError);
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('➕ Email Auth', 'email-auth'),
                    telegraf_1.Markup.button.callback('⬇️ change password', 'change-password')
                ],
                [telegraf_1.Markup.button.callback('📤 KYC', 'kyc-verification'),
                    telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);
            const telgramId = ctx.chat.id.toString();
            const response = yield telegramService.userOpenChart({ telgramId });
            const text = "Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances";
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('email-auth', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboardError = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back to verification', 'verification')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboardError);
            const telegramId = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDToken({ telegramId });
            if (!response.token)
                return ctx.reply(response.message, keyboardError);
            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'signup' });
            console.log(urlHost);
            const keyboardMild = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp('Add Email', urlHost),
                telegraf_1.Markup.button.callback('🔙 Back 🔄', 'verification'),
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on 'Add email' to verified email"), keyboardMild);
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useRegistrationBotRoutes = useRegistrationBotRoutes;
const getUrlForDomainWallet = ({ token, type }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST;
    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}`;
    return url;
};
