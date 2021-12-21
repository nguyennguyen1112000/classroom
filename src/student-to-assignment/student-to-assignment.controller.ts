import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { StudentToAssignmentService } from './student-to-assignment.service';
import { CreateStudentToAssignmentDto } from './dto/create-student-to-assignment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/user-to-class/decorator/roles.decorator';
import { UserRole } from 'src/users/decorator/user.enum';
import { GetUser } from 'src/users/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@ApiTags('student-to-assignment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('student-to-assignment')
export class StudentToAssignmentController {
  constructor(
    private readonly studentToAssignmentService: StudentToAssignmentService,
    private readonly userService: UsersService,
  ) {}

  @Post(':id')
  @Roles(UserRole.TEACHER)
  update(
    @Param('id') classroomId: number,
    @Body() createStudentToAssignmentDto: CreateStudentToAssignmentDto,
  ) {
    return this.studentToAssignmentService.update(
      classroomId,
      createStudentToAssignmentDto,
    );
  }

  @Post('many/:id')
  @Roles(UserRole.TEACHER)
  updateMany(
    @Param('id') classroomId: number,
    @Body() createStudentToAssignmentsDto: CreateStudentToAssignmentDto[],
  ) {
    return this.studentToAssignmentService.updateMany(
      classroomId,
      createStudentToAssignmentsDto,
    );
  }
  @Get(':id')
  @Roles(UserRole.TEACHER)
  findAllByClassroom(@Param('id') classroomId: number) {
    return this.studentToAssignmentService.findByClassroomId(classroomId);
  }

  @Get('myPoints/:id')
  @Roles(UserRole.STUDENT)
  async findAll(@GetUser() user: User, @Param('id') classroomId: number) {
    const currentUser = await this.userService.findOne(user.email);
    if (currentUser)
      return this.studentToAssignmentService.getAll(
        currentUser.studentId,
        classroomId,
      );
  }
}
