const express = require("express");
const router = express.Router();
import WalletController from "../../wallet/controller/wallet.controller";
import WalletService from "../../wallet/service/wallet.service";
import Encryption from "../../../config/encryption.config";
import NearConfig from "../../../config//near.config";

const networkId = process.env.NETWORK_ID 

const nearConfig = new NearConfig({networkId})
const encryption = new Encryption()

const walletService = new WalletService({nearConfig, encryption})
const walletController = new WalletController({ walletService});

router.post("/create_account", walletController.createAccount);
router.post("/check_account", walletController.checkAccount);

export default router;