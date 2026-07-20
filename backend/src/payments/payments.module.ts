import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProductsModule } from 'src/products/products.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [DatabaseModule,ProductsModule,MailModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}