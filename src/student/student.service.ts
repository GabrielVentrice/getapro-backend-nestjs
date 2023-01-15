import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create.student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.student.findMany();
  }

  create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({ data: createStudentDto });
  }
}
