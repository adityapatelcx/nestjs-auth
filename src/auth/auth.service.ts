import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto';
import { UserJwtPayload } from './interface';
import * as bcryptjs from 'bcryptjs';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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
        throw new UnauthorizedException('Incorrect login credentials!');
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
}
