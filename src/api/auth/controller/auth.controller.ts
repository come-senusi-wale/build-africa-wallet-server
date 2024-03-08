import IResponse from "../../../type/response/response";
import AuthService from "../service/auth.service";
import { Request, Response } from "express";
import { htmlEmailResponse } from "../../../template/emailVerifcationResTemplate";

class AuthController {
    private _authService: AuthService

    constructor({ authService} : { authService : AuthService}) {
        this._authService = authService;
    }

    //sign up with email password
    signup = async (
        { body }: { body: any },
        res: Response
    ) => {
        const response = await this._authService.registraion(body);
        if (response?.errors) return res
            .status(401)
            .json({ error: response.errors, status: false });

        res.json({ data: response, status: true });
    }

    emailVerifcation = async (
        { query }: { query: any },
        res: Response
    ) => {
        const response = await this._authService.emailVerifaction(query);
        if (response?.errors) return res
            .status(401)
            .json({ error: response.errors, status: false });

        res.send(htmlEmailResponse);
    }
}

export default AuthController;