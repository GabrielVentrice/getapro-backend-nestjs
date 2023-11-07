import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTeacherDto } from '../_dto/create.teacher.dto';
import { TeacherService } from '../service/teacher.service';
import { DefaultTeacherResponse } from '../types/response.type';
import { UpdateTeacherDiscordIdDto } from '../_dto/update.teacher-discord-id.dto';

@Controller('teacher')
@ApiTags('Teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: 'List teachers' })
  @ApiOkResponse({ type: DefaultTeacherResponse, isArray: true })
  findAll() {
    return this.teacherService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new teacher' })
  @ApiOkResponse({ type: DefaultTeacherResponse })
  async create(@Body() CreateTeacherDto: CreateTeacherDto) {
    return await this.teacherService.create(CreateTeacherDto);
  }

  @Put(':id/discord')
  @ApiOperation({ summary: "Update teacher's discord ID" })
  @ApiOkResponse({ type: DefaultTeacherResponse })
  async updateTeacherDiscordId(
    @Param('id', ParseIntPipe) teacherId: number,
    @Body() updateTeacherDiscordIdDto: UpdateTeacherDiscordIdDto,
  ) {
    return this.teacherService.updateDiscordId(
      teacherId,
      updateTeacherDiscordIdDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find teacher by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the teacher to find',
  })
  @ApiOkResponse({ type: DefaultTeacherResponse })
  async findOne(@Param('id', ParseIntPipe) userId) {
    return await this.teacherService.findById(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete teacher by its ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the teacher to be deleted',
  })
  async remove(@Param('id', ParseIntPipe) userId) {
    return await this.teacherService.remove(userId);
  }
}
