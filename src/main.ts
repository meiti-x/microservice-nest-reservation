import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PostModule} from "./post/post.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
