import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto';
import { IUser } from './user.interface';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const existingUser = await this.userModel
        .findOne({ email: createUserDto.email })
        .select('-password');

      if (existingUser) throw new ConflictException('User already exist');

      if (!createUserDto.provider) {
        if (!createUserDto.password)
          throw new BadRequestException('Password is required');

        const salt = bcryptjs.genSaltSync(10);

        const hashedPassword = bcryptjs.hashSync(createUserDto.password, salt);

        createUserDto.password = hashedPassword;
      }

      const newUser = new this.userModel(createUserDto);

      return newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser> {
    const existingUser = await this.userModel
      .findById(id)
      .select('-password')
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User not found`);
    }

    return existingUser;
  }

  async getUser(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .select('-password')
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User not found`);
    }

    return existingUser;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const existingUser = await this.userModel
      .findOne({ email: email })
      .select('-password')
      .exec();

    return existingUser;
  }

  async getUserHash(email: string): Promise<string> {
    const existingUser = await this.userModel
      .findOne({ email: email })
      .select('password')
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User #${email} not found`);
    }

    return existingUser.password;
  }

  async updateUser(
    filter: Record<string, string>,
    payload: Record<string, string>,
    upsert?: boolean,
  ): Promise<IUser> {
    return this.userModel.findOneAndUpdate(filter, payload, { upsert });
  }
}
