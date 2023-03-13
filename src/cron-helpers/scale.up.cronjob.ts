import cron from 'node-cron';
import ModifyClusterConfig from '../api-helpers';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import { LoggerMessageType } from '../interfaces/logger';

export default function InitializeScaleUpCronjob(
  cronExpression: string,
  timezone: string,
  options: MongoDBAtlasClusterScalingOptions,
) {
  cron.schedule(cronExpression, async () => {
    await options.logger.Write(
      LoggerMessageType.Info,
      `Scaling up the ${options.clusterName} cluster to ${options.instanceSize}`,
    );

    await ModifyClusterConfig(options);
  }, {
    name: 'Scale up',
    scheduled: true,
    timezone,
  });
}
