import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from '../_dto/create.game.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.game.findMany();
  }

  async create(dto: CreateGameDto) {
    const { name } = dto;

    const createdGame = await this.prisma.game.create({
      data: { name },
    });

    return createdGame;
  }

  findById(id: number) {
    return this.prisma.game.findFirst({ where: { id } });
  }

  async findOne(name: string) {
    const gameFound = await this.prisma.game.findFirst({ where: { name } });

    if (!gameFound) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return gameFound;
  }

  async remove(id: number) {
    const foundGame = await this.prisma.game.findFirst({ where: { id } });

    if (!foundGame) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.game.delete({ where: { id } });
  }
}
