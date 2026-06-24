import nodeMailer from "nodemailer";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
import "dotenv/config";

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    }
});

export const mailer = async (recipient: string, subject: string, body: string) => {
        return await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: recipient,
            subject,
            html: body,
        });
}
