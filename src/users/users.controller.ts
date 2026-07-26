import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ObjectId } from "mongodb";
import type { JwtPayload } from 'src/auth/auth.interface';
import { User } from 'src/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      data,
      message: 'All Users',
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: ObjectId) {
    const data = await this.usersService.findOne(id);
    return {
      data,
      message: "User fetched successfully",
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto, @User() user: JwtPayload) {
    if (user._id !== id.toString()) {
      throw new BadRequestException('You are not authorized to update this user');
    }
    const data = await this.usersService.update(id, updateUserDto);
    return {
      data,
      message: "User updated successfully",
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: ObjectId, @User() user: JwtPayload) {
    if (user._id !== id.toString()) {
      throw new BadRequestException('You are not authorized to delete this user');
    }
    const data = await this.usersService.remove(id);
    return {
      data,
      message: "User deleted successfully",
    }
  }
}
