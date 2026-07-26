import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class SocialLinkDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  platform!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url!: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  bio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  headline?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  skills?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  avatarUrl?: string;

  @IsArray()
  @IsOptional()
  @Type(() => SocialLinkDto)
  @ValidateNested({ each: true })
  @ApiProperty()
  socialLinks?: SocialLinkDto[];
}
