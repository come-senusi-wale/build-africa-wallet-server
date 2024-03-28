import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// const accessTokenSecret = process.env.ACCESS_TOKEN
const accessTokenSecret = 'wasksjdkslslslsk'
const adminAccessTokenSecret = process.env.ADMIN_ACCESS_TOKEN

export enum TokenType {
    accessToken = 'ACCESS_TOKEN_SECRET',
    adminAccessToken = 'ADMIN_ACCESS_TOKEN_SECRET',
    refreshToken = 'REFRESH_TOKEN_SECRET',
    resetPassword = 'RESET_PASSWORD_SECRET',
    emailVerification = 'EMAIL_VERIFICATION_SECRET'
}

class EncryptionRepository {
    jwt: typeof jwt;
    bcrypt: typeof bcrypt;

    constructor() {
        this.jwt = jwt;
        this.bcrypt = bcrypt;
    }

    private getTokenKeyByType = (type?: TokenType) => {
        if (type === TokenType.adminAccessToken) {
            return {key: `${adminAccessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 30 * 2};
        }
        return { key: `${accessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 7 };
    }

    public encryptToken = (data: any, type?: TokenType) => {
        const token = this.getTokenKeyByType(type);
        return this.jwt.sign(data, token.key, { expiresIn: token.expiresIn});
    }

    public decryptToken = (data: any, type: TokenType) => {
        try {
            const token = this.getTokenKeyByType(type);
            return this.jwt.verify(data, token.key);
        } catch (err) {
            console.log(err);
            return null
        }
    }

    public encryptPassword = (password:any) => {
        return this.bcrypt.hashSync(password, 10);
    }

    public comparePassword = ( password: string, userPassword :string ) => {
        return this.bcrypt.compareSync(password, userPassword)
    }

}

export const secret = 'priavate/???keyexoppsp'

export default EncryptionRepository;