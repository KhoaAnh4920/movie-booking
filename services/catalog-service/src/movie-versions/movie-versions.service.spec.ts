import { Test, TestingModule } from '@nestjs/testing';
import { MovieVersionsService } from './movie-versions.service';

describe('MovieVersionsService', () => {
  let service: MovieVersionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieVersionsService],
    }).compile();

    service = module.get<MovieVersionsService>(MovieVersionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
