import { Telegraf, Markup } from 'telegraf';
import TelegramService from "../telegramService";
import { MessageTemplete } from "../../template/message";


const INTEGRATION_WEB_HOST = 'https://wallet-bot-ui.vercel.app/';

export const useWalletBotRoutes = ({bot, telegramService} : {
    bot: Telegraf,
    telegramService: TelegramService
}) => {

    bot.action('wallet-menu', async (ctx) => {
        try {
            const keyboard = Markup.inlineKeyboard([
                [   Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                    Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
                ],
                [   Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                    Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [   Markup.button.callback('Transfer', 'send-token-menu'),
                    Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
                ],
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

            const telgramId = ctx.chat.id.toString();
            const response = await telegramService.userOpenChart({telgramId})

            const text =  "Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances";

            ctx.reply(text, { ...keyboard, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('create-wallet-menu', async (ctx) => {
        try {
            const keyboard = Markup.inlineKeyboard([
                [   Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                    Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
                ],
                [   Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                    Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [   Markup.button.callback('Transfer', 'send-token-menu'),
                    Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
                ],
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

            const telegramId = ctx.chat.id.toString();
            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboard);

            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'add_new_wallet'});
            console.log(urlHost)

            const keyboardMild = Markup.inlineKeyboard([
                Markup.button.webApp('Add New', urlHost),
                Markup.button.callback('🔙 Back 🔄', 'wallet-menu'),
            ]);

            ctx.reply(MessageTemplete.defaultMessage("Click on 'Add New' to create a new wallet"), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });


    bot.action('wallet-balance-menu', async (ctx) => {
        try {
            const keyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to load wallets', keyboard);

            const telegramId = ctx.chat.id.toString();
            console.log('telegramid', telegramId)
            const response = await telegramService.getWalletBalance({telegramId});
            if (!response.walletDetail) return ctx.reply(response.message!, keyboard);

            const keyboardMild = Markup.inlineKeyboard([
                Markup.button.callback('🔙 Back 🔄', 'wallet-menu'),
            ]);

            ctx.reply(MessageTemplete.walletBalance(response.walletDetail), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });
    
}

type UrlTypeWallet = 'add_new_wallet' | 'import_wallet' | 'transfer_token' | 'transfer_etherium';

const getUrlForDomainWallet = ({ token, type }:{ token: string, type: UrlTypeWallet }) => {
    const url = `${INTEGRATION_WEB_HOST}/integration/createAccount?token=${token}`;
    return url;
}