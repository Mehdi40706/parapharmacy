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

  @Get('webhook')
  handleWebhook(@Query('payment_ref') paymentRef: string) {
    return this.paymentsService.handleWebhook(paymentRef);
  }
  @UseGuards(JwtAuthGuard)
  @Get('status/:orderId')
  getStatus(
    @Param('orderId') orderId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.paymentsService.getPaymentStatus(orderId, user.userId);
  }
}