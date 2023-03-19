import { MongoDBAtlasClusterScalingOptions } from '../types';

export interface IClusterConfigurationAgent {
    PauseCluster(options: MongoDBAtlasClusterScalingOptions): Promise<void>;
    ResumeCluster(options: MongoDBAtlasClusterScalingOptions): Promise<void>;
    ScaleCluster(options: MongoDBAtlasClusterScalingOptions): Promise<void>;
}
