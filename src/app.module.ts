import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [PrismaModule, AuthModule, StudentModule],
})
export class AppModule {}
