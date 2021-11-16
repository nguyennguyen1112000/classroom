import { Module } from '@nestjs/common';
import { UserToClassService } from './user-to-class.service';
import { UserToClassController } from './user-to-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToClass } from './entities/user-to-class.entity';
import { UsersModule } from 'src/users/users.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserToClass]), UsersModule, ClassroomsModule],
  controllers: [UserToClassController],
  providers: [UserToClassService],
})
export class UserToClassModule {}
