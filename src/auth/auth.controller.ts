import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LogInDto,
  ResetPasswordDto,
  VerifyOtpDto,
  VerifyEmailDto,
} from './auth.dto';
import type { JwtPayload } from './auth.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth Routes')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register User' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: CreateUserDto) {
    const data = await this.authService.register(registerDto);
    return {
      data,
      message: 'User signed up successfully. Please check your email to verify your account.',
    };
  }

  @Post('verify-email')
  @Public()
  @ApiOperation({ summary: 'Verify Email' })
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const data = await this.authService.verifyEmail(verifyEmailDto);
    return data;
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login User' })
  @HttpCode(HttpStatus.ACCEPTED)
  async login(
    @Body() logInDto: LogInDto,
  ) {
    const data = await this.authService.login(logInDto);
    return {
      data,
      message: 'Login Successful',
    };
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Forgot Password' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const token = await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message: 'email sent successfully',
      refreshToken: token,
    };
  }


  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify Otp' })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {
    const data = await this.authService.verifyOtp(verifyOtpDto);
    return {
      data,
      message: 'OTP verified',
    };
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset Password' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const data = await this.authService.resetPassword(resetPasswordDto);
    return {
      data,
      message: 'Password reset successfully',
    };
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change Password' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.ACCEPTED)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const data = await this.authService.changePassword(changePasswordDto);
    return {
      message: 'Password changed successfully',
      data,
    };
  }

  @Get('whoAmI')
  @ApiOperation({ summary: 'Who Am I' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async whoAmI(
    @User() user: JwtPayload,
  ) {
    const userData = await this.usersService.findOne(
      new ObjectId(user._id),
    );
    return {
      data: {
        ...userData,
        accessToken: user.accessToken,
      },
      message: 'Who Am I',
    };
  }
}
