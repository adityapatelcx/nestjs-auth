import { AuthGuard } from '@nestjs/passport';

export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }
}
