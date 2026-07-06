import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 secondes
        limit: 20,  // 20 requêtes / minute par IP, par défaut
      },
    ]),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
