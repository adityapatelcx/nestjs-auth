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

  async googleLogin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string; userAlreadyExists: boolean }> {
    if (!authCredentialsDto.email)
      throw new NotFoundException(
        'User not found with google OAuth, Please signup first',
      );

    const existingUser: IUser = await this.userService.getUserByEmail(
      authCredentialsDto.email,
    );

    if (existingUser) {
      const { access_token } = await this.signin(authCredentialsDto);
      return { access_token, userAlreadyExists: true };
    }

    const { access_token } = await this.signup(authCredentialsDto);
    return { access_token, userAlreadyExists: false };
  }

  async facebookLogin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string; userAlreadyExists: boolean }> {
    if (!authCredentialsDto.email)
      throw new NotFoundException(
        'User not found with facebook OAuth, Please signup first',
      );

    const existingUser: IUser = await this.userService.getUserByEmail(
      authCredentialsDto.email,
    );

    if (existingUser) {
      const { access_token } = await this.signin(authCredentialsDto);
      return { access_token, userAlreadyExists: true };
    }

    const { access_token } = await this.signup(authCredentialsDto);
    return { access_token, userAlreadyExists: false };
  }

  async signup(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const {
      email,
      first_name,
      last_name = '',
      master_pin = 0,
    } = authCredentialsDto;

    const existingUser: IUser = await this.userService.getUserByEmail(email);

    if (existingUser)
      throw new ConflictException('User already exist, Please signin');

    await this.userService.createUser(authCredentialsDto);

    const payload: UserJwtPayload = {
      email,
      first_name,
      last_name,
      master_pin,
    };

    const access_token: string = this.jwtService.sign(payload);

    return { access_token };
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const {
      password,
      email,
      first_name,
      last_name = '',
      master_pin = 0,
    } = authCredentialsDto;

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
      first_name,
      last_name,
      master_pin,
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
