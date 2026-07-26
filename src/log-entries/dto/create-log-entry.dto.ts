import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateLogEntryDto {
  @Transform(({ value }: { value: string }) => new ObjectId(value))
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  goalId!: ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content!: string;
}
