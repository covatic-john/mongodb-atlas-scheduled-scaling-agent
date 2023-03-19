// eslint-disable-next-line max-classes-per-file
import { MockLogger } from '@cloudize/mock-logger';
import { LoggerMessageType } from '@cloudize/logger';
import CronManager from '../../src/cron/cron.manager';
import { IAtlasClusterEndpoint, IClusterConfigurationAgent } from '../../src/interfaces';
import { ClusterConfigurationAgent } from '../../src/cron';
import { MongoDBAtlasClusterScalingOptions, MongoDBAtlasClusterUpdateResponse } from '../../src/types';

class MockSuccessClusterEndpoint implements IAtlasClusterEndpoint {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  async Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse> {
    return { status: 200 };
  }
}

class TestClusterConfigurationAgent extends ClusterConfigurationAgent {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected InitializeAtlasClusterEndpoint(options: MongoDBAtlasClusterScalingOptions): IAtlasClusterEndpoint {
    return new MockSuccessClusterEndpoint();
  }
}

class TestCronManager extends CronManager {
  protected static InitializeClusterConfigurationAgent(): IClusterConfigurationAgent {
    return new TestClusterConfigurationAgent();
  }
}

afterEach(() => jest.clearAllMocks());

describe('The CronManager', () => {
  it('should successfully execute a scale up cronjob when the timer ticks over', async () => {
    jest.useFakeTimers();

    TestCronManager.RegisterScaleUpCronjob(
      '* * * * *',
      '',
      {
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M40',
        projectId: 'test-project-id',
      },
    );

    jest.advanceTimersByTime(60 * 1000);
    expect(MockLogger.Write).toHaveBeenCalledTimes(1);
    expect(MockLogger.Write).toHaveBeenCalledWith(
      LoggerMessageType.Info,
      'Scaling up the Test-Cluster cluster to M40',
    );
  });

  it('should successfully execute a scale down cronjob when the timer ticks over', async () => {
    jest.useFakeTimers();

    TestCronManager.RegisterScaleDownCronjob(
      '* * * * *',
      '',
      {
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      },
    );

    jest.advanceTimersByTime(60 * 1000);
    expect(MockLogger.Write).toHaveBeenCalledTimes(1);
    expect(MockLogger.Write).toHaveBeenCalledWith(
      LoggerMessageType.Info,
      'Scaling down the Test-Cluster cluster to M30',
    );
  });
});
