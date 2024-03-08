import express from "express";
const router = express.Router();
import Encryption from "../../../config/encryption.config";
import AuthController from "./../controller/auth.controller";
import AuthService from "./../service/auth.service";
import EmailRespotory from "../../../config/email.config";

const encryption = new Encryption()
const emailRespotory = new EmailRespotory()

const authService = new AuthService({encryption, emailRespotory})
const authController = new AuthController({authService})

router.post("/signup", authController.signup);
router.get("/email_verification", authController.emailVerifcation);

export default router;