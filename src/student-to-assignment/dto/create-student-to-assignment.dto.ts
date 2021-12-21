import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentToAssignmentDto {
  @ApiProperty()
  studentId: string;

  @ApiProperty()
  assignmentId: number;

  @ApiProperty({ required: false, nullable: true, default: 0 })
  point: number;
}
