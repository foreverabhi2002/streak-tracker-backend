import { Test, TestingModule } from '@nestjs/testing';
import { LogEntriesController } from './log-entries.controller';
import { LogEntriesService } from './log-entries.service';

describe('LogEntriesController', () => {
  let controller: LogEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogEntriesController],
      providers: [LogEntriesService],
    }).compile();

    controller = module.get<LogEntriesController>(LogEntriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
