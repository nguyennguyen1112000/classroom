import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import * as reader from 'xlsx';
import * as fs from 'fs';
import { FileType } from './decorator/file.enum';
import { join } from 'path';
import { StudentToAssignmentService } from 'src/student-to-assignment/student-to-assignment.service';
import { UpdateStudentToAssignmentDto } from 'src/student-to-assignment/dto/update-student-to-assignment.dto';
import { PointStructureService } from 'src/point-structure/point-structure.service';
@Injectable()
export class FileService {
  constructor(
    private classroomsService: ClassroomsService,
    private studentToAssignmentService: StudentToAssignmentService,
    private pointStructureService: PointStructureService
  ) {}
  async saveStudentsFile(classroomId: number, fileName: string) {
    try {
      const file = reader.readFile(`./public/files/${fileName}`);
      let data = [];
      const sheets = file.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]],
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }
      if (data.length != 0) {
        const firstRow = data[0];
        const properties = Object.getOwnPropertyNames(firstRow);
        if (properties.length != 3) {
          fs.unlinkSync(`./public/files/${fileName}`);
          throw new BadRequestException();
        }
        if (properties[1] != 'MSSV' || properties[2] != 'Tên sinh viên') {
          fs.unlinkSync(`./public/files/${fileName}`);
          throw new BadRequestException();
        }
      }
      return await this.classroomsService.updateStudentsFile(
        classroomId,
        fileName,
      );
    } catch (error) {
      console.log(error.message);

      throw new BadRequestException(error.message);
    }
  }

  async deleteFile(classroomId: number, type: FileType) {
    try {
      return await this.classroomsService.deleteFile(classroomId, type);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateMarkTemplate(classroomId: number) {
    try {
      const filePath = `./public/files/MarkTemplate_${classroomId}.xlsx`;
      const pointStructure = await this.classroomsService.getPointStructure(
        classroomId,
      );
      var wb = reader.utils.book_new();
      if (pointStructure.length > 0) {
        const totalPoint = pointStructure
          .map((obj) => {
            return obj.point;
          })
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
          );
        const structureFields = pointStructure
          .sort((x, y) => x.order - y.order)
          .map((obj) => {
            return `${obj.title} (${obj.point}/${totalPoint})`;
          });
        let objectField = {
          STT: '',
          MSSV: '',
          'Họ và tên': '',
        };
        structureFields.forEach((field) => (objectField[field] = ''));
        let data = [objectField];
        var ws = reader.utils.json_to_sheet(data);
        reader.utils.book_append_sheet(wb, ws, 'Sheet1');
      }
      reader.writeFile(wb, filePath);
      const file = fs.createReadStream(join(process.cwd(), filePath));

      return new StreamableFile(file);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getStudentList(classroomId: number) {
    try {
      const classroom = await this.classroomsService.findOne(classroomId);
      const listPoints =
        await this.studentToAssignmentService.findByClassroomId(classroomId);

      const file = reader.readFile(`./public/files/${classroom.studentsFile}`);
      let data = [];
      const sheets = file.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]],
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }
      const { students, pointStructures } = classroom;
      if (students.length > 0) {
        const totalPoint = pointStructures
          .map((obj) => {
            return obj.point;
          })
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
          );
        data.forEach((obj) => {
          obj['studentId'] = obj['MSSV'];
          obj['studentName'] = obj['Tên sinh viên'];
          obj['MSSV'] = undefined;
          obj['Tên sinh viên'] = undefined;
          obj['detailPoints'] = [];
          const studentId = obj.studentId;
          if (students.length > 0) {
            obj['mapStudent'] = students.some(
              (student) =>
                student.user.studentId != null &&
                student.user.studentId == studentId,
            );
            if (obj['mapStudent']) {
              obj['email'] = students.find(
                (s) => s.user.studentId == studentId,
              ).user.email;
            }
          } else obj['mapStudent'] = false;
          let finalPoint = 0;
          pointStructures.forEach((point) => {
            let detailPoint = null;
            if (pointStructures.length > 0) {
              detailPoint = listPoints.find(
                (l) =>
                  l.assignmentId == point.id && l.studentId == obj['studentId'],
              );
              if (detailPoint) detailPoint = detailPoint.point;
              else detailPoint = 0;
            }
            finalPoint += detailPoint * point.point;
            obj['detailPoints'].push({
              id: point.id,
              maxPoint: point.point,
              point: detailPoint,
              totalPoint,
              order: point.order,
            });
          });
          obj['detailPoints'].sort((x, y) => x.order - y.order);
          obj['finalPoint'] = finalPoint / totalPoint;
        });
      }

      return data;
    } catch (error) {
      console.log(error.message);

      throw new BadRequestException(error.message);
    }
  }

  async getMarkTemplate(classroomId: number) {
    try {
      const filePath = `./public/files/MarkTemplate_${classroomId}.xlsx`;
      const classroom = await this.classroomsService.findOne(classroomId);
      let data = [];
      var wb = reader.utils.book_new();

      if (classroom.studentsFile) {
        const studentsFile = reader.readFile(
          `./public/files/${classroom.studentsFile}`,
        );
        const sheets = studentsFile.SheetNames;

        for (let i = 0; i < sheets.length; i++) {
          const temp = reader.utils.sheet_to_json(
            studentsFile.Sheets[studentsFile.SheetNames[i]],
          );
          temp.forEach((res) => {
            res['Điểm'] = '';
            data.push(res);
          });
        }
      } else {
        data.push({
          MSSV: '',
          'Họ và tên': '',
          Điểm: '',
        });
      }
      var ws = reader.utils.json_to_sheet(data);
      reader.utils.book_append_sheet(wb, ws, 'Sheet1');
      reader.writeFile(wb, filePath);
      const file = fs.createReadStream(join(process.cwd(), filePath));
      return new StreamableFile(file);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async exportFullMarkFile(classroomId: number) {
    try {
      const classroom = await this.classroomsService.findOne(classroomId);
      const listPoints =
        await this.studentToAssignmentService.findByClassroomId(classroomId);

      const file = reader.readFile(`./public/files/${classroom.studentsFile}`);
      let data = [];
      const sheets = file.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]],
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }
      let { students, pointStructures } = classroom;
      pointStructures = pointStructures.sort((x, y) => x.order - y.order);
      if (students.length > 0) {
        const totalPoint = pointStructures
          .map((obj) => {
            return obj.point;
          })
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
          );
        data.forEach((obj) => {
          let finalPoint = 0;
          pointStructures.forEach((point) => {
            let detailPoint = null;
            if (pointStructures.length > 0) {
              detailPoint = listPoints.find(
                (l) => l.assignmentId == point.id && l.studentId == obj['MSSV'],
              );
              if (detailPoint) detailPoint = detailPoint.point;
              else detailPoint = 0;
            }
            finalPoint += detailPoint * point.point;
            obj[`${point.title} (${point.point}/ ${totalPoint})`] = detailPoint;
          });
          obj['Điểm TK'] = finalPoint / totalPoint;
        });
      }
      var wb = reader.utils.book_new();
      var ws = reader.utils.json_to_sheet(data);
      reader.utils.book_append_sheet(wb, ws, 'Sheet1');
      let destFile = `./public/files/finalPoint_${classroomId}`;
      reader.writeFile(wb, destFile);
      const donwloadFile = fs.createReadStream(join(process.cwd(), destFile));
      return new StreamableFile(donwloadFile);
    } catch (error) {
      console.log(error.message);

      throw new BadRequestException(error.message);
    }
  }

  async saveMarkFile(classroomId: number,assignmentId: number, fileName: string) {
    try {
      const file = reader.readFile(`./public/files/${fileName}`);
      let data = [];
      const sheets = file.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]],
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }

      if (data.length != 0) {
        const firstRow = data[0];
        const properties = Object.getOwnPropertyNames(firstRow);
        if (properties.length != 4) {
          fs.unlinkSync(`./public/files/${fileName}`);
          throw new BadRequestException();
        }
        if (
          properties[1] != 'MSSV' ||
          properties[2] != 'Tên sinh viên' ||
          properties[3] != 'Điểm'
        ) {
          fs.unlinkSync(`./public/files/${fileName}`);
          throw new BadRequestException();
        }
      }
      let updateStudentToAssignment = new UpdateStudentToAssignmentDto();
      updateStudentToAssignment.assignmentId = assignmentId;
      updateStudentToAssignment.studentIds = data.map((obj) => {
        return String(obj['MSSV']);
      });

      updateStudentToAssignment.points = data.map((obj) => {
        return Number(obj['Điểm']);
      });
      await this.pointStructureService.updateFile(assignmentId, fileName)
      return await this.studentToAssignmentService.updateMarks(
        classroomId,
        updateStudentToAssignment,
      );
    } catch (error) {
      console.log(error.message);

      throw new BadRequestException(error.message);
    }
  }
}
