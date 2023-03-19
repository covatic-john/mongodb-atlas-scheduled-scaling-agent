import cron, { ScheduledTask } from 'node-cron';
import { LoggerMessageType } from '@cloudize/logger';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import ClusterConfigurationAgent from './cluster.configuration.agent';
import { IClusterConfigurationAgent } from '../interfaces';

export default class CronManager {
  protected static InitializeClusterConfigurationAgent(): IClusterConfigurationAgent {
    return new ClusterConfigurationAgent();
  }

  static RegisterPauseClusterCronjob(
    cronExpression: string,
    timezone: string,
    options: MongoDBAtlasClusterScalingOptions,
  ): ScheduledTask {
    return cron.schedule(cronExpression, async () => {
      await options.logger.Write(
        LoggerMessageType.Info,
        `Pausing the ${options.clusterName} cluster.`,
      );

      const agent = this.InitializeClusterConfigurationAgent();
      await agent.PauseCluster(options);
    }, {
      name: 'Pause',
      scheduled: true,
      timezone,
    });
  }

  static RegisterResumeClusterCronjob(
    cronExpression: string,
    timezone: string,
    options: MongoDBAtlasClusterScalingOptions,
  ): ScheduledTask {
    return cron.schedule(cronExpression, async () => {
      await options.logger.Write(
        LoggerMessageType.Info,
        `Resuming the ${options.clusterName} cluster.`,
      );

      const agent = this.InitializeClusterConfigurationAgent();
      await agent.ResumeCluster(options);
    }, {
      name: 'Resume',
      scheduled: true,
      timezone,
    });
  }

  static RegisterScaleDownClusterCronjob(
    cronExpression: string,
    timezone: string,
    options: MongoDBAtlasClusterScalingOptions,
  ): ScheduledTask {
    return cron.schedule(cronExpression, async () => {
      await options.logger.Write(
        LoggerMessageType.Info,
        `Scaling down the ${options.clusterName} cluster to ${options.instanceSize}.`,
      );

      const agent = this.InitializeClusterConfigurationAgent();
      await agent.ScaleCluster(options);
    }, {
      name: 'Scale down',
      scheduled: true,
      timezone,
    });
  }

  static RegisterScaleUpClusterCronjob(
    cronExpression: string,
    timezone: string,
    options: MongoDBAtlasClusterScalingOptions,
  ): ScheduledTask {
    return cron.schedule(cronExpression, async () => {
      await options.logger.Write(
        LoggerMessageType.Info,
        `Scaling up the ${options.clusterName} cluster to ${options.instanceSize}.`,
      );

      const agent = this.InitializeClusterConfigurationAgent();
      await agent.ScaleCluster(options);
    }, {
      name: 'Scale up',
      scheduled: true,
      timezone,
    });
  }
}
