import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateGoalDto } from './create-goal.dto';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @IsString()
  @IsOptional()
  @ApiProperty()
  startDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  endDate?: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isCompleted!: boolean;
}
