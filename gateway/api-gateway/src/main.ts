import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig: DocumentBuilder = new DocumentBuilder()
    .setTitle('Movie Booking API')
    .setDescription('API Gateway for Movie Booking Microservices')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'auth0',
    );

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig.build(),
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 8000);
}

void bootstrap();
