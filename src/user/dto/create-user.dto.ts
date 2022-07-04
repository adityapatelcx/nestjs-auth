import { PartialType } from '@nestjs/mapped-types';
import { AuthCredentialsDto } from '../../auth';

export class CreateUserDto extends PartialType(AuthCredentialsDto) {}
