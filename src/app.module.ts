import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { Goal } from './goals/entities/goal.entity';
import { GoalsController } from './goals/goals.controller';
import { GoalsService } from './goals/goals.service';
import { LogEntry } from './log-entries/entities/log-entry.entity';
import { LogEntriesController } from './log-entries/log-entries.controller';
import { LogEntriesService } from './log-entries/log-entries.service';
import { CommonService } from './services/common/common.service';
import { EmailService } from './services/email/email.service';
import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('MONGODB_URI'),
        entities: [],
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Goal, LogEntry]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10d' },
      }),
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    GoalsController,
    LogEntriesController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
    EmailService,
    CommonService,
    AuthService,
    UsersService,
    GoalsService,
    LogEntriesService,
  ],
})
export class AppModule {}
