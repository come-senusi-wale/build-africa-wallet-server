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
exports.useTelegramBot = void 0;
const telegraf_1 = require("telegraf");
const telegramService_1 = __importDefault(require("./telegramService"));
const userReg_model_1 = __importDefault(require("../database/model/userReg.model"));
const wallet_model_1 = __importDefault(require("../database/model/wallet.model"));
const wallet_route_1 = require("./routes/wallet.route");
const encryption_config_1 = __importDefault(require("../config/encryption.config"));
const registration_route_1 = require("./routes/registration.route");
const token_route_1 = require("./routes/token.route");
const useTelegramBot = () => {
    const YOUR_BOT_TOKEN = process.env.BOT_TOKEN;
    const bot = new telegraf_1.Telegraf(YOUR_BOT_TOKEN);
    const encryptionRepository = new encryption_config_1.default();
    const telegramService = new telegramService_1.default({ userRegModel: userReg_model_1.default, walletmodel: wallet_model_1.default, encryptionRepository });
    bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        // try {ctx.deleteMessage()} catch {}
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                telegraf_1.Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [telegraf_1.Markup.button.callback('✅ verification', 'verification'),
                telegraf_1.Markup.button.callback('🔐 authetication', 'earn-menu')],
            [
                telegraf_1.Markup.button.callback('🔧 Settings & tools', 'setting-menu'),
            ],
        ]);
        if (!ctx.chat)
            return;
        const telgramId = ctx.chat.id.toString();
        yield telegramService.userOpenChart({ telgramId });
        const text = "Enhance your cryptocurrency trading experience with OLABOT – the ultimate Telegram bot for traders.";
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { disable_web_page_preview: true }));
    }));
    bot.action('menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        // try {ctx.deleteMessage()} catch {}
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                telegraf_1.Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [telegraf_1.Markup.button.callback('✅ verification', 'verification'),
                telegraf_1.Markup.button.callback('🔐 authetication', 'earn-menu')],
            [
                telegraf_1.Markup.button.callback('🔧 Settings & tools', 'setting-menu'),
            ],
        ]);
        if (!ctx.chat)
            return;
        const telgramId = ctx.chat.id.toString();
        yield telegramService.userOpenChart({ telgramId });
        const text = "Enhance your cryptocurrency trading experience with OLABOT – the ultimate Telegram bot for traders.";
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { disable_web_page_preview: true }));
    }));
    (0, wallet_route_1.useWalletBotRoutes)({ bot, telegramService });
    (0, registration_route_1.useRegistrationBotRoutes)({ bot, telegramService });
    (0, token_route_1.useTokenBotRoutes)({ bot, telegramService });
    bot.launch();
};
exports.useTelegramBot = useTelegramBot;
