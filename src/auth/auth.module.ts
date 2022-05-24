import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookOAuthStrategy, GoogleOAuthStrategy } from './strategy';

@Module({
  providers: [AuthService, GoogleOAuthStrategy, FacebookOAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
