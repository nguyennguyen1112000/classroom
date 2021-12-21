import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { UserToClassService } from 'src/user-to-class/user-to-class.service';
import { UserRole } from 'src/users/decorator/user.enum';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { SendInviterEmailDto } from './dto/send-invite-email.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';
import * as fs from 'fs';
import { FileType } from 'src/file/decorator/file.enum';
import { UserToClass } from 'src/user-to-class/entities/user-to-class.entity';
import { CreateUserToClassDto } from 'src/user-to-class/dto/create-user-to-class.dto';
@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomsRepository: Repository<Classroom>,
    private usersService: UsersService,
    private readonly mailService: MailService,
    private userToClassService: UserToClassService,
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
      await this.classroomsRepository.save(classroom);
      let createUserToClassDto = new CreateUserToClassDto();
      createUserToClassDto.classroomId = classroom.id;
      createUserToClassDto.role = UserRole.TEACHER;
      createUserToClassDto.userId = user.id;
      await this.userToClassService.create(createUserToClassDto);
      return classroom;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(userId: number) {
    return await this.classroomsRepository.find({
      where: { created_by: userId },
    });
  }

  async findOne(id: number) {
    try {
      const classroom = await this.classroomsRepository.findOne({
        relations: [
          'created_by',
          'userToClasses',
          'userToClasses.user',
          'pointStructures',
        ],
        where: { id: id },
      });
      if (!classroom)
        throw new NotFoundException(`Classroom not found. Id = ${id}`);
      const users = await classroom.userToClasses.map((obj) => ({
        role: obj.role,
        user: obj.user,
      }));
      const teachers = users.filter((user) => user.role == 'teacher');
      const students = users.filter((user) => user.role == 'student');

      return { ...classroom, teachers, students, userToClasses: undefined };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findByCode(code: string) {
    try {
      const classroom = await this.classroomsRepository.findOne({
        relations: [
          'created_by',
          'userToClasses',
          'userToClasses.user',
          'pointStructures',
        ],
        where: { code: code },
      });
      if (!classroom) throw new NotFoundException();
      const users = await classroom.userToClasses.map((obj) => ({
        role: obj.role,
        user: obj.user,
        studentId: obj.user.studentId,
      }));
      const teachers = users.filter((user) => user.role == 'teacher');
      const students = users.filter((user) => user.role == 'student');
      const pointStructures = [
        ...classroom.pointStructures.sort((a, b) => a.order - b.order),
      ];

      return {
        ...classroom,
        teachers,
        students,
        userToClasses: undefined,
        pointStructures,
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

  async inviteUser(
    sendInviteEmailDto: SendInviterEmailDto,
    userId: number,
    classroomId: number,
  ) {
    const { email, role } = sendInviteEmailDto;
    const classroom = await this.findOne(classroomId);
    const classUrl = `${process.env.WEBBASE_URL}/classrooms/${
      classroom.code
    }?role=${role == UserRole.STUDENT ? 'student' : 'teacher'}`;
    const currentUser = await this.usersService.findById(userId);
    return this.mailService.sendMailInvitation(
      `${currentUser.firstName} ${currentUser.lastName}`,
      email,
      classroom.name,
      classUrl,
      role == UserRole.STUDENT ? 'sinh viên' : 'giảng viên',
    );
  }

  async updateStudentsFile(id: number, fileName: string) {
    try {
      const classRoom = await this.classroomsRepository.findOne(id);
      if (!classRoom)
        throw new NotFoundException(`Classroom not found. Id = ${id}`);
      if (classRoom.studentsFile)
        fs.unlinkSync(`./public/files/${classRoom.studentsFile}`);
      classRoom.studentsFile = fileName;
      await this.classroomsRepository.save(classRoom);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async deleteFile(id: number, type: FileType) {
    try {
      const classRoom = await this.classroomsRepository.findOne(id);
      if (!classRoom)
        throw new NotFoundException(`Classroom not found. Id = ${id}`);
      if (type == FileType.STUDENT_LIST) {
        fs.unlinkSync(`./public/files/${classRoom.studentsFile}`);
        classRoom.studentsFile = null;
      } else if (type == FileType.MARK) {
        fs.unlinkSync(`./public/files/${classRoom.markFile}`);
        classRoom.markFile = null;
      }
      await this.classroomsRepository.save(classRoom);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getPointStructure(id: number) {
    try {
      const classroom = await this.classroomsRepository.findOne({
        relations: ['pointStructures'],
        where: { id: id },
      });
      return classroom.pointStructures;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
