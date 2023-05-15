import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

class MockAuthService {
  signIn(username: string, password: string) {
    expect(username).toBe('test');
    expect(password).toBe('password');
  }
}

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;
  let API;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    API = app.getHttpServer();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /', (done) => {
    request(API)
      .post('/auth/login')
      .send({ username: 'test', password: 'password' })
      .expect(200)
      .end((err, res) => {
        if (err !== null) done(err, res);
        if (res.error) done(res.error, res);
        done(err, res);
      });
  });
});
