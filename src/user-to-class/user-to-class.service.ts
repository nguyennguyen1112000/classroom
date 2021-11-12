import { Injectable } from '@nestjs/common';
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
    private usersService: UsersService,
    private classroomsService: ClassroomsService,
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
    this.userToClassRepository.save(newUserToClass);
    return newUserToClass;
  }

  findAllByRole(classroomId: number, role: UserRole) {
    const userToClasses = this.userToClassRepository.find({
      where: { role: role, classroomId:classroomId },
    });
    return `This action returns all userToClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userToClass`;
  }

  update(id: number, updateUserToClassDto: UpdateUserToClassDto) {
    return `This action updates a #${id} userToClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} userToClass`;
  }
}
