import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @MinLength(5)
  @IsNotEmpty()
  password: string;
}
