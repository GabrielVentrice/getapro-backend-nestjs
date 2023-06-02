import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentDto } from '../_dto/create.student.dto';
import { StudentService } from '../service/student.service';
import { DefaultStudentResponse } from '../types/response.type';

@Controller('student')
@ApiTags('Student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'List students' })
  @ApiOkResponse({ type: DefaultStudentResponse, isArray: true })
  findAll() {
    return this.studentService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new student' })
  @ApiCreatedResponse({ type: DefaultStudentResponse })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find student by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the student to find',
  })
  @ApiOkResponse({ type: DefaultStudentResponse })
  async findOne(@Param('id', ParseIntPipe) userId) {
    return await this.studentService.findById(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the student to be deleted',
  })
  async remove(@Param('id', ParseIntPipe) userId) {
    return await this.studentService.remove(userId);
  }
}
