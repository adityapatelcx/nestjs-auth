import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto';
import { FacebookOAuthGuard, GoogleOAuthGuard } from './guard';
import { UserService } from '../user';
import { sendMail } from '../services/ses';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @Post('forgot')
  @HttpCode(200)
  async forgotPassword(
    @Body() { email }: { email: string },
    @Headers('origin') origin: string,
  ): Promise<{ message: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new HttpException(
        `User with ${email} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const access_token = await this.authService.getAccessToken({
      _id: user?._id,
      purpose: 'PWD_RST', // Password Reset purpose code, this is used to differentiate between the token we provide for auth and reset password.
    });

    const params = {
      to: email,
      body: `Click on this link to reset your password, ${origin}/auth/reset/${access_token}`,
      subject: 'Reset Your Elysium Password',
    };

    await sendMail(params);

    return {
      message: `Password reset procedure has been sent to you email, please check your inbox.`,
    };
  }

  @Post('reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() payload: { password: string },
  ): Promise<{ message: string }> {
    const isTokenBlacklisted = await this.authService.checkBlacklistedToken(
      token,
    );

    if (isTokenBlacklisted) {
      throw new HttpException(
        'This request is already processed, please request a new one.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const decodeToken = await this.authService.decodeAccessToken(token);

    if (!decodeToken.status) {
      throw new HttpException(decodeToken.message, HttpStatus.BAD_REQUEST);
    }

    if (decodeToken.data?.purpose !== 'PWD_RST') {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.getUserById(decodeToken?.data?.id);

    if (!user) {
      throw new HttpException(
        'Invalid request, user does not exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const password = await this.authService.resetPassword(payload.password);

    await this.userService.updateUser({ _id: user._id }, { password });

    await this.authService.blackListToken(token);

    return { message: `Password reset successful` };
  }
}
