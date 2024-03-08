import { Telegraf, Markup } from 'telegraf';
import TelegramService from "../telegramService";
import { MessageTemplete } from "../../template/message";


export const useRegistrationBotRoutes = ({bot, telegramService} : {
    bot: Telegraf,
    telegramService: TelegramService
}) => {

    bot.action('verification', async (ctx) => {
        try {

            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const keyboard = Markup.inlineKeyboard([
                [   Markup.button.callback('➕ Email Auth', 'email-auth'),
                    Markup.button.callback('⬇️ change password', 'change-password')
                ],
                [   Markup.button.callback('📤 KYC', 'kyc-verification'),
                    Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            const telgramId = ctx.chat.id.toString();
            const response = await telegramService.userOpenChart({telgramId})

            const text =  "Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances";

            ctx.reply(text, { ...keyboard, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });


    bot.action('email-auth', async (ctx) => {
        try {

            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to verification', 'verification')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();
            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboardError);

            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'signup'});
            console.log(urlHost)

            const keyboardMild = Markup.inlineKeyboard([
                Markup.button.webApp('Add Email', urlHost),
                Markup.button.callback('🔙 Back 🔄', 'verification'),
            ]);
            
            ctx.reply(MessageTemplete.defaultMessage("Click on 'Add email' to verified email"), keyboardMild);

        } catch (err) {
            console.log(err)
        }
    });
    
}

type UrlTypeWallet = 'signup' | 'import_wallet' | 'transfer_token' | 'transfer_etherium';

const getUrlForDomainWallet = ({ token, type }:{ token: string, type: UrlTypeWallet }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST
    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}`;
    return url;
}