"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const token_controller_1 = __importDefault(require("../controller/token.controller"));
const token_service_1 = __importDefault(require("../service/token.service"));
const encryption_config_1 = __importDefault(require("../../../config/encryption.config"));
const encryption = new encryption_config_1.default();
const tokenService = new token_service_1.default({ encryption });
const tokenController = new token_controller_1.default({ tokenService });
router.post("/token_info", tokenController.tokenInfo);
router.post("/store_token", tokenController.storeToken);
exports.default = router;
