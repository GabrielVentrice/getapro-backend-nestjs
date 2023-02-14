import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from '../_dto/create.student.dto';
import * as argon from 'argon2';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.student.findMany();
  }

  async create(dto: CreateStudentDto) {
    const existUser = await this.prisma.student.findUnique({
      where: { email: dto.email },
    });

    console.log('CREATE_USER__DTO', dto);

    if (existUser) {
      throw new HttpException('Email already registred', HttpStatus.CONFLICT);
    }

    // if (!dto.password) {
    //   dto.password = (Math.random() + 1).toString(36).substring(7);
    // }

    const hash = await argon.hash(dto.password);
    delete dto.password;

    const newUser = await this.prisma.student.create({
      data: { ...dto, hash },
    });

    delete newUser.hash;
    delete newUser.hashRt;

    return newUser;
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
