import { ILogger } from '@cloudize/logger';

export type CrontabDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type CrontabDays = CrontabDay[];

export type MongoDBAtlasProvider = 'AWS' | 'GCP' | 'AZURE';
export type MongoDBAtlasInstanceSize =
  'M10' | 'M20' | 'M30'
    | 'M40' | 'R40' | 'M40_NVME'
    | 'M50' | 'R50' | 'M50_NVME'
    | 'M60' | 'R60' | 'M60_NVME'
    | 'M80' | 'R80' | 'M80_NVME'
    | 'M100' | 'M140'
    | 'M200' | 'R200' | 'M200_NVME'
    | 'M300' | 'R300'
    | 'R400' | 'M400_NVME'
    | 'R700';

export type MongoDBAtlasClusterScalingOptions = {
    apikey: {
        private: string;
        public: string;
    };
    logger: ILogger;
    projectId: string;
    clusterName: string;
    provider: MongoDBAtlasProvider,
    instanceSize: MongoDBAtlasInstanceSize;
}

export type MongoDBAtlasClusterUpdateResponse = {
    status: number;
    [index: string]: any;
}
