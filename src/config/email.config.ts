import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";

export type SendEmailType = {
    emailTo: string;
    subject: string;
    html: any
};

class EmailRespotory {

    transporterInit = () => {
       
        return nodemailer.createTransport({
            service: "gmail",
            secureConnection: false,
            port: 465,
            auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
            },
            tls: {
            rejectUnauthorized: true,
            },
        } as SMTPTransport.Options);
    };

    sendEmail = async ({
        emailTo,
        subject,
        html
      }: SendEmailType) => {
        // Init the nodemailer transporter
       const transporter = this.transporterInit();
      
        try {
          let response = await transporter.sendMail({
            from: "BuidlAfrica",
            to: emailTo,
            subject: subject,
            html: html,
          });
          return response;
        } catch (error) {
          console.log("error", error)
          throw error;
        }
    }

}

export default EmailRespotory