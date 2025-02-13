import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerDocumentationModule } from './common/core/swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  SwaggerDocumentationModule.setup(app);

  await app.listen(process.env.PORT);
}
bootstrap();
