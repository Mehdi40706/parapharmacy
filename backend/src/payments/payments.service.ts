import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../database/prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ProductsService } from 'src/products/products.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PaymentsService {
  private konnect: AxiosInstance;
  private readonly logger = new Logger();

  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private mailService: MailService
  ) {
     console.log('--- PaymentsService init ---');
  console.log('KONNECT_API_URL:', process.env.KONNECT_API_URL);
  console.log('KONNECT_API_KEY:', process.env.KONNECT_API_KEY);
  console.log('KONNECT_WALLET_ID:', process.env.KONNECT_WALLET_ID);
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

  if (!order) throw new NotFoundException('Commande introuvable');
  if (order.userId !== userId) {
    throw new BadRequestException('Cette commande ne vous appartient pas');
  }
  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new BadRequestException('Cette commande est déjà payée');
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestException('Cette commande a expiré ou a été annulée');
  }

  // Toute tentative encore PENDING est invalidée avant d'en créer une nouvelle
  await this.prisma.payment.updateMany({
    where: { orderId: order.id, status: PaymentStatus.PENDING },
    data: { status: PaymentStatus.FAILED },
  });

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

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        providerRef: data.paymentRef,
        amount: order.totalPrice,
        status: PaymentStatus.PENDING,
      },
    });

    return { payUrl: data.payUrl, paymentRef: data.paymentRef };
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new BadRequestException(`Erreur lors de l'initialisation du paiement Konnect: ${message}`);
  }
}

async handleWebhook(paymentRef: string) {
  if (!paymentRef) throw new BadRequestException('payment_ref manquant');

  const payment = await this.prisma.payment.findUnique({
    where: { providerRef: paymentRef },
    include: {
      order: {
        include: {
          items: { include: { product: true } }, // 👈 product ajouté pour le nom dans l'email
          user: true, // 👈 nécessaire pour payment.order.user.email
        },
      },
    },
  });
  if (!payment) {
    throw new NotFoundException('Paiement introuvable pour cette référence');
  }

  if (payment.status !== PaymentStatus.PENDING) {
    return { received: true, alreadyProcessed: true };
  }

  const { data } = await this.konnect.get(`/payments/${paymentRef}`);
  const konnectStatus = data.payment.status;

  if (konnectStatus === 'completed') {
    await this.prisma.$transaction(async (tx) => {
      for (const item of payment.order.items) {
        await this.productsService.confirmStock(item.productId, item.quantity, tx);
      }
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PAID, rawResponse: data },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: PaymentStatus.PAID, status: OrderStatus.CONFIRMED },
      });
    });

    // Hors transaction, même logique que pour COD
    this.mailService
      .sendOrderConfirmationEmail(payment.order.user.email, {
        id: payment.order.id,
        totalPrice: Number(payment.order.totalPrice),
        paymentMethod: payment.order.paymentMethod,
        items: payment.order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        shippingAddress: payment.order.shippingAddress,
        shippingCity: payment.order.shippingCity,
      })
      .catch((err) => this.logger.error('Échec envoi confirmation commande', err));
  } else if (konnectStatus === 'failed' || konnectStatus === 'expired') {
    await this.prisma.$transaction(async (tx) => {
      for (const item of payment.order.items) {
        await this.productsService.releaseStock(item.productId, item.quantity, tx);
      }
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED, rawResponse: data },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: PaymentStatus.FAILED, status: OrderStatus.CANCELLED },
      });
    });
  }
  // "pending" : on ne touche à rien

  return { received: true };
}

  async getPaymentStatus(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.userId !== userId) {
      throw new BadRequestException('Cette commande ne vous appartient pas');
    }
    return { orderId: order.id, paymentStatus: order.paymentStatus, orderStatus: order.status };
  }
}