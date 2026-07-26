import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import type { JwtPayload } from 'src/auth/auth.interface';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
@ApiTags('Goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a goal' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGoalDto: CreateGoalDto) {
    const data = await this.goalsService.create(createGoalDto);
    return {
      data,
      message: 'Goal created successfully',
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get All Goals' })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.goalsService.findAll();
    return {
      data,
      message: 'All Goals retrieved',
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a Goal' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: ObjectId) {
    const data = await this.goalsService.findOne(id);
    return {
      data,
      message: 'Goal retrieved',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Goal' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Param('id') id: ObjectId,
    @Body() updateGoalDto: UpdateGoalDto,
    @User() user: JwtPayload,
  ) {
    const getGoal = await this.goalsService.findOne(id);
    if (!getGoal) {
      throw new BadRequestException('Goal does not exists');
    }
    if (getGoal.userId.toString() !== user._id) {
      throw new BadRequestException(
        'You are not authorized to update this goal',
      );
    }
    const data = await this.goalsService.update(id, updateGoalDto);
    return {
      data,
      message: 'Goal updated',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Goal' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: ObjectId, @User() user: JwtPayload) {
    const getGoal = await this.goalsService.findOne(id);
    if (!getGoal) {
      throw new BadRequestException('Goal does not exists');
    }
    if (getGoal.userId.toString() !== user._id) {
      throw new BadRequestException(
        'You are not authorized to delete this goal',
      );
    }
    const data = await this.goalsService.remove(id);
    return {
      data,
      message: 'Goal deleted successfully',
    };
  }
}
