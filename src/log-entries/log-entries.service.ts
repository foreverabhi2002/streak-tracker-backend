import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { JwtPayload } from 'src/auth/auth.interface';
import { GoalsService } from 'src/goals/goals.service';
import { MongoRepository } from 'typeorm';
import { CreateLogEntryDto } from './dto/create-log-entry.dto';
import { UpdateLogEntryDto } from './dto/update-log-entry.dto';
import { LogEntry } from './entities/log-entry.entity';

@Injectable()
export class LogEntriesService {
  constructor(
    @InjectRepository(LogEntry)
    private readonly logRepository: MongoRepository<LogEntry>,
    private readonly goalsService: GoalsService,
  ) {}

  async create(createLogDto: CreateLogEntryDto, user: JwtPayload) {
    const getGoal = await this.goalsService.findOne(createLogDto.goalId);
    if (!getGoal) {
      throw new BadRequestException('Goal does not exists');
    }
    if (getGoal.userId.toString() !== user._id) {
      throw new BadRequestException(
        'User not allowed to create a log to this goal',
      );
    }
    return await this.logRepository.save(createLogDto);
  }

  async findAll() {
    return await this.logRepository.find();
  }

  async findOne(_id: ObjectId) {
    return await this.logRepository.findOneBy({ _id: new ObjectId(_id) });
  }

  async update(
    _id: ObjectId,
    updateLogDto: UpdateLogEntryDto,
    user: JwtPayload,
  ) {
    const getLog = await this.findOne(_id);
    if (!getLog) {
      throw new BadRequestException('Log does not exists');
    }
    const getGoal = await this.goalsService.findOne(getLog.goalId);
    if (!getGoal) {
      throw new BadRequestException('Goal does not exists');
    }
    if (getGoal.userId.toString() !== user._id) {
      throw new BadRequestException(
        'User not allowed to update log to this goal',
      );
    }
    return await this.logRepository.save({
      ...updateLogDto,
      _id: new ObjectId(_id),
    });
  }
}
