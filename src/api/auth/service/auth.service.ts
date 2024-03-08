import jwt from 'jsonwebtoken';
import UserRegModel from "../../../database/model/userReg.model";
import WalletModel from "../../../database/model/wallet.model";
import Encryption, {TokenType} from "../../../config/encryption.config";
import EmailRespotory from "../../../config/email.config";
import { htmlMailTemplate } from "../../../template/emailTemplate";

class AuthService {
    private _encryption: Encryption
    private _emailRespotory: EmailRespotory

    constructor({ encryption, emailRespotory}: { 
        encryption: Encryption
        emailRespotory: EmailRespotory
        
    }) {
        this._encryption = encryption
        this._emailRespotory = emailRespotory
    }

    public encryptToken = (data: any) => {
        return jwt.sign(data, process.env.SECRET_ENCRYPTION_KEY!);
    }

    public decryptToken = (data: any): string => { 
        return jwt.verify(data, process.env.SECRET_ENCRYPTION_KEY!) as string;
    }

   
    // registration
    public registraion = async ({email, password, token}: {
        email: string
        password: string
        token: string
    }) => {
        try {
            const decoded: any = this._encryption.decryptToken(token, TokenType.accessToken);
            if (!decoded?.telegramId) return { errors: [{ message: 'Invalid request'}] };

            const user = await UserRegModel.findOne({ telgramId: decoded?.telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            const checkEmail = await UserRegModel.findOne({email})
            if (checkEmail && checkEmail.emailVerification) return { errors: [{ message: 'email already exist'}] };

            const hashPassword = this._encryption.encryptPassword(password)

            user.email = email
            user.password = hashPassword
            
            await user.save()

            const port = process.env.PORT

            const emaiHtml = htmlMailTemplate(port, email, decoded?.telegramId)

            this._emailRespotory.sendEmail({emailTo: email, subject: "Email verification", html: emaiHtml})

            return {status: true, data: {message: 'please! check your email for verification'} };
        } catch (error) {
            return { errors: [{ message: 'unable to create account'}] };
        }
    }


    // email verification
    public emailVerifaction = async ({email, telegramId}: {
        email: string
        telegramId: string
        
    }) => {
        try {

            const user = await UserRegModel.findOne({ telgramId: telegramId });
            if (!user) return { errors: [{ message: 'user not found'}] };

            const checkEmail = await UserRegModel.findOne({email})
            if (!checkEmail) return { errors: [{ message: 'invalid Email'}] };

            if (checkEmail.emailVerification) return { errors: [{ message: 'Email Already verify'}] };

            user.emailVerification = true
            await user.save()

            return {status: true, data: {message: 'email successfully verified'} };
        } catch (error) {
            return { errors: [{ message: 'unable to verified email'}] };
        }
    }

}

export default AuthService;