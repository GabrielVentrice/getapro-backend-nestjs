import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from '../_dto/create.teacher.dto';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTeacherDiscordIdDto } from '../_dto/update.teacher-discord-id.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.teacher.findMany();
  }

  async create(dto: CreateTeacherDto) {
    const { email, password, name } = dto;

    const existUser = await this.prisma.teacher.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new HttpException('Email already registred', HttpStatus.FORBIDDEN);
    }

    const hash = await argon.hash(password);

    const newUser = await this.prisma.student.create({
      data: { email, name, hash },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return newUser;
  }

  async updateDiscordId(studentId: number, dto: UpdateTeacherDiscordIdDto) {
    const { discordId } = dto;

    return this.prisma.teacher.update({
      where: {
        id: studentId,
      },
      data: { discordId },
      select: {
        id: true,
        name: true,
        email: true,
        discordId: true,
      },
    });
  }

  findById(id: number) {
    return this.prisma.teacher.findFirst({ where: { id } });
  }

  async findOne(email: string) {
    const teacher = await this.prisma.teacher.findFirst({ where: { email } });

    if (!teacher) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return teacher;
  }

  async remove(id: number) {
    const existUser = await this.prisma.teacher.findFirst({ where: { id } });

    if (!existUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.teacher.delete({ where: { id } });
  }
}
