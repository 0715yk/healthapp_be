import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: 'bravehong',
      password: process.env.MYSQL_PASSWORD,
      database: 'healthapp',
      entities: [User],
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    WorkoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
