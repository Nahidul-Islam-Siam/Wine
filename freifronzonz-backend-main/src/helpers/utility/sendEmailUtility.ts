import nodemailer from "nodemailer"
import { smtp_host, smtp_pass, smtp_port, smtp_user } from "../../config/config";

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html?: string;
}

const SendEmailUtility = async (
    EmailTo: string,
    EmailSubject: string,
    HtmlContent: string
): Promise<any> => {

    if (!smtp_host || !smtp_port || !smtp_user || !smtp_pass) {
      throw new Error("Missing SMTP configuration in environment variables");
    }

    let transporter = nodemailer.createTransport({
        host: smtp_host,
        port: smtp_port,
        secure: true,
        auth: {
            user: smtp_user,
            pass: smtp_pass
        },
        tls: { rejectUnauthorized: false }
    } as any);

    let mailOptions: MailOptions = {
        from: `Ops.Wine${smtp_user}>`,
        to: EmailTo,
        subject: EmailSubject,
        html: HtmlContent
    };

    return await transporter.sendMail(mailOptions);
}

export default SendEmailUtility;