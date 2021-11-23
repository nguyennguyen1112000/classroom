import {
  BadRequestException,
  forwardRef,
  Inject,
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

  async findOne(id: number) {
    try {
      const classroom = await this.classroomsRepository.findOne({
        relations: ['created_by', 'userToClasses', 'userToClasses.user'],
        where: { id: id },
      });
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
        relations: ['created_by', 'userToClasses', 'userToClasses.user'],
        where: { code: code },
      });
      if (!classroom) throw new NotFoundException();
      const users = await classroom.userToClasses.map((obj) => ({
        role: obj.role,
        user: obj.user,
        studentId: obj.studentId,
      }));
      const teachers = users.filter((user) => user.role == 'teacher');
      const students = users.filter((user) => user.role == 'student');

      return { ...classroom, teachers, students, userToClasses: undefined };
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
  
  async inviteUser(sendInviteEmailDto: SendInviterEmailDto, userId: number, classroomId: number) {
    const { email, role } = sendInviteEmailDto;
    const classroom = await this.findOne(classroomId);
    const classUrl = `${process.env.WEBBASE_URL}/classrooms/${Buffer.from(
      classroom.code,
    ).toString('base64')}?role=${
      role == UserRole.STUDENT ? 'student' : 'teacher'
    }`;
    const currentUser = await this.usersService.findById(userId);
    return this.mailService.sendMailInvitation(
      `${currentUser.firstName} ${currentUser.lastName}`,
      email,
      classroom.name,
      classUrl,
      role == UserRole.STUDENT ? 'sinh viên' : 'giảng viên',
    );
  }
}
