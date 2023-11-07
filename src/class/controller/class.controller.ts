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
import { CreateClassDto } from '../_dto/create.class.dto';
import { ClassService } from '../service/class.service';
import { DefaultClassResponse } from '../types/response.type';
import { DiscordService } from 'src/discord/discord.service';

@Controller('class')
@ApiTags('Class')
export class ClassController {
  constructor(
    private classService: ClassService,
    private discordService: DiscordService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all classes' })
  @ApiOkResponse({ type: DefaultClassResponse, isArray: true })
  findAll() {
    return this.classService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new class' })
  @ApiCreatedResponse({ type: DefaultClassResponse })
  async create(@Body() createClassDto: CreateClassDto) {
    const createdClass = await this.classService.create(createClassDto);

    const {
      student: { name: studentName },
      teacher: { name: teacherName },
    } = createdClass;

    const { textChannel } = await this.discordService.createClassChannel(
      `${studentName} + ${teacherName}`,
    );

    console.log(textChannel.url);

    return this.classService.upsertClassLink(createdClass.id, textChannel.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find class by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the class to find',
  })
  @ApiOkResponse({ type: DefaultClassResponse })
  async findOne(@Param('id', ParseIntPipe) classId) {
    return await this.classService.findById(classId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete class by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the class to be deleted',
  })
  async remove(@Param('id', ParseIntPipe) classId) {
    return await this.classService.remove(classId);
  }

  // TODO: review whether it is better to have the following routes
  // within the student and teacher controllers instead.
  @Get('student/:studentId')
  @ApiOperation({ summary: 'List classes by user ID' })
  @ApiParam({
    name: 'studentId',
    type: 'number',
    description: 'ID of the student to list classes for',
  })
  @ApiOkResponse({ type: DefaultClassResponse, isArray: true })
  async findByStudent(@Param('studentId', ParseIntPipe) studentId) {
    return this.classService.findByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'List classes by teacher ID' })
  @ApiParam({
    name: 'teacherId',
    type: 'number',
    description: 'ID of the teacher to list classes for',
  })
  @ApiOkResponse({ type: DefaultClassResponse, isArray: true })
  async findByTeacher(@Param('teacherId', ParseIntPipe) teacherId) {
    return this.classService.findByTeacher(teacherId);
  }
}
