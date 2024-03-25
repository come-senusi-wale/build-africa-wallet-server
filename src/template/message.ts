
export class MessageTemplete {
    static defaultMessage = (message: string) => (
        "══════[ 💎 BUIDLAFRICABot 💎 ]══════\n"+
        `${message}\n`+
        "_______________________________________________\n"
    )

    static walletBalance = (wallets: any) => {
        let res = "══════[ 💎 BUIDLAFRICABot 💎 ]══════\n";

        for (let i = 0; i < wallets.length; i++) {
            const element = wallets[i];
            res += `${element.wallet} => ${element.amount}\n`; 
        }

        res += "_______________________________________________\n";

        return res
       
    }

    static tokenBalance = (wallets: any) => {
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

        return res
       
    }
}