import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { GetUser} from '../users/decorator/user.decorator'
import { User } from 'src/users/entities/user.entity';
@ApiTags('classrooms')
@UseGuards(JwtAuthGuard)
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
  
  @Get()
  findAll(@GetUser() user: User) {
    return this.classroomsService.findAll(user.id);
  }
  @Get("/:id/students")
  findAllStudents(@Param("id") id:number) {
    return this.classroomsService.findAllStudents(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    console.log(user);

    return this.classroomsService.findOne(id, user.id);
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
