import { ApiProperty } from "@nestjs/swagger";

export class CreatePointStructureDto {
  @ApiProperty()
  classroomId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  point: number;

  @ApiProperty()
  order: number;
}
