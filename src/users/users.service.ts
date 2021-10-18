import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, firstName, lastName, password } = createUserDto;
      let user = new User();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
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
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
