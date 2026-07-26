import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateGoalDto {
  @Transform(({ value }: { value: string }) => new ObjectId(value))
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  userId!: ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  currentStreak!: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  longestStreak!: number;
}
