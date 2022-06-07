import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  FacebookOAuthGuard,
  GoogleOAuthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth(@Req() req) {
    // Guard redirects
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookOAuthGuard)
  facebookAuthRedirect(@Req() req) {
    return this.authService.facebookLogin(req);
  }
}
