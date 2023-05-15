import { User } from '../users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Auth } from './auth.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace MockRepository {
  export function save(data) {
    return { affected: 1 };
  }
  export function create(data: { user: number }) {
    return new Auth();
  }
}
class MockUserService {
  findOne(username) {
    if (username === 'test') return new User();
    return null;
  }
}
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: {
            save: jest.fn().mockImplementation(MockRepository.save),
            create: jest.fn().mockImplementation(MockRepository.create),
          },
        },
        { provide: UsersService, useClass: MockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sign in successfull', async () => {
    await service.signIn('test', 'password');
  });

  it('sign out successfull', async () => {
    await service.signOut({ token: 'token' });
  });

  // it('sign in with incorrect user should fail', async () => {
  //   await service.signIn('user', 'password');
  // });
});
