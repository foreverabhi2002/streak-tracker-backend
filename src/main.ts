import rateLimit from '@fastify/rate-limit';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { AppModule } from './app.module';
import setUpSwagger from './setupSwagger';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true, trustProxy: true });
  const server = adapter.getInstance<FastifyInstance>();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { logger: ['log', 'error', 'warn', 'debug', 'verbose'], rawBody: true },
  );
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
  });
  await server.register(rateLimit, {
    global: true,
    max: 50,
    timeWindow: '2 seconds',
    keyGenerator: (req) =>
      (req.headers['x-real-ip'] as string) || // nginx
      (req.headers['x-client-ip'] as string) || // apache
      (req.headers['x-forwarded-for'] as string),
    errorResponseBuilder: (_, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again after ${context.after}`,
    }),
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  setUpSwagger(app, server);
  const port = process.env.PORT ?? '5400';
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
