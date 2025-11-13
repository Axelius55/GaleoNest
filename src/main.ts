import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Remueve todo lo que no está incluido en los DTOs.
      forbidNonWhitelisted: true, //Retorna bad request si hay propiedades en el objeto no requeridas.
      transform: true,
    }),
  );

  // Configuración de CORS para producción
  app.enableCors({
     origin: [
      'https://staging.d2yollvyu3bdyy.amplifyapp.com', // Amplify staging
      'https://master.df9fo2w7epab1.amplifyapp.com',   // Amplify producción
      'https://de6l9g1v7ar54.cloudfront.net',          // CloudFront (nuevo proxy HTTPS)
      'http://localhost:5173',                         // opcional, para desarrollo local
     ],
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
     credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('GaleoNest')
    .setDescription('The GaleoNest API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();
