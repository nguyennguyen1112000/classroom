import { Query } from "@nestjs/common";
import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { UserRole } from "../decorator/user.enum";

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ default: '' })
  firstName: string;

  @ApiProperty({ default: '' })
  lastName: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['Admin', 'Teacher', 'Student'] })
  role: UserRole;
}
