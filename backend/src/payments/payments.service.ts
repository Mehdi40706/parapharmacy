import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../database/prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private konnect: AxiosInstance;

  constructor(private prisma: PrismaService) {
    this.konnect = axios.create({
      baseURL: process.env.KONNECT_API_URL,
      headers: {
        'x-api-key': process.env.KONNECT_API_KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async createPayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }
    if (order.userId !== userId) {
      throw new BadRequestException('Cette commande ne vous appartient pas');
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cette commande est déjà payée');
    }

    // Konnect attend le montant en MILLIMES (1 TND = 1000 millimes)
    const amountInMillimes = Math.round(Number(order.totalPrice) * 1000);

    try {
     const { data } = await this.konnect.post('/payments/init-payment', {
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      token: 'TND',
      amount: amountInMillimes,
      type: 'immediate',
      description: `Commande #${order.id.slice(0, 8)} - Parapharmacie`,
      acceptedPaymentMethods: ['wallet', 'bank_card', 'e-DINAR'],
      lifespan: 30,
      checkoutForm: true,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      email: order.user.email,
      orderId: order.id,
      webhook: `${process.env.BACKEND_URL}/payments/webhook`,
      silentWebhook: true,
      successUrl: `${process.env.FRONTEND_URL}/checkout/success?order_id=${order.id}`,
      failUrl: `${process.env.FRONTEND_URL}/checkout/cancel?order_id=${order.id}`,
    }); 

      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentRef: data.paymentRef },
      });

      return { payUrl: data.payUrl, paymentRef: data.paymentRef };
   } catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
      ? JSON.stringify(error)
      : String(error);

  throw new BadRequestException(
    `Erreur lors de l'initialisation du paiement Konnect: ${message}`,
  );
}
  }

  // Appelé par le webhook Konnect (silent, côté serveur)
  async handleWebhook(paymentRef: string) {
    if (!paymentRef) {
      throw new BadRequestException('payment_ref manquant');
    }

    // On va chercher la VRAIE vérité sur le statut auprès de Konnect
    const { data } = await this.konnect.get(`/payments/${paymentRef}`);
    const payment = data.payment;

    const order = await this.prisma.order.findUnique({
      where: { paymentRef },
    });

    if (!order) {
      throw new NotFoundException(
        'Commande introuvable pour cette référence de paiement',
      );
    }

    if (payment.status === 'completed') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
      });
    } else if (payment.status === 'failed' || payment.status === 'expired') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
    }
    // Si "pending", on ne change rien — le client n'a peut-être pas fini de payer

    return { received: true };
  }

  // Utile pour que le frontend vérifie manuellement le statut après redirection
  async getPaymentStatus(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }
    if (order.userId !== userId) {
      throw new BadRequestException('Cette commande ne vous appartient pas');
    }

    return {
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    };
  }
}