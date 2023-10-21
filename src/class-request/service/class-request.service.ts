import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassRequestDto } from '../_dto/create.class.dto';

@Injectable()
export class ClassRequestService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.classRequest.findMany();
  }

  async create({ studentId, teacherId }: CreateClassRequestDto) {
    const createdClass = await this.prisma.classRequest.create({
      data: {
        studentId,
        teacherId,
      },
      select: {
        id: true,
        student: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
    });

    return createdClass;
  }

  findById(id: number) {
    return this.prisma.classRequest.findFirst({
      where: { id },
      select: {
        id: true,
        student: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const foundClass = await this.prisma.classRequest.findFirst({
      where: { id },
    });

    if (!foundClass) {
      throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.classRequest.delete({ where: { id } });
  }

  async findByStudent(studentId: number) {
    return this.prisma.classRequest.findMany({
      where: {
        studentId: studentId,
      },
      select: {
        id: true,
        student: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findByTeacher(teacherId: number) {
    return this.prisma.classRequest.findMany({
      where: {
        teacherId: teacherId,
      },
      select: {
        id: true,
        student: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
