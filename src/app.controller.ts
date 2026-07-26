import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'Get Welcome Page' })
  getHello(): string {
    return this.appService.getHello();
  }
}
