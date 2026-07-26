import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class LogInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  otp!: number;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  otp!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}

export class UserDto {
  @Transform(({ value }: { value: string }) => new ObjectId(value))
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  _id!: ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: true })
  isActive!: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword!: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  user!: UserDto;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token!: string;
}
