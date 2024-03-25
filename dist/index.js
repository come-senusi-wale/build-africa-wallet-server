"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const route_1 = __importDefault(require("./api/wallet/route/route"));
const route_2 = __importDefault(require("./api/auth/route/route"));
const route_3 = __importDefault(require("./api/token/route/route"));
const telegram_route_1 = require("./bot/telegram.route");
dotenv_1.default.config();
// test()
//testTwo()
//privatee()
//balance()
//privateKey()
// sendNearToken()
//sendNearTokenTwo()
//sendNearTokenTree()
//viewCall()
(0, telegram_route_1.useTelegramBot)();
const router = express_1.default.Router();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// });
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use("/api", route_1.default);
app.use("/api", route_2.default);
app.use("/api", route_3.default);
// database connection
const MONGODB_URI = process.env.MONGODB_URI;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected To Database - Initial Connection");
    }
    catch (err) {
        console.log(`Initial Distribution API Database connection error occurred -`, err);
    }
}))();
app.use("/", router.get("/", (req, res) => {
    res.json("Hello");
}));
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
