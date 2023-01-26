import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from '../_dto/create.student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.student.findMany();
  }

  async create(createStudentDto: CreateStudentDto) {
    const existUser = await this.prisma.student.findUnique({
      where: { email: createStudentDto.email },
    });

    console.log(existUser);

    if (existUser) {
      throw new HttpException('Email already registred', HttpStatus.CONFLICT);
    }

    if (!createStudentDto.password) {
      createStudentDto.password = (Math.random() + 1).toString(36).substring(7);
    }

    return this.prisma.student.create({ data: createStudentDto });
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
