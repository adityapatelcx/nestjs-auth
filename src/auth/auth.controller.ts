import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto';
import { FacebookOAuthGuard, GoogleOAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Res() response,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    try {
      const { access_token } = await this.authService.signup(
        authCredentialsDto,
      );

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been signed up',
        access_token,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Post('signin')
  async signin(
    @Res() response,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    try {
      const { access_token } = await this.authService.signin(
        authCredentialsDto,
      );

      return response.status(HttpStatus.OK).json({
        message: 'User has been signed in',
        access_token,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() request) {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Req() request,
    @Res() response,
  ): Promise<{ access_token: string }> {
    try {
      const { access_token, userAlreadyExists } =
        await this.authService.googleLogin(request.user);

      if (userAlreadyExists)
        return response.status(HttpStatus.OK).json({
          message: 'User has been signed in',
          access_token,
        });

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been signed up',
        access_token,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth(@Req() request) {
    // Guard redirects
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuthRedirect(@Req() request, @Res() response) {
    try {
      console.log(request.user);
      const { access_token, userAlreadyExists } =
        await this.authService.facebookLogin(request.user);

      if (userAlreadyExists)
        return response.status(HttpStatus.OK).json({
          message: 'User has been signed in',
          access_token,
        });

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been signed up',
        access_token,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
}
