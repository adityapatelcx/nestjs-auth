import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  FacebookOAuthStrategy,
  GoogleOAuthStrategy,
  JwtStrategy,
} from './strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlacklistSchema } from './schema/blacklist.schema';

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
