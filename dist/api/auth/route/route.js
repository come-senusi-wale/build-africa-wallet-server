"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const encryption_config_1 = __importDefault(require("../../../config/encryption.config"));
const auth_controller_1 = __importDefault(require("./../controller/auth.controller"));
const auth_service_1 = __importDefault(require("./../service/auth.service"));
const email_config_1 = __importDefault(require("../../../config/email.config"));
const encryption = new encryption_config_1.default();
const emailRespotory = new email_config_1.default();
const authService = new auth_service_1.default({ encryption, emailRespotory });
const authController = new auth_controller_1.default({ authService });
router.post("/signup", authController.signup);
router.get("/email_verification", authController.emailVerifcation);
exports.default = router;
