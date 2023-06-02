import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassDto } from '../_dto/create.class.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.class.findMany();
  }

  async create({ studentId, teacherId, discordLink, status }: CreateClassDto) {
    const createdClass = await this.prisma.class.create({
      data: {
        studentId,
        teacherId,
        status: status,
        link: discordLink,
      },
      select: {
        id: true,
        link: true,
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
    return this.prisma.class.findFirst({
      where: { id },
      select: {
        id: true,
        link: true,
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
    const foundClass = await this.prisma.class.findFirst({ where: { id } });

    if (!foundClass) {
      throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.class.delete({ where: { id } });
  }

  async findByStudent(studentId: number) {
    return this.prisma.class.findMany({
      where: {
        studentId: studentId,
      },
      select: {
        id: true,
        link: true,
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
    return this.prisma.class.findMany({
      where: {
        teacherId: teacherId,
      },
      select: {
        id: true,
        link: true,
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
