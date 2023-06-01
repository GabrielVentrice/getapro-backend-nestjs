import { ApiResponseProperty } from '@nestjs/swagger';

export class DefaultStudentResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  hash?: string;

  @ApiResponseProperty()
  hashRt?: string;

  @ApiResponseProperty()
  createdAt: string;

  @ApiResponseProperty()
  updatedAt: string;
}
