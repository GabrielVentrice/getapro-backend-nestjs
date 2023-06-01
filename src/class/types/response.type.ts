import { ApiResponseProperty } from '@nestjs/swagger';

export class DefaultClassResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  link?: string;

  @ApiResponseProperty()
  student: {
    name: string;
  };

  @ApiResponseProperty()
  teacher: {
    name: string;
  };
}
