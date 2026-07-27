import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoError, ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository
      .save({
        ...createUserDto,
        isVerified: false,
        isActive: true,
      })
      .catch((err: MongoError) => {
        if (err.code === 11000) {
          throw new BadRequestException(
            'User already exists with this email or username',
          );
        }
        throw new BadRequestException('DB Error');
      });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(_id: ObjectId) {
    return await this.userRepository.findOneBy({ _id: new ObjectId(_id) });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async update(_id: ObjectId, updateUserDto: UpdateUserDto) {
    return await this.userRepository.save({
      ...updateUserDto,
      _id: new ObjectId(_id),
    });
  }

  async updatePassword(_id: ObjectId, updateUserDto: UpdateUserDto) {
    return await this.userRepository.save({
      ...updateUserDto,
      _id: new ObjectId(_id),
    });
  }

  async remove(_id: ObjectId) {
    return await this.userRepository.deleteOne({ _id: new ObjectId(_id) });
  }
}
