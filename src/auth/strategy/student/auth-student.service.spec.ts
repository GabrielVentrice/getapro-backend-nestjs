import { TestingModule, Test } from '@nestjs/testing';
import { Student } from '@prisma/client';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStudentDto } from '../../../student/_dto/create.student.dto';
import { AuthStudentService } from '../../service/student/auth-student.service';
import { Tokens } from '../../types/tokens.type';
import { decode } from 'jsonwebtoken';

const user: CreateStudentDto = {
  email: 'test@gmail.com',
  password: 'super-secret-password',
  name: 'Gabriel',
};

const student: Pick<Student, 'id' | 'email'> = {
  id: 1,
  email: 'test@gmail.com',
};

describe('Auth Student flow', () => {
  let prisma: PrismaService;
  let authStudentService: AuthStudentService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authStudentService = moduleRef.get(AuthStudentService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('Singup', () => {
    it('Should throw duplicate error', async () => {
      let tokens: Tokens | undefined;

      try {
        await authStudentService.singup(user);
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });
  });

  describe('Signin', () => {});

  describe('Logout', () => {
    it('Should pass if call to non existent user', async () => {
      const result = await authStudentService.logout(4);
      expect(result).toBeDefined();
    });
  });

  describe('Refresh', () => {
    it('Should throw with no exist user', async () => {
      let tokens: Tokens | undefined;
      try {
        tokens = await authStudentService.refreshTokens(1, '');
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });
  });
});
