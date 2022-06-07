import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleOAuthStrategy } from './strategy';

@Module({
  providers: [AuthService, GoogleOAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
