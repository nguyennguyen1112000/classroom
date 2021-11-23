import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { GetUser } from '../users/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SendInviterEmailDto } from './dto/send-invite-email.dto';
import { UserRole } from 'src/users/decorator/user.enum';
import { Roles } from 'src/user-to-class/decorator/roles.decorator';
import { RolesGuard } from 'src/user-to-class/decorator/roles.guard';

@ApiTags('classrooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}
  @Post()
  create(
    @Body() createClassroomDto: CreateClassroomDto,
    @GetUser() user: User,
  ) {
    return this.classroomsService.create(createClassroomDto, user);
  }
  @Post('invite/:id')
  @Roles(UserRole.TEACHER)
  async inviteUser(
    @Param('id') id: number,
    @Body() sendInviteEmailDto: SendInviterEmailDto,
    @GetUser() user: User,
  ) {
    await this.classroomsService.inviteUser(sendInviteEmailDto, user.id, id);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.classroomsService.findAll(user.id);
  }

  @Get(':id')
  @Roles(UserRole.TEACHER, UserRole.STUDENT)
  findOne(@Param('id') id: number) {
    return this.classroomsService.findOne(id);
  }
  @Get('/code/:id')
  @Roles(UserRole.TEACHER, UserRole.STUDENT)
  findByCode(@Param('id') id: string) {
    return this.classroomsService.findByCode(id);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER)
  update(
    @Param('id') id: number,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @Roles(UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.classroomsService.remove(id);
  }
}
