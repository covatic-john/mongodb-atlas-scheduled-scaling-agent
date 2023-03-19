import { MongoDBAtlasClusterScalingOptions } from '../types';

export interface IClusterConfigurationAgent {
    ModifyCluster(options: MongoDBAtlasClusterScalingOptions): Promise<void>;
}
