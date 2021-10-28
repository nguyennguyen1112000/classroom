import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ default: '' })
  firstName: string;

  @ApiProperty({ default: '' })
  lastName: string;

  @ApiProperty()
  password: string;
}
