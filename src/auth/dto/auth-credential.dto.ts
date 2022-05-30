import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  first_name?: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  last_name?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsNumber()
  @MinLength(4)
  @MaxLength(4)
  @IsOptional()
  master_pin?: number;
}
