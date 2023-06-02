import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateClassDto {
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
  @ApiProperty({ enum: ClassStatus })
  status: ClassStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  discordLink?: string;
}
