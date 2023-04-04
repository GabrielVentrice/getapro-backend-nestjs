import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from '../_dto/create.student.dto';
import { StudentService } from '../service/student.service';

@Controller('student')
@ApiTags('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) userId) {
    return await this.studentService.findById(userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) userId) {
    return await this.studentService.remove(userId);
  }
}
