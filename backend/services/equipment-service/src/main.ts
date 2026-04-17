import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("CourtHub Equipment Service")
    .setDescription("Rental lifecycle, bundle reservation, and maintenance status.")
    .setVersion("1.0.0")
    .build();

  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT ?? 4003);
}

bootstrap();
