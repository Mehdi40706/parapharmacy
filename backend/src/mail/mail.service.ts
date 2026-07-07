import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.getMailUser();
    const password = this.configService.getMailPassword();

    const hasGmailConfig = !user.startsWith('votre_') && !password.startsWith('votre_');

    if (!hasGmailConfig) {
      throw new Error(
        'Gmail SMTP is not configured. Set MAIL_USER and MAIL_PASSWORD to a Gmail address and app password.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass: password,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${this.configService.getFrontendUrl()}/reset-password?token=${resetToken}`;
    const fromAddress = this.configService.getMailFrom();

    try {
      await this.transporter.sendMail({
        from: `"Parapharmacie" <${fromAddress}>`,
        to,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous pour continuer (valable 1 heure) :</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
              Réinitialiser mon mot de passe
            </a>
            <p style="color: #666; font-size: 13px; margin-top: 20px;">
              Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
            </p>
          </div>
        `,
      });

      this.logger.log(`Email de reset envoyé à ${to}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const responseCode =
        typeof error === 'object' && error !== null && 'responseCode' in error
          ? Number((error as { responseCode?: unknown }).responseCode)
          : undefined;

      if (responseCode === 550 || message.includes('Daily user sending limit exceeded')) {
        this.logger.warn(
          `Gmail delivery limit reached for ${to}. Password reset email was not sent.`,
        );
        return false;
      }

      this.logger.error(`Échec envoi email à ${to}`, error);
      return false;
    }
  }
}