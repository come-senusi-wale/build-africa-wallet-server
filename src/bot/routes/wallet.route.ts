import { Telegraf, Markup } from 'telegraf';
import TelegramService from "../telegramService";
import { MessageTemplete } from "../../template/message";
import { Console } from 'console';


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
                [   Markup.button.callback('📩 Send', 'send-token-menu'),
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
                [   Markup.button.callback('📩 Send', 'send-token-menu'),
                    Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
                ],
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

            const telegramId = ctx.chat.id.toString();
            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboard);

            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'createAccount'});
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

    bot.action('export-wallet-menu', async (ctx) => {
        try {
            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();

            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboardError);

            const wallets = await telegramService.getAllWalletofAUser({telegramId})
            if (!wallets.wallets) return ctx.reply(response.message!, keyboardError);

            let walletBtns: any = []

            wallets.wallets.forEach((wallet) => {
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'getPrivateKey', account: wallet.accountId});
                console.log(wallet.accountId, urlHost)
                const walletBtn =  [
                    Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn)
            })

            const backKey = [
                Markup.button.callback('🔙 Back to wallet menu', 'wallet-menu')
            ];

            walletBtns.push(backKey)

            const keyboardMild = Markup.inlineKeyboard(walletBtns)

            ctx.reply(MessageTemplete.defaultMessage("Click on any account you want to export"), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('export-wallet-menu', async (ctx) => {
        try {
            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();

            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboardError);

            const wallets = await telegramService.getAllWalletofAUser({telegramId})
            if (!wallets.wallets) return ctx.reply(response.message!, keyboardError);

            let walletBtns: any = []

            wallets.wallets.forEach((wallet) => {
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'getPrivateKey', account: wallet.accountId});
                console.log(wallet.accountId, urlHost)
                const walletBtn =  [
                    Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn)
            })

            const backKey = [
                Markup.button.callback('🔙 Back to wallet menu', 'wallet-menu')
            ];

            walletBtns.push(backKey)

            const keyboardMild = Markup.inlineKeyboard(walletBtns)

            ctx.reply(MessageTemplete.defaultMessage("Click on any account you want to export"), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('send-token-menu', async (ctx) => {
        try {
            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();

            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboardError);

            const wallets = await telegramService.getAllWalletofAUser({telegramId})
            if (!wallets.wallets) return ctx.reply(response.message!, keyboardError);

            let walletBtns: any = []

            wallets.wallets.forEach((wallet) => {
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'sendNearToken', account: wallet.accountId});
                console.log(wallet.accountId, urlHost)
                const walletBtn =  [
                    Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn)
            })

            const backKey = [
                Markup.button.callback('🔙 Back to wallet menu', 'wallet-menu')
            ];

            walletBtns.push(backKey)

            const keyboardMild = Markup.inlineKeyboard(walletBtns)

            ctx.reply(MessageTemplete.defaultMessage("Click on any account you want to transfer from"), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });
    
}

type UrlTypeWallet = 'createAccount' | 'getPrivateKey' | 'transfer_token' | 'sendNearToken';

const getUrlForDomainWallet = ({ token, type }:{ token: string, type: UrlTypeWallet }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST

    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}`;
    return url;
}

const getUrlForDomainWalletTwo = ({ token, type, account }:{ token: string, type: UrlTypeWallet, account: string }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST

    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}&account=${account}`;
    return url;
}