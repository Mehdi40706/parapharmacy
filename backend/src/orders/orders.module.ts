import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrdersCronService } from './ordersCron.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [DatabaseModule,MailModule],
  providers: [OrdersService,OrdersCronService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}