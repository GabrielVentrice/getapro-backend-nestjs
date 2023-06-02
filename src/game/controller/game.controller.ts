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
import { CreateGameDto } from '../_dto/create.game.dto';
import { GameService } from '../service/game.service';
import { DefaultGameResponse } from '../types/response.type';

@Controller('game')
@ApiTags('Game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  @ApiOperation({ summary: 'List all games' })
  @ApiOkResponse({ type: DefaultGameResponse, isArray: true })
  findAll() {
    return this.gameService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new game' })
  @ApiCreatedResponse({ type: DefaultGameResponse })
  async create(@Body() createStudentDto: CreateGameDto) {
    return await this.gameService.create(createStudentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find game by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the game to find',
  })
  @ApiOkResponse({ type: DefaultGameResponse })
  async findOne(@Param('id', ParseIntPipe) userId) {
    return await this.gameService.findById(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete game by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the game to be deleted',
  })
  async remove(@Param('id', ParseIntPipe) userId) {
    return await this.gameService.remove(userId);
  }
}
