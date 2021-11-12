import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/users/decorator/user.enum";

export class CreateUserToClassDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  classroomId: number;

  @ApiProperty({ enum: ['teacher', 'student'] })
  role: UserRole;
}
