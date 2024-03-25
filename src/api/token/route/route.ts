import express from "express";
const router = express.Router();
import TokenController from "../controller/token.controller";
import TokenService from "../service/token.service";
import Encryption from "../../../config/encryption.config";


const encryption = new Encryption()

const tokenService = new TokenService({ encryption})
const tokenController = new TokenController({ tokenService});

router.post("/token_info", tokenController.tokenInfo);
router.post("/store_token", tokenController.storeToken);


export default router;