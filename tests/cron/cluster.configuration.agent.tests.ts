// eslint-disable-next-line max-classes-per-file
import { MockLogger } from '@cloudize/mock-logger';
import { LoggerMessageType } from '@cloudize/logger';
import { ClusterConfigurationAgent } from '../../src/cron';
import { MongoDBAtlasClusterScalingOptions, MongoDBAtlasClusterUpdateResponse } from '../../src/types';
import { IAtlasClusterEndpoint } from '../../src/interfaces';

class MockSuccessClusterEndpoint implements IAtlasClusterEndpoint {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  async Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse> {
    return { status: 200 };
  }
}

class MockRateLimitedClusterEndpoint implements IAtlasClusterEndpoint {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  async Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse> {
    return { status: 429 };
  }
}

class MockThrowErrorClusterEndpoint implements IAtlasClusterEndpoint {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  async Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse> {
    throw new Error('Mock Error');
  }
}

class MockUnexpectedThrowClusterEndpoint implements IAtlasClusterEndpoint {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  async Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse> {
    // eslint-disable-next-line no-throw-literal
    throw 'Mock Error';
  }
}

class TestClusterConfigurationAgent extends ClusterConfigurationAgent {
  private readonly mockClusterEndpoint: IAtlasClusterEndpoint;

  constructor(mockClusterEndpoint: IAtlasClusterEndpoint) {
    super();
    this.mockClusterEndpoint = mockClusterEndpoint;
  }

  // eslint-disable-next-line no-unused-vars
  protected InitializeAtlasClusterEndpoint(options: MongoDBAtlasClusterScalingOptions): IAtlasClusterEndpoint {
    return this.mockClusterEndpoint;
  }
}

afterEach(() => jest.clearAllMocks());

describe('The ClusterConfigurationAgent', () => {
  describe('PauseCluster() method', () => {
    it('should successfully pause a cluster when the Atlas API returns success', async () => {
      const clusterEndpoint = new MockSuccessClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.PauseCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Info,
        'The pause cluster request to the Test-Cluster cluster has been accepted and is in progress.',
      );
    });

    it('should write an error to the error log when the Atlas API returns a rate limited response', async () => {
      const clusterEndpoint = new MockRateLimitedClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.PauseCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'The pause cluster request to the Test-Cluster cluster was NOT accepted. The response received was:',
        { status: 429 },
      );
    });

    it('should write an error to the error log when the request to the Atlas API throws an error', async () => {
      const clusterEndpoint = new MockThrowErrorClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.PauseCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'An error occurred. The message was: Mock Error',
        expect.any(Error),
      );
    });

    it('should write an error to the error log when the request to the Atlas API throws an unexpected value', async () => {
      const clusterEndpoint = new MockUnexpectedThrowClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.PauseCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'An unexpected error occurred.',
        'Mock Error',
      );
    });
  });

  describe('ResumeCluster() method', () => {
    it('should successfully resume a cluster when the Atlas API returns success', async () => {
      const clusterEndpoint = new MockSuccessClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ResumeCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Info,
        'The resume cluster request to the Test-Cluster cluster has been accepted and is in progress.',
      );
    });

    it('should write an error to the error log when the Atlas API returns a rate limited response', async () => {
      const clusterEndpoint = new MockRateLimitedClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ResumeCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'The resume cluster request to the Test-Cluster cluster was NOT accepted. The response received was:',
        { status: 429 },
      );
    });

    it('should write an error to the error log when the request to the Atlas API throws an error', async () => {
      const clusterEndpoint = new MockThrowErrorClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ResumeCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'An error occurred. The message was: Mock Error',
        expect.any(Error),
      );
    });

    it('should write an error to the error log when the request to the Atlas API throws an unexpected value', async () => {
      const clusterEndpoint = new MockUnexpectedThrowClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ResumeCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'An unexpected error occurred.',
        'Mock Error',
      );
    });
  });

  describe('ScaleCluster() method', () => {
    it('should successfully scale the cluster when the Atlas API returns success', async () => {
      const clusterEndpoint = new MockSuccessClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ScaleCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Info,
        'The scaling request to the Test-Cluster cluster has been accepted and is in progress.',
      );
    });

    it('should write an error to the error log when the Atlas API returns a rate limited response', async () => {
      const clusterEndpoint = new MockRateLimitedClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ScaleCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'The scaling request to the Test-Cluster cluster was NOT accepted. The response received was:',
        { status: 429 },
      );
    });

    it('should write an error to the error log when the request to the Atlas API throws an error', async () => {
      const clusterEndpoint = new MockThrowErrorClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ScaleCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'An error occurred. The message was: Mock Error',
        expect.any(Error),
      );
    });

    it('should write an error to the error log when the request to the Atlas API throws an unexpected value', async () => {
      const clusterEndpoint = new MockUnexpectedThrowClusterEndpoint();
      const testAgent = new TestClusterConfigurationAgent(clusterEndpoint);
      await testAgent.ScaleCluster({
        apikey: { private: 'atlas-private-key', public: 'atlas-public-key' },
        clusterName: 'Test-Cluster',
        logger: MockLogger,
        provider: 'AWS',
        instanceSize: 'M30',
        projectId: 'test-project-id',
      });

      expect(MockLogger.Write).toHaveBeenCalledTimes(1);
      expect(MockLogger.Write).toHaveBeenCalledWith(
        LoggerMessageType.Error,
        'An unexpected error occurred.',
        'Mock Error',
      );
    });
  });
});
