import { Test, TestingModule } from '@nestjs/testing';
import { MovieVersionsController } from './movie-versions.controller';

describe('MovieVersionsController', () => {
  let controller: MovieVersionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieVersionsController],
    }).compile();

    controller = module.get<MovieVersionsController>(MovieVersionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
