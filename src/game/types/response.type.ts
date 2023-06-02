import { ApiResponseProperty } from '@nestjs/swagger';

export class DefaultGameResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;
}
