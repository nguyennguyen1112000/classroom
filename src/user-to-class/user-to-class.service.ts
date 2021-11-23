import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { UserRole } from 'src/users/decorator/user.enum';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateUserToClassDto } from './dto/create-user-to-class.dto';
import { UpdateUserToClassDto } from './dto/update-user-to-class.dto';
import { UserToClass } from './entities/user-to-class.entity';

@Injectable()
export class UserToClassService {
  constructor(
    @InjectRepository(UserToClass)
    private userToClassRepository: Repository<UserToClass>,
  ) {}
  async create(createUserToClassDto: CreateUserToClassDto) {
    const { userId, classroomId, role } = createUserToClassDto;
    const userToClasses = await this.userToClassRepository.findOne({
      where: { userId: userId, classroomId: classroomId },
    });
    if (userToClasses) return;
    const newUserToClass = new UserToClass();
    newUserToClass.classroomId = classroomId;
    newUserToClass.userId = userId;
    newUserToClass.role = role;
    this.userToClassRepository.save(newUserToClass);
    return newUserToClass;
  }

  findAllByRole(classroomId: number, role: UserRole) {
    const userToClasses = this.userToClassRepository.find({
      where: { role: role, classroomId: classroomId },
    });
    return userToClasses;
  }
  async findAllByRoles(classroomId: number, roles: UserRole[]) {
    const userToClasses = await this.userToClassRepository.find({
      where: { classroomId: classroomId },
    });      
    return userToClasses.filter((userClass) => roles.includes(userClass.role));
  }

  findOne(id: number) {
    return `This action returns a #${id} userToClass`;
  }

  update(id: number, updateUserToClassDto: UpdateUserToClassDto) {
    return `This action updates a #${id} userToClass`;
  }
  async mapStudentId(updateUserToClassDto: UpdateUserToClassDto) {
    const { userId, classroomId, studentId } = updateUserToClassDto;
    const userToClasses = await this.userToClassRepository.findOne({
      where: { userId, classroomId },
    });
    if (!userToClasses) throw new NotFoundException();
    userToClasses.studentId = studentId;
    return await this.userToClassRepository.save(userToClasses);
  }
  remove(id: number) {
    return `This action removes a #${id} userToClass`;
  }
}
