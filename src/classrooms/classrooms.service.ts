import { BadRequestException, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} classroom`;
  }

  update(id: number, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} classroom`;
  }
}
