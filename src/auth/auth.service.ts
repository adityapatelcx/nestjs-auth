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

  twitterLogin(req) {
    if (!req.user) return 'No user from twitter';

    return {
      message: 'User information from twitter',
      user: req.user,
    };
  }
}
