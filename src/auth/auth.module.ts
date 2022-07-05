import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  FacebookOAuthStrategy,
  GoogleOAuthStrategy,
  JwtStrategy,
} from './strategy';
import { BlacklistSchema } from './schema';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXP_H'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    MongooseModule.forFeature([{ name: 'Blacklist', schema: BlacklistSchema }]),
  ],
  providers: [
    AuthService,
    GoogleOAuthStrategy,
    FacebookOAuthStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
