import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { PointStructureService } from './point-structure.service';
import { CreatePointStructureDto } from './dto/create-point-structure.dto';
import { UpdatePointStructureDto } from './dto/update-point-structure.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiTags('point-structure')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('point-structure')
export class PointStructureController {
  constructor(private readonly pointStructureService: PointStructureService) {}

  @Post()
  create(@Body() createPointStructureDto: CreatePointStructureDto) {
    return this.pointStructureService.create(createPointStructureDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePointStructureDto: UpdatePointStructureDto,
  ) {
    return this.pointStructureService.update(+id, updatePointStructureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointStructureService.remove(+id);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body("status") status: boolean,
  ) {
    return this.pointStructureService.updateStatus(id, status);
  }
}
