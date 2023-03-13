import {
  CrontabDays, MongoDBAtlasInstanceSize, MongoDBAtlasProvider,
} from './types';
import { InitializeScaleDownCronjob, InitializeScaleUpCronjob, ValidateExpression } from './cron-helpers';
import { ProductionConsoleLogger } from './logger';
import { LoggerMessageType } from './interfaces/logger';

// Atlas Cluster Parameters
const { ATLAS_API_PRIVATE_KEY, ATLAS_API_PUBLIC_KEY } = process.env;
const ATLAS_PROVIDER: MongoDBAtlasProvider = 'AWS';
const ATLAS_PROJECT_ID = 'Your Atlas Project ID';
const ATLAS_CLUSTER_NAME = 'Your Cluster Name';

// Scale up scheduling & configuration
const SCALE_UP_DAYS: CrontabDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SCALE_UP_HOUR: string = '6';
const SCALE_UP_MINUTE: string = '0';
const SCALE_UP_INSTANCE_SIZE: MongoDBAtlasInstanceSize = 'M40';

// Scale down scheduling & configuration
const SCALE_DOWN_DAYS: CrontabDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SCALE_DOWN_HOUR = '18';
const SCALE_DOWN_MINUTE: string = '0';
const SCALE_DOWN_INSTANCE_SIZE: MongoDBAtlasInstanceSize = 'M30';

const TIMEZONE = 'Pacific/Auckland';

const scaleUpCronExpression = `${SCALE_UP_MINUTE} ${SCALE_UP_HOUR} * * ${SCALE_UP_DAYS.join(',')}`;
const scaleDownCronExpression = `${SCALE_DOWN_MINUTE} ${SCALE_DOWN_HOUR} * * ${SCALE_DOWN_DAYS.join(',')}`;

ValidateExpression(scaleUpCronExpression, 'scale-up');
ValidateExpression(scaleDownCronExpression, 'scale-down');

InitializeScaleUpCronjob(scaleUpCronExpression, TIMEZONE, {
  apikey: { private: ATLAS_API_PRIVATE_KEY, public: ATLAS_API_PUBLIC_KEY },
  logger: ProductionConsoleLogger,
  projectId: ATLAS_PROJECT_ID,
  clusterName: ATLAS_CLUSTER_NAME,
  provider: ATLAS_PROVIDER,
  instanceSize: SCALE_UP_INSTANCE_SIZE,
});

InitializeScaleDownCronjob(scaleDownCronExpression, TIMEZONE, {
  apikey: { private: ATLAS_API_PRIVATE_KEY, public: ATLAS_API_PUBLIC_KEY },
  logger: ProductionConsoleLogger,
  projectId: ATLAS_PROJECT_ID,
  clusterName: ATLAS_CLUSTER_NAME,
  provider: ATLAS_PROVIDER,
  instanceSize: SCALE_DOWN_INSTANCE_SIZE,
});

ProductionConsoleLogger.Write(
  LoggerMessageType.Info,
  'The Cloudize MongoDB Atlas Scheduled Scaling Agent has started and is running',
);
