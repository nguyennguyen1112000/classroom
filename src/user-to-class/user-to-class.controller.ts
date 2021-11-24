import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserToClassService } from './user-to-class.service';
import { CreateUserToClassDto } from './dto/create-user-to-class.dto';
import { UpdateUserToClassDto } from './dto/update-user-to-class.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/users/decorator/user.enum';
import { GetUser } from 'src/users/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('user-classroom')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('user-to-class')
export class UserToClassController {
  constructor(private readonly userToClassService: UserToClassService) {}

  @Post()
  create(@Body() createUserToClassDto: CreateUserToClassDto) {
    return this.userToClassService.create(createUserToClassDto);
  }

  @Get(':classroomId/:role')
  findAllByRole(
    @Param('classroomId') classroomId: number,
    @Param('role') role: UserRole,
  ) {
    return this.userToClassService.findAllByRole(classroomId, role);
  }
  @Get("/user")
  findAllByUser(@GetUser() user: User) {
    return this.userToClassService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userToClassService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserToClassDto: UpdateUserToClassDto,
  ) {
    return this.userToClassService.update(+id, updateUserToClassDto);
  }
  @Put('mapStudentId')
  mapStudentId(@Body() updateUserToClassDto: UpdateUserToClassDto) {
    return this.userToClassService.mapStudentId(updateUserToClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userToClassService.remove(+id);
  }
}
