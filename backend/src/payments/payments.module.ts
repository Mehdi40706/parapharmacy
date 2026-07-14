import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [DatabaseModule,ProductsModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}