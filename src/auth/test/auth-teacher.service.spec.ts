import { TestingModule, Test } from '@nestjs/testing';
import { Teacher } from '@prisma/client';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from '../../teacher/_dto/create.teacher.dto';
import { Tokens } from '../types/tokens.type';
import { decode } from 'jsonwebtoken';
import { AuthTeacherService } from '../service/auth-teacher.service';

const user: CreateTeacherDto = {
  email: 'test@gmail.com',
  password: 'super-secret-password',
  name: 'Gabriel',
};

describe('Auth Teacher flow', () => {
  let prisma: PrismaService;
  let authTeacherService: AuthTeacherService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authTeacherService = moduleRef.get(AuthTeacherService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('Singup', () => {
    beforeAll(async () => {
      await prisma.cleanDatabase();
    });

    it('Should signup', async () => {
      const tokens = await authTeacherService.singup(user);

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

    it('Should throw duplicate error', async () => {
      let tokens: Tokens | undefined;

      try {
        await authTeacherService.singup(user);
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
        tokens = await authTeacherService.signinLocalTeacher(user);
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('Should signin', async () => {
      await authTeacherService.singup(user);

      const tokens = await authTeacherService.signinLocalTeacher(user);

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

    it('Should throw if wrong password', async () => {
      let tokens: Tokens | undefined;

      try {
        tokens = await authTeacherService.signinLocalTeacher({
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
      const result = await authTeacherService.logout(4);
      expect(result).toBeDefined();
    });

    it('Should Logout', async () => {
      await authTeacherService.singup(user);

      let userFromDb: Teacher | null;

      userFromDb = await prisma.teacher.findFirst({
        where: { email: user.email },
      });

      expect(userFromDb?.hashRt).toBeTruthy();

      await authTeacherService.logout(userFromDb!.id);

      userFromDb = await prisma.teacher.findFirst({
        where: { email: user.email },
      });

      expect(userFromDb?.hashRt).toBeFalsy();
    });
  });

  describe('Refresh', () => {
    beforeAll(async () => {
      await prisma.cleanDatabase();
    });

    it('Should throw with no exist user', async () => {
      let tokens: Tokens | undefined;
      try {
        tokens = await authTeacherService.refreshTokens(1, '');
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should throw if user logged out', async () => {
      const _tokens = await authTeacherService.singup(user);

      const rt = _tokens.refresh_token;
      const decoded = decode(rt);
      const userId = Number(decoded?.sub);

      await authTeacherService.logout(userId);

      let tokens: Tokens | undefined;

      try {
        tokens = await authTeacherService.refreshTokens(1, rt + 'a');
      } catch (err) {
        expect(err.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('Should refresh tokens', async () => {
      await prisma.cleanDatabase();

      const _tokens = await authTeacherService.singup(user);

      const at = _tokens.access_token;
      const rt = _tokens.refresh_token;

      const decoded = decode(rt);
      const userId = Number(decoded?.sub);

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      const tokens = await authTeacherService.refreshTokens(userId, rt);

      expect(tokens).toBeDefined();

      // refreshed tokens should be different
      expect(tokens.access_token).not.toBe(at);
      expect(tokens.refresh_token).not.toBe(rt);
    });
  });
});
