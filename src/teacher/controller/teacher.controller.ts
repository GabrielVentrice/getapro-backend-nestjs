import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTeacherDto } from '../_dto/create.teacher.dto';
import { TeacherService } from '../service/teacher.service';

@Controller('teacher')
@ApiTags('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return await this.teacherService.create(createTeacherDto);
  }

  @Get(':id')
  async findOne(@Param() params) {
    console.log(params.id);

    return await this.teacherService.findById(parseInt(params.id, 10));
  }

  @Delete(':id')
  async remove(@Param() params) {
    return await this.teacherService.remove(parseInt(params.id, 10));
  }
}
