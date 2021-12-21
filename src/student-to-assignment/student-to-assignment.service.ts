import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointStructureService } from 'src/point-structure/point-structure.service';
import { Repository } from 'typeorm';
import { CreateStudentToAssignmentDto } from './dto/create-student-to-assignment.dto';
import { UpdateStudentToAssignmentDto } from './dto/update-student-to-assignment.dto';
import { StudentToAssignment } from './entities/student-to-assignment.entity';

@Injectable()
export class StudentToAssignmentService {
  constructor(
    @InjectRepository(StudentToAssignment)
    private userToAssignmentRepository: Repository<StudentToAssignment>,
    private pointStructureService: PointStructureService,
  ) {}
  async update(
    classroomId: number,
    createUserToAssignmentDto: CreateStudentToAssignmentDto,
  ) {
    const { studentId, assignmentId, point } = createUserToAssignmentDto;
    const userToAssignment = await this.userToAssignmentRepository.findOne({
      where: { studentId: studentId, assignmentId: assignmentId },
    });

    if (userToAssignment) {
      userToAssignment.point = point;
      return await this.userToAssignmentRepository.save(userToAssignment);
    } else {
      const newItem = new StudentToAssignment();
      newItem.studentId = studentId;
      newItem.assignmentId = assignmentId;
      newItem.point = point;
      newItem.classroomId = classroomId;
      return await this.userToAssignmentRepository.save(newItem);
    }
  }

  async updateMany(
    classroomId: number,
    createUserToAssignmentsDto: CreateStudentToAssignmentDto[],
  ) {
    for (let i = 0; i < createUserToAssignmentsDto.length; i++) {
      await this.update(classroomId, createUserToAssignmentsDto[i]);
    }
  }

  async findByClassroomId(id: number) {
    const studentToAssignment = await this.userToAssignmentRepository.find({
      where: { classroomId: id },
    });
    return studentToAssignment;
  }

  async getAll(studentId: string, classroomId: number) {
    const studentToAssignment = await this.userToAssignmentRepository.find({
      where: { studentId, classroomId },
    });
    let pointStructure = await this.pointStructureService.findAllByClassroom(
      classroomId,
    );
    let response = pointStructure.map((obj) => {
      return {
        id: obj.id,
        title: obj.title,
        maxPoint: obj.point,
        detailPoint: null,
        isPublic: obj.isPublic,
      };
    });
    let totalPoint = 0;
    let totalMaxPoint = 0;
    let finalPoint = 0;
    response.forEach((obj, index) => {
      totalMaxPoint += obj.maxPoint;
      let assignment = studentToAssignment.find(
        (x) => x.assignmentId == obj.id && obj.isPublic,
      );
      if (assignment) {
        obj.detailPoint = assignment.point;
        totalPoint += obj.maxPoint * obj.detailPoint;
      }
      if (index == response.length - 1) finalPoint = totalPoint / totalMaxPoint;
    });
    response.push({
      id: null,
      title: 'Điểm tổng kết',
      maxPoint: null,
      detailPoint: finalPoint,
      isPublic: true,
    });
    return response;
  }

  async updateMark(
    classroomId,
    assignmentId: number,
    studentId: string,
    point: number,
  ) {
    try {
      const studentToAssignment = await this.userToAssignmentRepository.findOne(
        {
          where: { assignmentId, studentId },
        },
      );
      if (!studentToAssignment) {
        const createStudentToAssginmentDto = new CreateStudentToAssignmentDto();
        createStudentToAssginmentDto.studentId = studentId;
        createStudentToAssginmentDto.point = point;
        createStudentToAssginmentDto.assignmentId = assignmentId;
        await this.update(classroomId, createStudentToAssginmentDto);
      } else {
        studentToAssignment.point = point;
        await this.userToAssignmentRepository.save(studentToAssignment);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateMarks(
    classroomId,
    updateStudentToAssignment: UpdateStudentToAssignmentDto,
  ) {
    try {
      const { assignmentId, studentIds, points } = updateStudentToAssignment;

      for (let i = 0; i < studentIds.length; i++)
        await this.updateMark(
          classroomId,
          assignmentId,
          studentIds[i],
          points[i],
        );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
