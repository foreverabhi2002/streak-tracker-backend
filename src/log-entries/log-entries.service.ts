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

    const logs = await this.findAll(createLogDto.goalId.toString());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newCurrentStreak = getGoal.currentStreak || 0;
    let newLongestStreak = getGoal.longestStreak || 0;

    if (logs.length > 0) {
      const lastLogDate = new Date(logs[0].createdAt);
      lastLogDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastLogDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCurrentStreak += 1;
      } else if (diffDays > 1) {
        newCurrentStreak = 1;
      } else if (diffDays === 0) {
        if (newCurrentStreak === 0) newCurrentStreak = 1;
      }
    } else {
      newCurrentStreak = 1;
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    await this.goalsService.update(getGoal._id, {
      userId: getGoal.userId,
      slug: getGoal.slug,
      title: getGoal.title,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      isCompleted: getGoal.isCompleted,
    });

    return await this.logRepository.save(createLogDto);
  }

  async findAll(goalId?: string) {
    if (goalId) {
      return await this.logRepository.find({
        where: { goalId: new ObjectId(goalId) },
        order: { createdAt: 'DESC' },
      });
    }
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

    const logDate = new Date(getLog.createdAt);
    const logDateStr = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (logDateStr !== todayStr) {
      throw new BadRequestException(
        'Cannot edit a log entry for a previous date',
      );
    }

    return await this.logRepository.save({
      ...updateLogDto,
      _id: new ObjectId(_id),
    });
  }
}
