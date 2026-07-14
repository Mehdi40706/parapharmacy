import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersCronService {
  private readonly logger = new Logger(OrdersCronService.name);

  constructor(private ordersService: OrdersService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiredOrders() {
    const expiredIds = await this.ordersService.findExpiredPendingOrderIds();

    if (expiredIds.length === 0) return;

    this.logger.log(`Expiration de ${expiredIds.length} commande(s) impayée(s)`);

    for (const orderId of expiredIds) {
      try {
        await this.ordersService.expirePendingOrder(orderId);
      } catch (err) {
        this.logger.error(`Échec expiration commande ${orderId}`, err);
      }
    }
  }
}