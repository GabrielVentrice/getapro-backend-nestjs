import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create.student.dto';
import { StudentService } from './student.service';

@Controller('student')
@ApiTags('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get(':id')
  findOne(@Param() params) {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }
}
