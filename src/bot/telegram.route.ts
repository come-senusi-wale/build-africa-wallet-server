import { Telegraf, Markup } from 'telegraf';
import TelegramService from "./telegramService";
import UserRegModel from "../database/model/userReg.model";
import WalletModel from "../database/model/wallet.model";
import { useWalletBotRoutes } from "./routes/wallet.route";
import EncryptionRepository from "../config/encryption.config";
import { useRegistrationBotRoutes } from "./routes/registration.route";

export const useTelegramBot = () => {
    const YOUR_BOT_TOKEN = process.env.BOT_TOKEN!;
    const bot = new Telegraf(YOUR_BOT_TOKEN);

    const encryptionRepository = new EncryptionRepository()
    const telegramService = new TelegramService({userRegModel: UserRegModel, walletmodel: WalletModel, encryptionRepository})

    bot.start(async (ctx) => {
        // try {ctx.deleteMessage()} catch {}
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [   Markup.button.callback('✅ verification', 'verification'),
                Markup.button.callback('🔐 authetication', 'earn-menu')],
            [
                Markup.button.callback('🔧 Settings & tools', 'setting-menu'),
            ],
        ]);

        if (!ctx.chat) return;
        const telgramId = ctx.chat.id.toString();

        await telegramService.userOpenChart({telgramId})

        const text = "Enhance your cryptocurrency trading experience with OLABOT – the ultimate Telegram bot for traders.";
        ctx.reply(text, { ...keyboard, disable_web_page_preview: true });
    });

    bot.action('menu', async (ctx) => {
       // try {ctx.deleteMessage()} catch {}
       const keyboard = Markup.inlineKeyboard([
        [   Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
            Markup.button.callback('💹 Start trading', 'trade-menu'),
        ],
        [   Markup.button.callback('✅ verification', 'verification'),
            Markup.button.callback('🔐 authetication', 'earn-menu')],
        [
            Markup.button.callback('🔧 Settings & tools', 'setting-menu'),
        ],
        ]);

        if (!ctx.chat) return;
        const telgramId = ctx.chat.id.toString();

        await telegramService.userOpenChart({telgramId})

        const text = "Enhance your cryptocurrency trading experience with OLABOT – the ultimate Telegram bot for traders.";
        ctx.reply(text, { ...keyboard, disable_web_page_preview: true });
    });

    useWalletBotRoutes({bot, telegramService})
    useRegistrationBotRoutes({bot, telegramService})

    bot.launch();

}