import cron, { ScheduledTask } from 'node-cron';
import { LoggerMessageType } from '@cloudize/logger';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import ClusterConfigurationAgent from './cluster.configuration.agent';
import { IClusterConfigurationAgent } from '../interfaces';

export default class CronManager {
  protected static InitializeClusterConfigurationAgent(): IClusterConfigurationAgent {
    return new ClusterConfigurationAgent();
  }

  static RegisterScaleDownCronjob(
    cronExpression: string,
    timezone: string,
    options: MongoDBAtlasClusterScalingOptions,
  ): ScheduledTask {
    return cron.schedule(cronExpression, async () => {
      await options.logger.Write(
        LoggerMessageType.Info,
        `Scaling down the ${options.clusterName} cluster to ${options.instanceSize}`,
      );

      const agent = this.InitializeClusterConfigurationAgent();
      await agent.ModifyCluster(options);
    }, {
      name: 'Scale down',
      scheduled: true,
      timezone,
    });
  }

  static RegisterScaleUpCronjob(
    cronExpression: string,
    timezone: string,
    options: MongoDBAtlasClusterScalingOptions,
  ): ScheduledTask {
    return cron.schedule(cronExpression, async () => {
      await options.logger.Write(
        LoggerMessageType.Info,
        `Scaling up the ${options.clusterName} cluster to ${options.instanceSize}`,
      );

      const agent = this.InitializeClusterConfigurationAgent();
      await agent.ModifyCluster(options);
    }, {
      name: 'Scale up',
      scheduled: true,
      timezone,
    });
  }
}
