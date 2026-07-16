import { forwardRef, Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { ProductsModule } from 'src/products/products.module';
import { Config } from 'src/config/config.module';

@Module({
    imports: [forwardRef(() => ProductsModule), Config],
    providers: [EmbeddingsService],
    exports: [EmbeddingsService]
})
export class EmbeddingsModule {}
