import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ConfigService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    // neotest jest config file이 nil일때 jest config파일은
    // jest.config.ts(js) jest.config.json package.json.jest 순으로 탐색되어 실행될까?
    it('if neotest config nil, test should execute by default config searching process ', () => {
      expect(appController.getAppProfile()).toBeDefined();
    });
  });
});
