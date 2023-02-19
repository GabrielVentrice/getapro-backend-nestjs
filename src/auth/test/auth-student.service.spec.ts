import { TestingModule, Test } from '@nestjs/testing';
import { Student } from '@prisma/client';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from '../../student/_dto/create.student.dto';
import { AuthStudentService } from '../service/auth-student.service';
import { Tokens } from '../types/tokens.type';

const user: CreateStudentDto = {
  email: 'test@gmail.com',
  password: 'super-secret-password',
  name: 'Gabriel',
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
    beforeAll(async () => {
      await prisma.cleanDatabase();
    });

    it('Should signup', async () => {
      const tokens = await authStudentService.singup(user);

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

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

  describe('Signin', () => {
    beforeAll(async () => {
      await prisma.cleanDatabase();
    });

    it('Should throw if now existing user', async () => {
      let tokens: Tokens | undefined;
      try {
        tokens = await authStudentService.signinLocalStudent(user);
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('Should signin', async () => {
      await authStudentService.singup(user);

      const tokens = await authStudentService.signinLocalStudent(user);

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

    it('Should throw if wrong password', async () => {
      let tokens: Tokens | undefined;

      try {
        tokens = await authStudentService.signinLocalStudent({
          email: user.email,
          password: user.password + '@',
        });
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });
  });

  describe('Logout', () => {
    beforeAll(async () => {
      await prisma.cleanDatabase();
    });

    it('Should pass if call to non existent user', async () => {
      const result = await authStudentService.logout(4);
      expect(result).toBeDefined();
    });

    it('Should Logout', async () => {
      await authStudentService.singup(user);

      let userFromDb: Student | null;

      userFromDb = await prisma.student.findFirst({
        where: { email: user.email },
      });

      expect(userFromDb?.hashRt).toBeTruthy();

      await authStudentService.logout(userFromDb!.id);

      userFromDb = await prisma.student.findFirst({
        where: { email: user.email },
      });

      expect(userFromDb?.hashRt).toBeFalsy();
    });
  });
});
