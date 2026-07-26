import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoError, ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService implements OnModuleInit {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: MongoRepository<Goal>,
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

  async findAll() {
    return await this.goalRepository.find();
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

  remove(_id: ObjectId) {
    return this.goalRepository.deleteOne({ _id: new ObjectId(_id) });
  }
}
