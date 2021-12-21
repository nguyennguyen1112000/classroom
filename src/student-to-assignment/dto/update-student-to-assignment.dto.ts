import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentToAssignmentDto {
  @ApiProperty({ type: [String] })
  studentIds: string[];

  @ApiProperty({ type: [Number] })
  points: number[];

  @ApiProperty()
  assignmentId: number;
}
