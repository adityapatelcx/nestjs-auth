import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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

  @IsEmail()
  @MinLength(4)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsNumber()
  @Min(1000000)
  @Max(9999999)
  @IsOptional()
  @IsNotEmpty()
  master_pin?: number;
}
