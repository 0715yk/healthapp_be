import { NestModule, MiddlewareConsumer } from '@nestjs/common';
export declare class AppModule implements NestModule {
    private readonly isDev;
    configure(consumer: MiddlewareConsumer): void;
}
