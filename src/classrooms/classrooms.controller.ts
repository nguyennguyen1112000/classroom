import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { GetUser } from '../users/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { SendInviterEmailDto } from './dto/send-invite-email.dto';
import { UserRole } from 'src/users/decorator/user.enum';
import { UsersService } from 'src/users/users.service';
@ApiTags('classrooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('classrooms')
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) {}
  @Post()
  create(
    @Body() createClassroomDto: CreateClassroomDto,
    @GetUser() user: User,
  ) {
    return this.classroomsService.create(createClassroomDto, user);
  }
  @Post('invite')
  async inviteUser(
    @Body() sendInviteEmailDto: SendInviterEmailDto,
    @GetUser() user: User,
  ) {
    const { email, classroomId, role } = sendInviteEmailDto;
    const classroom = await this.classroomsService.findOne(classroomId);
    const classUrl = `${process.env.WEBBASE_URL}/classrooms/${Buffer.from(
      classroom.code,
    ).toString('base64')}?role=${
      role == UserRole.STUDENT ? 'student' : 'teacher'
    }`;
    const currentUser = await this.usersService.findById(user.id);    
    return this.mailService.sendMailInvitation(
      `${currentUser.firstName} ${currentUser.lastName}`,
      email,
      classroom.name,
      classUrl,
      role == UserRole.STUDENT ? 'sinh viên' : 'giảng viên',
    );
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.classroomsService.findAll(user.id);
  }
  // @Get("/:id/students")
  // findAllStudents(@Param("id") id:number) {
  //   return this.classroomsService.findAllStudents(id);
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.classroomsService.findOne(id);
  }
  @Get('/code/:id')
  findByCode(@Param('id') id: string) {
    return this.classroomsService.findByCode(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.classroomsService.remove(id);
  }
}
