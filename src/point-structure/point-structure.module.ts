import { Module } from '@nestjs/common';
import { PointStructureService } from './point-structure.service';
import { PointStructureController } from './point-structure.controller';
import { PointStructure } from './entities/point-structure.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointStructure]),
    ClassroomsModule
  ],
  controllers: [PointStructureController],
  providers: [PointStructureService],
})
export class PointStructureModule {}
