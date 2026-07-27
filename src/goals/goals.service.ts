import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoError, ObjectId } from 'mongodb';
import { LogEntry } from 'src/log-entries/entities/log-entry.entity';
import { UsersService } from 'src/users/users.service';
import { MongoRepository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService implements OnModuleInit {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: MongoRepository<Goal>,
    @InjectRepository(LogEntry)
    private readonly logRepository: MongoRepository<LogEntry>,
    private readonly usersService: UsersService,
  ) {}

  onModuleInit() {
    void this.goalRepository.createCollectionIndex(
      { userId: 1, slug: 1 },
      { name: 'uniqueSlugPerUser', unique: true },
    );
  }

  async create(createGoalDto: CreateGoalDto) {
    return await this.goalRepository
      .save(createGoalDto)
      .catch((err: MongoError) => {
        if (err.code === 11000) {
          throw new BadRequestException('Goal already exists with this slug');
        }
        throw new BadRequestException('DB Error');
      });
  }

  async findAll(userId?: string) {
    if (userId) {
      return await this.goalRepository.find({
        where: { userId: new ObjectId(userId) },
      });
    }
    return await this.goalRepository.find();
  }

  async findByUsername(username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new BadRequestException('User not found');
    return await this.goalRepository.find({
      where: { userId: new ObjectId(user._id) },
    });
  }

  async findByUsernameAndSlug(username: string, slug: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new BadRequestException('User not found');
    return await this.goalRepository.findOneBy({
      userId: new ObjectId(user._id),
      slug,
    });
  }

  async findOne(_id: ObjectId) {
    return await this.goalRepository.findOneBy({ _id: new ObjectId(_id) });
  }

  async update(_id: ObjectId, updateGoalDto: UpdateGoalDto) {
    return await this.goalRepository.save({
      ...updateGoalDto,
      _id: new ObjectId(_id),
    });
  }

  async remove(_id: ObjectId) {
    await this.logRepository.deleteMany({ goalId: new ObjectId(_id) });
    return this.goalRepository.deleteOne({ _id: new ObjectId(_id) });
  }
}
