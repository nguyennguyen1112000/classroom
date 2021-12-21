import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { UserToClassModule } from 'src/user-to-class/user-to-class.module';
import { StudentToAssignmentModule } from 'src/student-to-assignment/student-to-assignment.module';
import { PointStructureModule } from 'src/point-structure/point-structure.module';

@Module({
  imports: [ClassroomsModule, UserToClassModule, StudentToAssignmentModule, PointStructureModule],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
