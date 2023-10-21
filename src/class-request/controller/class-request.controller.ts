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
import { ClassRequestService } from '../service/class-request.service';
import { CreateClassRequestDto } from '../_dto/create.class.dto';
import { DefaultClassRequestResponse } from '../types/response.type';

@Controller('class/request')
@ApiTags('Class Request')
export class ClassRequestController {
  constructor(private classRequestService: ClassRequestService) {}

  @Get()
  @ApiOperation({ summary: 'List all class requests' })
  @ApiOkResponse({ type: DefaultClassRequestResponse, isArray: true })
  findAll() {
    return this.classRequestService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new class request' })
  @ApiCreatedResponse({ type: DefaultClassRequestResponse })
  async create(@Body() createClassDto: CreateClassRequestDto) {
    return await this.classRequestService.create(createClassDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find class request by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the class request to find',
  })
  @ApiOkResponse({ type: DefaultClassRequestResponse })
  async findOne(@Param('id', ParseIntPipe) classId) {
    return await this.classRequestService.findById(classId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete class request by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the class request to be deleted',
  })
  async remove(@Param('id', ParseIntPipe) classId) {
    return await this.classRequestService.remove(classId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'List class requests by user ID' })
  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: 'ID of the student to list class requests for',
  })
  @ApiOkResponse({ type: DefaultClassRequestResponse, isArray: true })
  async findByStudent(@Param('studentId', ParseIntPipe) studentId) {
    return this.classRequestService.findByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'List class requests by teacher ID' })
  @ApiParam({
    name: 'teacherId',
    type: 'number',
    description: 'ID of the teacher to list class requests for',
  })
  @ApiOkResponse({ type: DefaultClassRequestResponse, isArray: true })
  async findByTeacher(@Param('teacherId', ParseIntPipe) teacherId) {
    return this.classRequestService.findByTeacher(teacherId);
  }
}
