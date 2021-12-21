import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, firstName, lastName, password, googleId } = createUserDto;
      const account = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (account)
        throw new BadRequestException('Tài khoản email đã được sử dụng');
      let user = new User();

      if (password) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        user.password = hash;
      } else if (googleId) {
        user.googleId = googleId;
      }

      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      return await this.usersRepository.save(user);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }
  async findById(id: number) {
    return await this.usersRepository.findOne(id);
  }
  async findByStudentId(id: number) {
    return await this.usersRepository.findOne({ where: { studentId: id } });
  }
  async findByGoogleId(id: string) {
    return await this.usersRepository.findOne({ where: { googleId: id } });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User not found. Id = ${id}`);
    const { firstName, lastName, sex, birthday, studentId } = updateUserDto;
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthday = birthday;
    user.sex = sex;
    if (studentId) user.studentId = studentId;
    return await this.usersRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
