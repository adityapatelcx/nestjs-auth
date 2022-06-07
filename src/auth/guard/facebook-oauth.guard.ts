import { AuthGuard } from '@nestjs/passport';

export class FacebookOAuthGuard extends AuthGuard('facebook') {
  constructor() {
    super();
  }
}
