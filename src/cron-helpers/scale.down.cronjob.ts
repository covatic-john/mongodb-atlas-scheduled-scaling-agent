import cron, {ScheduledTask} from 'node-cron';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import { LoggerMessageType } from '../interfaces/logger';
import { ModifyClusterConfig } from '../api-helpers';

export default function InitializeScaleDownCronjob(
  cronExpression: string,
  timezone: string,
  options: MongoDBAtlasClusterScalingOptions,
): ScheduledTask {
  return cron.schedule(cronExpression, async () => {
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
