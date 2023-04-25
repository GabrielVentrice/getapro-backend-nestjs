import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalStudentAuthGuard extends AuthGuard('local-student') {}
