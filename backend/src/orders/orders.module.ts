import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrdersCronService } from './ordersCron.service';

@Module({
  imports: [DatabaseModule],
  providers: [OrdersService,OrdersCronService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}