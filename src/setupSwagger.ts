import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyInstance } from 'fastify';

export default function setUpSwagger(
  app: NestFastifyApplication,
  server: FastifyInstance,
) {
  server.after(() => {
    server.addHook('onRequest', (request, reply, next) => {
      if (request.url.indexOf('/docs') === 0) {
        try {
          const base64AuthString =
            request.headers['authorization']?.split(' ')[1];
          const authString = Buffer.from(
            base64AuthString as string,
            'base64',
          ).toString('utf8');

          const username = authString.split(':')[0];
          const password = authString.split(':')[1];

          if (
            username === process.env.DOCS_LOGIN_KEY &&
            password === process.env.DOCS_LOGIN_PWD
          ) {
            next();
            return;
          }
        } catch {
          console.error('Error With Swagger');
        }

        reply
          .header('WWW-Authenticate', 'Basic realm="Swagger"; charset=UTF-8')
          .status(401)
          .send();
        return;
      }
      next();
    });
  });

  const config = new DocumentBuilder()
    .setTitle('Learn In Public Streak Tracker Backend')
    .setDescription('The Learn In Public Streak Tracker API in NestJs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
