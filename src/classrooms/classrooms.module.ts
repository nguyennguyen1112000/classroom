import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { UserToClassModule } from 'src/user-to-class/user-to-class.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Classroom]),
    UsersModule,
    MailModule,
    UserToClassModule,
  ],
  controllers: [ClassroomsController],
  providers: [
    ClassroomsService,
  ],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
