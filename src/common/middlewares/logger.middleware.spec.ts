import { LoggerMiddleware } from 'src/common/middlewares//logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined();
  });
});
