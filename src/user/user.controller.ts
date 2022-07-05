import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newUser = (
        await this.userService.createUser(createUserDto)
      ).toObject();

      delete newUser.password;

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (error) {
      if (!error.status)
        return response.status(500).json({ message: error.message });

      return response.status(error.status).json(error.response);
    }
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUser(@Res() response, @Req() request) {
    try {
      const existingUser = await this.userService.getUser(request.user);

      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (error) {
      if (!error.status)
        return response.status(500).json({ message: error.message });

      return response.status(error.status).json(error.response);
    }
  }
}
