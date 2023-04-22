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
  async create(@Body() CreateTeacherDto: CreateTeacherDto) {
    return await this.teacherService.create(CreateTeacherDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) userId) {
    return await this.teacherService.findById(userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) userId) {
    return await this.teacherService.remove(userId);
  }
}
