import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout/:orderId')
  createPayment(
    @Param('orderId') orderId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.paymentsService.createPayment(orderId, user.userId);
  }

  // Appelée par Konnect lui-même (GET avec ?payment_ref=xxx)
  // PAS de guard ici : c'est Konnect qui appelle, pas un utilisateur connecté
  @Get('webhook')
  handleWebhook(@Query('payment_ref') paymentRef: string) {
    return this.paymentsService.handleWebhook(paymentRef);
  }

  // Le frontend peut appeler ceci après le retour du checkout
  @UseGuards(JwtAuthGuard)
  @Get('status/:orderId')
  getStatus(
    @Param('orderId') orderId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.paymentsService.getPaymentStatus(orderId, user.userId);
  }
}