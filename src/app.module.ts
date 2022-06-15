import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { MintController } from './mint/mint.controller';
import { MintModule } from './mint/mint.module';
import { MulterModule } from '@nestjs/platform-express';

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
  ],
  controllers: [MintController],
})
export class AppModule {}
