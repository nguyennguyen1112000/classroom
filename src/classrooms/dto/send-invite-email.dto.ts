import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/users/decorator/user.enum';

export class SendInviterEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  classroomId: number;

  @ApiProperty({ enum: ['teacher', 'student'] })
  role: UserRole;
}
