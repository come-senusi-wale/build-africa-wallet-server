import { Telegraf, Markup } from 'telegraf';
import TelegramService from "../telegramService";
import { MessageTemplete } from "../../template/message";


export const useTokenBotRoutes = ({bot, telegramService} : {
    bot: Telegraf,
    telegramService: TelegramService
}) => {

    bot.action('trade-menu', async (ctx) => {
        try {
            const keyboard = Markup.inlineKeyboard([
                [   Markup.button.callback('➕ Token detail', 'token_detail-menu'),
                    Markup.button.callback('⬇️ Import token', 'import-token-menu')
                ],
                [   Markup.button.callback('📩 Send token', 'send-other-token-menu'),
                    Markup.button.callback('🗑️ Delete Token', 'remove-token-menu')
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

    bot.action('import-token-menu', async (ctx) => {
        try {
            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to trade menu', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();

            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboardError);

            const wallets = await telegramService.getAllWalletofAUser({telegramId})
            if (!wallets.wallets) return ctx.reply(response.message!, keyboardError);

            let walletBtns: any = []

            wallets.wallets.forEach((wallet) => {
                const urlHost = getUrlForDomainWalletTwo({ token: response.token, type: 'importToken', account: wallet.accountId});
                console.log(wallet.accountId,  urlHost)
                const walletBtn =  [
                    Markup.button.webApp(`${wallet.accountId}`, urlHost),
                ];
                walletBtns.push(walletBtn)
            })

            const backKey = [
                Markup.button.callback('🔙 Back to trade menu', 'trade-menu')
            ];

            walletBtns.push(backKey)

            const keyboardMild = Markup.inlineKeyboard(walletBtns)

            ctx.reply(MessageTemplete.defaultMessage("Click on any account you want to import token to"), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('token_detail-menu', async (ctx) => {
        try {
            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to trade menu', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();

            const response = await telegramService.getTokenBalanceOFWallet({telegramId});
            if (!response.wallets) return ctx.reply(response.message!, keyboardError);

        
            const keyboardMild = Markup.inlineKeyboard([
                Markup.button.callback('🔙 Back 🔄', 'trade-menu'),
            ]);

            ctx.reply(MessageTemplete.tokenBalance(response.wallets), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('send-other-token-menu', async (ctx) => {
        try {
            const keyboardError = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back to trade menu', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboardError);

            const telegramId = ctx.chat.id.toString();

            const response = await telegramService.generateUserIDToken({telegramId});
            if (!response.token) return ctx.reply(response.message!, keyboardError);

            const wallets = await telegramService.getTokenBalanceOFWallet({telegramId});
            if (!wallets.wallets) return ctx.reply(wallets.message!, keyboardError);

            let walletBtns: any = []

            wallets.wallets.forEach((wallet) => {
                wallet.tokens.forEach((token) => {
                    const urlHost = getUrlForDomainWallet({ token: response.token, type: 'sendOtherToken', account: wallet.accountId, contractId: token.contractId});
                    console.log(wallet.accountId, urlHost)
                    const walletBtn =  [
                        Markup.button.webApp(`${wallet.accountId}  =>  ${token.Symbol}`, urlHost),
                    ];
                    walletBtns.push(walletBtn)
                })
            })

            const backKey = [
                Markup.button.callback('🔙 Back 🔄', 'trade-menu')
            ];

            walletBtns.push(backKey)

            const keyboardMild = Markup.inlineKeyboard(walletBtns)

            ctx.reply(MessageTemplete.defaultMessage('click on account you want to transfer token from'), keyboardMild);
        } catch (err) {
            console.log(err)
        }
    });

}

type UrlTypeWallet = 'importToken' | 'sendOtherToken';

const getUrlForDomainWallet = ({ token, type, account, contractId}:{ token: string, type: UrlTypeWallet, account: string, contractId: string}) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST

    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}&account=${account}&contractId=${contractId}`;
    return url;
}

const getUrlForDomainWalletTwo = ({ token, type, account }:{ token: string, type: UrlTypeWallet, account: string }) => {
    const INTEGRATION_WEB_HOST = process.env.INTEGRATION_WEB_HOST

    const url = `${INTEGRATION_WEB_HOST}/integration/${type}?token=${token}&account=${account}`;
    return url;
}