import {
  Body,
  Controller,
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
import { CreateLogEntryDto } from './dto/create-log-entry.dto';
import { UpdateLogEntryDto } from './dto/update-log-entry.dto';
import { LogEntriesService } from './log-entries.service';

@Controller('log-entries')
@ApiTags('Log Entries')
export class LogEntriesController {
  constructor(private readonly logsService: LogEntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Log Entry' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLogDto: CreateLogEntryDto,
    @User() user: JwtPayload,
  ) {
    const data = await this.logsService.create(createLogDto, user);
    return {
      data,
      message: 'Log entry successful',
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get All Log Entries' })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.logsService.findAll();
    return {
      data,
      message: 'Logs entries retrieved',
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get Log Entry' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: ObjectId) {
    const data = await this.logsService.findOne(id);
    return {
      data,
      message: 'Log entry retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Log' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Param('id') id: ObjectId,
    @Body() updateLogDto: UpdateLogEntryDto,
    @User() user: JwtPayload,
  ) {
    return this.logsService.update(id, updateLogDto, user);
  }
}
