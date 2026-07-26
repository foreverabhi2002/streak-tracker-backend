import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    const smtpConfig: SMTPTransport.Options = {
      host: this.configService.get<string>('SMTP_HOST'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      port: +this.configService.getOrThrow<string>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      tls: { rejectUnauthorized: false },
    };
    this.transporter = createTransport(smtpConfig);
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        to,
        html,
        subject: `${subject}`,
        from: `Learn In Public Streak Tracker Admin <${String(this.configService.get('SMTP_FROM'))}>`,
        replyTo: String(this.configService.get('SMTP_REPLY_TO')),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
