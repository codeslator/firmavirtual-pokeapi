import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('PokemonAPI FirmaVirtual API')
  .setDescription('This API connects with PokeAPI to get data and store to the own database. Remember execute seeder to download data.')
  .setVersion('1.0')
  .addTag('pokemon')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
