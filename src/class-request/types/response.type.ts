import { ApiResponseProperty } from '@nestjs/swagger';

export class DefaultClassRequestResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  student: {
    name: string;
  };

  @ApiResponseProperty()
  teacher: {
    name: string;
  };
}
