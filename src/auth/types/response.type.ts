import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiResponseProperty()
  access_token: string;

  @ApiResponseProperty()
  refresh_token: string;
}
