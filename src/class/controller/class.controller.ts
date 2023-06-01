import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateClassDto } from '../_dto/create.class.dto';
import { ClassService } from '../service/class.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('class')
@ApiTags('Class')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return await this.classService.create(createClassDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) classId) {
    return await this.classService.findById(classId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) classId) {
    return await this.classService.remove(classId);
  }

  // TODO: review whether it is better to have the following routes
  // within the student and teacher controllers instead.
  @Get('student/:studentId')
  async findByStudent(@Param('studentId', ParseIntPipe) studentId) {
    return this.classService.findByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  async findByTeacher(@Param('teacherId', ParseIntPipe) teacherId) {
    return this.classService.findByTeacher(teacherId);
  }
}
