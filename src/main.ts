import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // // Habilitar CORS
  // app.enableCors({
  //   // Permite peticiones desde el servidor de desarrollo de React (puerto común de Vite)
  //   // Asegúrate de cambiar '5173' si tu React corre en otro puerto (ej. 3000)
  //   origin: 'http://localhost:5173',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite todos los métodos CRUD
  //   credentials: true, // Crucial para enviar el token JWT
  // });
  // //  FIN DE CORS

  app.enableCors({
    // Permite peticiones desde el servidor de desarrollo de React (puerto 5173)
    origin: 'http://localhost:5173',

    // Permite los métodos que necesitas
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    // Permite que el navegador envíe credenciales/cookies/tokens
    credentials: true,

    // 💥 ¡LA CLAVE! Declara que aceptas el encabezado Authorization, además del Content-Type y Accept
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Remueve todo lo que no está incluido en los DTOs.
      forbidNonWhitelisted: true, //Retorna bad request si hay propiedades en el objeto no requeridas.
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('GaleoNest')
    .setDescription('The GaleoNest API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();