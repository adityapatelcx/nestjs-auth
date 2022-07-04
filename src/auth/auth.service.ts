import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto';
import { UserJwtPayload } from './interface';
import * as bcryptjs from 'bcryptjs';
import { IUser } from 'src/user/user.interface';
import { BlacklistDocument } from './schema/blacklist.schema';
import { IBlacklist } from './interface/blacklist.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel('Blacklist') private blacklistModel: Model<IBlacklist>,
  ) {}

  async getAccessToken(payload: Record<string, string>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async decodeAccessToken(
    token: string,
  ): Promise<{ status: boolean; message: string; data?: any }> {
    try {
      const verify = await this.jwtService.verifyAsync(token);
      return {
        status: true,
        message: 'decode success',
        data: {
          id: verify?._id,
          purpose: verify?.purpose,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async signup(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: IUser }> {
    try {
      const { email } = authCredentialsDto;

      let user = await this.userService.getUserByEmail(email);

      if (user) return { user };

      user = await this.userService.createUser(authCredentialsDto);

      return { user };
    } catch (error) {
      throw error;
    }
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { password, email } = authCredentialsDto;

    const user = await this.userService.getUserByEmail(email);

    if (!user)
      throw new NotFoundException('User not found, Please signup first');

    if (!authCredentialsDto.provider) {
      const savedHash: string = await this.userService.getUserHash(email);

      const doPasswordMatch = bcryptjs.compareSync(password, savedHash);

      if (!doPasswordMatch)
        throw new UnauthorizedException('Incorrect login credentials');
    }

    const payload: UserJwtPayload = {
      email,
    };

    const access_token: string = this.jwtService.sign(payload);

    return { access_token };
  }

  async resetPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);

    return bcryptjs.hash(password, salt);
  }

  async blackListToken(token: string): Promise<BlacklistDocument> {
    return this.blacklistModel.create({ token });
  }

  async checkBlacklistedToken(token: string): Promise<BlacklistDocument> {
    return this.blacklistModel.findOne({ token });
  }
}
