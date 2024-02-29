import IResponse from "../../../type/response/response";
import WalletService from "../service/wallet.service";
import { Request, Response } from "express";


class WalletController {
    private _walletService: WalletService

    constructor({ walletService} : { walletService : WalletService}) {
        this._walletService = walletService;
    }

    //check account Controller
    checkAccount = async (
        { body }: { body: any },
        res: Response
    ) => {
        const response = await this._walletService.checkAcount(body);
        if (response?.errors) return res
            .status(401)
            .json({ error: response.errors, status: false });

        res.json({ data: response, status: true });
    }


    createAccount = async (
        { body }: { body: any },
        res: Response
    )  => {
        const response = await this._walletService.createAccount(body);
        if (response?.errors) return res
            .status(401)
            .json({ error: response.errors, status: false });

        res.json({ data: response, status: true });
    };
}

export default WalletController;