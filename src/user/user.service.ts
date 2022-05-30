import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
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

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    try {
      const isValidObjectId = mongoose.isValidObjectId(userId);

      if (!isValidObjectId)
        throw new BadRequestException('Please check input userId');

      if (updateUserDto?.password) {
        const salt = bcryptjs.genSaltSync(10);

        const hashedPassword = bcryptjs.hashSync(updateUserDto.password, salt);

        updateUserDto.password = hashedPassword;
      }

      const existingUser = await this.userModel
        .findByIdAndUpdate(userId, updateUserDto, { new: true })
        .select('-password');

      if (!existingUser) {
        throw new NotFoundException(`User #${userId} not found`);
      }

      return existingUser;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    const userData = await this.userModel.find().select('-password');

    if (!userData || userData.length == 0) {
      throw new NotFoundException('Users data not found!');
    }

    return userData;
  }

  async getUser(userId: string): Promise<IUser> {
    const isValidObjectId = mongoose.isValidObjectId(userId);

    if (!isValidObjectId)
      throw new BadRequestException('Please check input userId');

    const existingUser = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return existingUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const isValidObjectId = mongoose.isValidObjectId(userId);

    if (!isValidObjectId)
      throw new BadRequestException('Please check input userId');

    const deletedUser = await this.userModel
      .findByIdAndDelete(userId)
      .select('-password');

    if (!deletedUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return deletedUser;
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
}
