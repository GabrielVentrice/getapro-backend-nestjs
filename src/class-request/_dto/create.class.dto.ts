import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClassRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  teacherId: number;
}
