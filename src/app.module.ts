import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { MintModule } from './mint/mint.module';
import { ActivityModule } from './activity/activity.module';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({}),
    AuthModule,
    UserModule,
    DatabaseModule,
    MintModule,
    ActivityModule,
    NftModule,
  ],
})
export class AppModule {}
