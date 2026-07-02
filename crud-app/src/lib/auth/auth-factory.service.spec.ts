import { Test, TestingModule } from '@nestjs/testing';
import { AuthFactoryService } from './auth-factory.service';
import { PrismaService } from '../database/prisma.service';

jest.mock('./auth.config', () => ({
  createAuth: jest.fn().mockResolvedValue({ mock: true }),
}));

describe('AuthFactoryService', () => {
  let service: AuthFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFactoryService,
        {
          provide: PrismaService,
          useValue: {
            $on: jest.fn(),
            $disconnect: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthFactoryService>(AuthFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return auth instance from getAuth', async () => {
    const auth = await service.getAuth();
    expect(auth).toEqual({ mock: true });
  });
});
