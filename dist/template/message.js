"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTemplete = void 0;
class MessageTemplete {
}
exports.MessageTemplete = MessageTemplete;
MessageTemplete.defaultMessage = (message) => ("══════[ 💎 BUIDLAFRICABot 💎 ]══════\n" +
    `${message}\n` +
    "_______________________________________________\n");
MessageTemplete.walletBalance = (wallets) => {
    let res = "══════[ 💎 BUIDLAFRICABot 💎 ]══════\n";
    for (let i = 0; i < wallets.length; i++) {
        const element = wallets[i];
        res += `${element.wallet} => ${element.amount}\n`;
    }
    res += "_______________________________________________\n";
    return res;
};
MessageTemplete.tokenBalance = (wallets) => {
    let res = "══════[ 💎 BUIDLAFRICABot 💎 ]══════\n";
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i];
        res += `account => ${wallet.accountId}\n`;
        res += `Tokens________\n`;
        for (let j = 0; j < wallet.tokens.length; j++) {
            const token = wallet.tokens[j];
            res += `${token.Symbol} => ${token.amount}\n`;
        }
    }
    res += "_______________________________________________\n";
    return res;
};
