import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from '../_dto/create.student.dto';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStudentDiscordIdDto } from '../_dto/update.student-discord-id.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.student.findMany();
  }

  async create(dto: CreateStudentDto) {
    const { email, password, name } = dto;

    const existUser = await this.prisma.student.findUnique({
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

  async updateDiscordId(studentId: number, dto: UpdateStudentDiscordIdDto) {
    const { discordId } = dto;

    return this.prisma.student.update({
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
    return this.prisma.student.findFirst({ where: { id } });
  }

  async findOne(email: string) {
    const student = await this.prisma.student.findFirst({ where: { email } });

    if (!student) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return student;
  }

  async remove(id: number) {
    const existUser = await this.prisma.student.findFirst({ where: { id } });

    if (!existUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.student.delete({ where: { id } });
  }
}
