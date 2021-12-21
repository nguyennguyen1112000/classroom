import {
  Controller,
  Get,
  StreamableFile,
  Response,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { FileService } from './file.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from './helper/generate-file-name';
import { excelFileFilter } from './helper/excel-file-filter';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/user-to-class/decorator/roles.guard';
import { Roles } from 'src/user-to-class/decorator/roles.decorator';
import { UserRole } from 'src/users/decorator/user.enum';
import { FileType } from './decorator/file.enum';
@ApiTags('files')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('template/studentList')
  getStudentsTemplateFile(
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    let url = '/public/files/StudentListTemplate.xlsx';
    let fileName = 'StudentListTemplate.xlsx';
    const file = createReadStream(join(process.cwd(), url));

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return new StreamableFile(file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('template/mark/:id')
  @Roles(UserRole.TEACHER)
  async getMarkTemplateFile(
    @Response({ passthrough: true }) res,
    @Param('id') classroomId: number,
  ): Promise<StreamableFile> {
    const fileName = 'MarkTemplate.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.fileService.getMarkTemplate(classroomId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('studentList/:id')
  @Roles(UserRole.TEACHER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/files',
        filename: editFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  async uploadStudentsFile(
    @Param('id') classroomId: number,
    @UploadedFile() file,
  ) {
    return await this.fileService.saveStudentsFile(classroomId, file.filename);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('mark/:id/:assignmentId')
  @Roles(UserRole.TEACHER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/files',
        filename: editFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  async uploadMarkFile(
    @Param('id') classroomId: number,
    @Param('assignmentId') assignmentId: number,
    @UploadedFile() file,
  ) {    
    return await this.fileService.saveMarkFile(classroomId, assignmentId, file.filename);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':type/:id')
  @Roles(UserRole.TEACHER)
  @ApiConsumes('multipart/form-data')
  async deleteFile(
    @Param('id') classroomId: number,
    @Param('type') type: FileType,
  ) {
    return await this.fileService.deleteFile(classroomId, type);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('studentList/:id')
  @Roles(UserRole.TEACHER)
  async getStudentList(@Param('id') classroomId: number) {
    return await this.fileService.getStudentList(classroomId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('mark/:id')
  @Roles(UserRole.TEACHER)
  async exportMarkFile(
    @Response({ passthrough: true }) res,
    @Param('id') classroomId: number,
  ): Promise<StreamableFile> {
    const fileName = 'FinalPoint.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.fileService.exportFullMarkFile(classroomId);
  }
}
