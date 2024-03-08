
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
}