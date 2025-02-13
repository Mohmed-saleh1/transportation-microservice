import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerDocumentationModule } from './common/core/swagger/swagger.module';
import { WinstonModule } from 'nest-winston';
import { instance } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  SwaggerDocumentationModule.setup(app);

  await app.listen(process.env.PORT);
}
bootstrap();
