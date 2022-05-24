import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
}
