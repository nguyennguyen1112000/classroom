import { PartialType } from '@nestjs/swagger';
import { CreateUserToClassDto } from './create-user-to-class.dto';

export class UpdateUserToClassDto extends PartialType(CreateUserToClassDto) {}
