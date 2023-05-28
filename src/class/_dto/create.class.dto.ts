import { ApiProperty } from '@nestjs/swagger';
import { ClassStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  discordLink?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  teacherId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: ClassStatus;
}
