import IResponse from "../../../type/response/response";
import TokenService from "../service/token.service";
import { Request, Response } from "express";


class WalletController {
    private _tokenService: TokenService

    constructor({ tokenService} : { tokenService : TokenService}) {
        this._tokenService = tokenService;
    }

    tokenInfo = async (
        { body }: { body: any },
        res: Response
    )  => {
        const response = await this._tokenService.tokenInfo(body);
        if (response?.errors) return res
            .status(401)
            .json({ error: response.errors, status: false });

        res.json({ data: response, status: true });
    };

    storeToken = async (
        { body }: { body: any },
        res: Response
    )  => {
        const response = await this._tokenService.storeToken(body);
        if (response?.errors) return res
            .status(401)
            .json({ error: response.errors, status: false });

        res.json({ data: response, status: true });
    };
}

export default WalletController;
