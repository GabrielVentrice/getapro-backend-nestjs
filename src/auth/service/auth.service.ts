import { Injectable } from '@nestjs/common';
import { StudentService } from 'src/student/service/student.service';
import { AuthUser } from '../_dto/auth.user.dto';

@Injectable()
export class AuthService {
  constructor(private studentService: StudentService) {}

  async validateStudent(authUser: AuthUser) {
    const student = await this.studentService.findOne(authUser.email);

    if (student && student.password === authUser.password) {
      const { password, ...result } = student;

      return result;
    }

    return null;
  }
}
