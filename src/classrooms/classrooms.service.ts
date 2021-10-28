import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomsRepository: Repository<Classroom>,
    private usersService: UsersService,
  ) {}
  async create(createClassroomDto: CreateClassroomDto, user: any) {
    try {
      const { name, topic } = createClassroomDto;
      const created_by = await this.usersService.findById(user.id);
      let classroom = new Classroom();
      classroom.name = name;
      classroom.topic = topic;
      classroom.created_by = created_by;
      return await this.classroomsRepository.save(classroom);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(userId: number) {
    return await this.classroomsRepository.find({
      where: { created_by: userId },
    });
  }

  async findOne(id: number, userId: number) {
    try {
      return await this.classroomsRepository.findOne({
        where: { id: id, created_by: { id: userId } },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    try {
      const classRoom = await this.classroomsRepository.findOne(id);
      if (!classRoom)
        throw new NotFoundException(`Classroom not found. Id = ${id}`);
      const { name, topic } = updateClassroomDto;
      classRoom.name = name;
      classRoom.topic = topic;
      return await this.classroomsRepository.save(classRoom);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: number) {
    try {
      const classRoom = await this.classroomsRepository.findOne(id);
      if (!classRoom)
        throw new NotFoundException(`Classroom not found. Id = ${id}`);
      return await this.classroomsRepository.remove(classRoom);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
