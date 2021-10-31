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
      const { name, topic, description } = createClassroomDto;
      const created_by = await this.usersService.findById(user.id);
      let classroom = new Classroom();
      classroom.name = name;
      classroom.topic = topic;
      classroom.description = description;
      classroom.code = (Math.random() + 1).toString(36).substring(7);
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

  async findAllStudents(id: number) {
    try {
      const classroom = await this.classroomsRepository.findOne({
        where: { id: id },
        relations: ['students'],
      });
      const { students } = classroom;
      return {
        students: students,
        numOfStudents: students.length,
      };
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
  async addStudent(code: string, studentId: number) {
    try {
      const classroom = await this.classroomsRepository.findOne({
        where: { code: code },
      });
      if (classroom) {
        const student = await this.usersService.findById(studentId);
        if (!student)
          throw new BadRequestException(
            `Student Id is not valid. Id =${studentId}`,
          );
        classroom.students = [...classroom.students, student];
        await this.classroomsRepository.save(classroom);
        return true;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
