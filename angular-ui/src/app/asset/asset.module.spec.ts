import { AssetModule } from './asset.module';

describe('AssetModule', () => {
  let assetModule: AssetModule;

  beforeEach(() => {
    assetModule = new AssetModule();
  });

  it('should create an instance', () => {
    expect(assetModule).toBeTruthy();
  });
});
