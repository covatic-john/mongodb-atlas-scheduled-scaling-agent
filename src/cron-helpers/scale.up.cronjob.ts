import cron, {ScheduledTask} from 'node-cron';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import { LoggerMessageType } from '../interfaces/logger';
import { ModifyClusterConfig } from '../api-helpers';

export default function InitializeScaleUpCronjob(
  cronExpression: string,
  timezone: string,
  options: MongoDBAtlasClusterScalingOptions,
): ScheduledTask {
  return cron.schedule(cronExpression, async () => {
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
