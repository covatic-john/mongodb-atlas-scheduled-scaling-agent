import cron from 'node-cron';
import ModifyClusterConfig from '../api-helpers';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import { LoggerMessageType } from '../interfaces/logger';

export default function InitializeScaleDownCronjob(
  cronExpression: string,
  timezone: string,
  options: MongoDBAtlasClusterScalingOptions,
) {
  cron.schedule(cronExpression, async () => {
    await options.logger.Write(
      LoggerMessageType.Info,
      `Scaling down the ${options.clusterName} cluster to ${options.instanceSize}`,
    );

    await ModifyClusterConfig(options);
  }, {
    name: 'Scale down',
    scheduled: true,
    timezone,
  });
}
