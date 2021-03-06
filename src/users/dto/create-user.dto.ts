import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ default: '' })
  firstName: string;

  @ApiProperty({ default: '' })
  lastName: string;

  @ApiProperty({ nullable: true })
  googleId: string;

  @ApiProperty({ required: false, nullable: true })
  imageUrl: string;

  @ApiProperty()
  password: string;
}
