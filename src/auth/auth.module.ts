import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [StudentModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
