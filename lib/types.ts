export type Config = {
  scope: string;
  accounts: ConfigAllegro[];
};

export type ConfigAllegro = {
  id: number;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationCode: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type OrderInfo = {
  id: string;
  login: string;
  email: string;
  deliveryId: string;
  deliveryName: string;
} | null;
