import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from '../_dto/create.teacher.dto';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.teacher.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
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

    const newUser = await this.prisma.teacher.create({
      data: { email, name, hash },
    });

    delete newUser.hash;
    delete newUser.hashRt;

    return newUser;
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
