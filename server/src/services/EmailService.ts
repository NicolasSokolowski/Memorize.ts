import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import { readFile } from "fs/promises";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

type EmailData = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string>;
};

export class EmailService {
  private static transporter: Transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  });

  private static async renderTemplate(
    template: string,
    context: Record<string, string>
  ) {
    const filePath = path.join(
      __dirname,
      "..",
      "templates",
      "build_emails",
      "src",
      "emails",
      `${template}.html`
    );
    const content = await readFile(filePath, "utf-8");
    return ejs.render(content, context);
  }

  static async sendEmail({ to, subject, template, context }: EmailData) {
    try {
      const html = await this.renderTemplate(template, context);

      await this.transporter.sendMail({
        from: `"Memorize" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });
    } catch (err) {
      console.error("Error while trying to send email: ", err);
      throw err;
    }
  }
}
