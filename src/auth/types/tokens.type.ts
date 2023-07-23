export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type TokensWithExpirationTime = Tokens & {
  access_token_expiration: number;
  refresh_token_expiration: number;
};
