import { PartialType } from '@nestjs/swagger';
import { CreatePointStructureDto } from './create-point-structure.dto';

export class UpdatePointStructureDto extends PartialType(CreatePointStructureDto) {}
