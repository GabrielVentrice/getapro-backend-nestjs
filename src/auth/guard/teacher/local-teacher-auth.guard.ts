import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalTeacherAuthGuard extends AuthGuard('local-teacher') {}
