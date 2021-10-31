import { BadRequestException, Injectable } from '@nestjs/common';
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
      const { email, firstName, lastName, password, role } = createUserDto;
      const account = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (account) throw new BadRequestException('Email already in use.');
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      let user = new User();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = hash;
      user.role = role;
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
  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
