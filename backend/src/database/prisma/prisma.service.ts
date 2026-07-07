import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: configService.getDatabaseUrl() }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}