import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { CommonService } from 'src/services/common/common.service';
import { EmailService } from 'src/services/email/email.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LogInDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyOtpDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const hashedPassword = await this.commonService.hashPassword(password);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const token = await this.jwtService.signAsync(
      { userId: user._id, action: 'VERIFY_EMAIL' },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '15m',
      },
    );
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    void this.emailService.sendEmail(
      user.email,
      'Verify Your Email - Learn In Public Streak Tracker',
      `
      <p>Hello ${user.username},</p>
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>Thank you</p>
      `,
    );
    return user;
  }

  async verifyEmail(payload: VerifyEmailDto) {
    let decoded: { userId: ObjectId; action: string };
    try {
      decoded = await this.jwtService.verifyAsync(payload.token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (decoded.action !== 'VERIFY_EMAIL') {
      throw new HttpException('Invalid Action', HttpStatus.METHOD_NOT_ALLOWED);
    }

    const user = await this.usersService.findOne(decoded.userId);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    await this.usersService.update(decoded.userId, { isVerified: true });
    return { message: 'Email successfully verified' };
  }

  async login(payload: LogInDto) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }
    if (!user.isActive) {
      throw new HttpException(
        'User is not active. Kindly contact administrator.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.isVerified) {
      const token = await this.jwtService.signAsync(
        { userId: user._id, action: 'VERIFY_EMAIL' },
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      );
      const frontendUrl = this.configService.get<string>(
        'FRONTEND_URL',
        'http://localhost:3000',
      );
      const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

      void this.emailService.sendEmail(
        user.email,
        'Verify Your Email - Learn In Public Streak Tracker',
        `
      <p>Hello ${user.username},</p>
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>Thank you</p>
      `,
      );
      throw new HttpException(
        'User is not verified. Please check your email to verify your account.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const passwordVerified = await this.commonService.comparePassword(
      payload.password,
      user.password,
    );
    if (!passwordVerified) {
      throw new HttpException(
        'Wrong password, kindly enter the correct password to login',
        HttpStatus.FORBIDDEN,
      );
    }
    const uuid = this.commonService.generatePassword();
    const accessToken = await this.jwtService.signAsync(
      {
        uuid,
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password,
      },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );
    return { ...user, accessToken };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }
    const otp = this.commonService.generateOtp();
    const token = this.jwtService.sign(
      { userId: user._id, action: 'FORGOT_PASSWORD', otp },
      { secret: this.configService.getOrThrow<string>('JWT_SECRET') },
    );
    void this.emailService.sendEmail(
      payload.email,
      'Forgot Password - Learn In Public Streak Tracker',
      `
      <p>Hello ${user.name}</p>
      <p>Your OTP is ${otp}</p>
      <p>This OTP will expire in 5 minutes</p>
      <p>Thank you</p>
      `,
    );
    return token;
  }

  async verifyOtp(payload: VerifyOtpDto) {
    const decoded: { otp: number } = await this.jwtService.verify(
      payload.refreshToken,
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    );
    if (decoded.otp !== payload.otp) {
      throw new HttpException('Incorrect OTP', HttpStatus.UNAUTHORIZED);
    }
    return {
      message: 'OTP verified',
      decoded,
    };
  }

  async resetPassword(payload: ResetPasswordDto) {
    if (payload.password.length <= 6) {
      throw new HttpException(
        'Password length must be greater than 6',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const decoded: {
      otp: number;
      action: string;
      userId: ObjectId;
    } = this.jwtService.verify(payload.refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });
    if (decoded.otp !== payload.otp) {
      throw new HttpException('Incorrect OTP', HttpStatus.UNAUTHORIZED);
    }
    if (decoded.action !== 'FORGOT_PASSWORD') {
      throw new HttpException('Invalid Action', HttpStatus.METHOD_NOT_ALLOWED);
    }
    const password = await this.commonService.hashPassword(payload.password);
    await this.usersService.updatePassword(decoded.userId, {
      password,
    });
    const user = await this.usersService.findOne(decoded.userId);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    void this.emailService.sendEmail(
      user.email,
      'Password Changed - Learn In Public Streak Tracker',
      `
      Hello ${user.name},
      Your password has been changed successfully.
      `,
    );
    return user;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    if (
      changePasswordDto.newPassword.length <= 6 ||
      changePasswordDto.oldPassword.length <= 6
    ) {
      throw new HttpException(
        'Password length must be greater than 6',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const result = await this.commonService.comparePassword(
      changePasswordDto.oldPassword,
      changePasswordDto.user.password,
    );
    if (!result) {
      throw new HttpException('old password not match', HttpStatus.BAD_REQUEST);
    }
    const password = await this.commonService.hashPassword(
      changePasswordDto.newPassword,
    );
    await this.usersService.updatePassword(changePasswordDto.user._id, {
      password,
    });
    const user = await this.usersService.findOne(changePasswordDto.user._id);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    const accessToken = await this.jwtService.signAsync(
      {
        _id: user._id,
        email: user.email,
        password: user.password,
        username: user.username,
      },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    );
    return { ...user, accessToken };
  }
}
