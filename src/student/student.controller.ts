import { Controller, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }
}
