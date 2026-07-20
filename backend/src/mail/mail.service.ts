import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '../config/config.service';
import { passwordResetTemplate } from './templates/password-reset.template';
import { orderConfirmationTemplate } from './templates/order-confirmation.template';
import { lowStockAlertTemplate } from './templates/low-stock-alert.template';

interface OrderConfirmationItem {
  name: string;
  quantity: number;
  price: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.getResendApiKey());
  }

  private async send(params: { to: string; subject: string; html: string }) {
    try {
      const { error } = await this.resend.emails.send({
        from: this.configService.getMailFrom(),
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      if (error) {
        this.logger.error(`Échec envoi email à ${params.to}`, error);
        throw new Error(error.message);
      }
    } catch (err) {
      this.logger.error(`Échec envoi email à ${params.to}`, err);
      throw err;
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const frontendUrl = this.configService.getFrontendUrl();
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    await this.send({
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html: passwordResetTemplate({ resetUrl, frontendUrl }),
    });
  }

  async sendOrderConfirmationEmail(
    to: string,
    order: {
      id: string;
      totalPrice: number;
      paymentMethod: 'ONLINE' | 'COD';
      items: OrderConfirmationItem[];
      shippingAddress: string;
      shippingCity: string;
    },
  ) {
    const frontendUrl = this.configService.getFrontendUrl();

    await this.send({
      to,
      subject: `Confirmation de votre commande #${order.id.slice(0, 8)}`,
      html: orderConfirmationTemplate({
        orderId: order.id,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        items: order.items,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        frontendUrl,
      }),
    });
  }

  async sendLowStockAlertEmail(product: { id: string; name: string; stock: number }) {
    const frontendUrl = this.configService.getFrontendUrl();
    const threshold = this.configService.getLowStockThreshold();
    const adminEmail = this.configService.getAdminEmail();

    await this.send({
      to: adminEmail,
      subject: `⚠️ Stock faible : ${product.name}`,
      html: lowStockAlertTemplate({
        productName: product.name,
        productId: product.id,
        stock: product.stock,
        threshold,
        frontendUrl,
      }),
    });
  }
}