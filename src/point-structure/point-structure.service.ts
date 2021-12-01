import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { Repository } from 'typeorm';
import { CreatePointStructureDto } from './dto/create-point-structure.dto';
import { UpdatePointStructureDto } from './dto/update-point-structure.dto';
import { PointStructure } from './entities/point-structure.entity';

@Injectable()
export class PointStructureService {
  constructor(
    @InjectRepository(PointStructure)
    private pointStructureRepository: Repository<PointStructure>,
    private classroomsService: ClassroomsService,
  ) {}
  async create(createPointStructureDto: CreatePointStructureDto) {
    try {
      const { classroomId, title, point, order } = createPointStructureDto;
      const classroom = await this.classroomsService.findOne(classroomId);
      if (!classroom) throw new NotFoundException();
      const points = await this.pointStructureRepository.find({
        order: { order: 'ASC' },
        where: { classroom: classroom },
      });
      const pointStructure = new PointStructure();
      pointStructure.title = title;
      pointStructure.point = point;
      pointStructure.classroom = classroom;
      if (points.length == 0) pointStructure.order = 0;
      else if(order) pointStructure.order = order;
      else pointStructure.order = points[0].order + 1;
      return await this.pointStructureRepository.save(pointStructure);
    } catch (error) {
      console.log('Err', error);
    }
  }

  async update(id: number, updatePointStructureDto: UpdatePointStructureDto) {
    try {
      const { title, point, order } = updatePointStructureDto;
      const pointStructure = await this.pointStructureRepository.findOne(id);
      if (!pointStructure) throw new NotFoundException();
      pointStructure.title = title;
      pointStructure.point = point;
      pointStructure.order = order;

      return await this.pointStructureRepository.save(pointStructure);
    } catch (error) {
      console.log('Err', error);
    }
  }

  async remove(id: number) {
    try {
      let pointStructure = await this.pointStructureRepository.findOne(id);
      if (!pointStructure) throw new NotFoundException();
      await this.pointStructureRepository.remove(pointStructure);
    } catch (error) {
      console.log('Err', error);
    }
  }
}
