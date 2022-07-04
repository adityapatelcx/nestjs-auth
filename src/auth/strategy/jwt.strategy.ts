import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserJwtPayload } from '../interface';
import { IUser } from '../../user/user.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: UserJwtPayload): Promise<IUser> {
    const { email } = payload;

    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified === false)
      throw new UnauthorizedException('User email not verified');

    return user;
  }
}
