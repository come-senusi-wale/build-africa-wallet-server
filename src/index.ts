import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";
import dotenv from "dotenv";
import walletRoutes from "./api/wallet/route/route";
import authRoutes from "./api/auth/route/route";
import tokenRoutes from "./api/token/route/route";
// import { useTelegramBot } from "./bot/telegram.route";

dotenv.config();

// import { test } from "./api/controller/test";
import { testTwo } from "./api/controller/wale";
import { privatee } from "./api/controller/useprivatekey";
import { balance } from "./api/controller/bal";
// import { privateKey } from "./api/controller/priavate";
import { sendNearToken } from "./api/controller/sendToken";
import { sendNearTokenTwo } from "./api/controller/sendnear";
import { sendNearTokenTree } from "./api/controller/sendTokenTree";
import { viewCall } from "./api/controller/viewCall";

// test()
 //testTwo()
//privatee()
//balance()
//privateKey()
// sendNearToken()
//sendNearTokenTwo()
//sendNearTokenTree()
//viewCall()

// useTelegramBot()

const router = express.Router();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// });

app.use(
    cors({
      origin: "*",
    })
);

app.use("/api", walletRoutes);
app.use("/api", authRoutes);
app.use("/api", tokenRoutes);

// database connection
const MONGODB_URI = process.env.MONGODB_URI as string;

(async () => {
  try {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected To Database - Initial Connection");
  } catch (err) {
    console.log(
      `Initial Distribution API Database connection error occurred -`,
      err
    );
  }
})();

app.use(
    "/",
    router.get("/", (req, res) => {
      res.json("Hello");
    })
);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

