export interface JwtPayload {
  _id: string;
  username: string;
  password: string;
  email: string;
  accessToken?: string;
}
