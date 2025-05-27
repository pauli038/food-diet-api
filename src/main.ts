import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

const config = new DocumentBuilder()
  .setTitle('Food Diet API')
  .setDescription('Documentación de la API')
  .setVersion('1.0')
  .addBearerAuth() 
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  await app.listen(3000);
  console.log('🚀 App corriendo en http://localhost:3000/api');
}
bootstrap();
