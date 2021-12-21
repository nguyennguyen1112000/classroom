import { Module } from '@nestjs/common';
import { StudentToAssignmentService } from './student-to-assignment.service';
import { StudentToAssignmentController } from './student-to-assignment.controller';
import { StudentToAssignment } from './entities/student-to-assignment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PointStructureModule } from 'src/point-structure/point-structure.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentToAssignment]), UsersModule, PointStructureModule],
  controllers: [StudentToAssignmentController],
  providers: [StudentToAssignmentService],
  exports:[StudentToAssignmentService]
})
export class StudentToAssignmentModule {}
