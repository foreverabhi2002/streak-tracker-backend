import { Injectable } from '@nestjs/common';
import { compare, compareSync, genSalt, hash } from 'bcrypt';
import crypto from 'node:crypto';

@Injectable()
export class CommonService {
  constructor() { }

  public generatePassword = () => {
    return crypto.randomBytes(8).toString('hex');
  };

  public hashPassword = async (password: string) => {
    const salt = await genSalt();
    return await hash(password, salt);
  };

  public comparePassword = async (
    currentPassword: string,
    dbPassword: string,
  ) => {
    return await compare(currentPassword, dbPassword);
  };

  public hashToken = async (token: string) => {
    const salt = await genSalt();
    return await hash(token, salt);
  };

  public compareToken = (currentToken: string, dbToken: string | string[]) => {
    if (typeof dbToken === 'string') {
      return compareSync(currentToken, dbToken);
    } else {
      return dbToken.some((i) => compareSync(currentToken, i));
    }
  };

  public generateOtp = () => {
    return crypto.randomInt(1000, 9999);
  };

  public uniqueKey = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
  };

  public jwt = (expiresIn: string) => {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    };
  };

}
