import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/storage/storage.module';
import { EmbeddingsModule } from 'src/embeddings/embeddings.module';

@Module({
  imports: [DatabaseModule, StorageModule, forwardRef(() => EmbeddingsModule)],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService], 
})
export class ProductsModule {}