import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  googleLogin(req) {
    if (!req.user) return 'No user from google';

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  facebookLogin(req) {
    if (!req.user) return 'No user from facebook';

    return {
      message: 'User information from facebook',
      user: req.user,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
