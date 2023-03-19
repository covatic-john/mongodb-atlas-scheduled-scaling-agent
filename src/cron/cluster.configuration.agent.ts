import { isError } from '@cloudize/json';
import { LoggerMessageType } from '@cloudize/logger';
import { IAtlasClusterEndpoint, IClusterConfigurationAgent } from '../interfaces';
import { MongoDBAtlasClusterScalingOptions, MongoDBAtlasClusterUpdateResponse } from '../types';
import AtlasClusterEndpoint from '../atlas-api/atlas.cluster.endpoint.helper';

export default class ClusterConfigurationAgent implements IClusterConfigurationAgent {
  // eslint-disable-next-line class-methods-use-this
  protected InitializeAtlasClusterEndpoint(options: MongoDBAtlasClusterScalingOptions): IAtlasClusterEndpoint {
    return new AtlasClusterEndpoint(options.apikey.private, options.apikey.public, options.projectId);
  }

  async ModifyCluster(options: MongoDBAtlasClusterScalingOptions): Promise<void> {
    const cluster: IAtlasClusterEndpoint = this.InitializeAtlasClusterEndpoint(options);

    try {
      const response: MongoDBAtlasClusterUpdateResponse = await cluster.Update(options.clusterName, {
        name: options.clusterName,
        providerSettings: {
          providerName: options.provider,
          instanceSizeName: options.instanceSize,
        },
      });

      if (response.status === 200) {
        await options.logger.Write(
          LoggerMessageType.Info,
          `The update to the ${options.clusterName} cluster has been accepted and is in progress.`,
        );
      } else {
        await options.logger.Write(
          LoggerMessageType.Error,
          `The update to the ${options.clusterName} cluster was NOT accepted. The response received was:`,
          response,
        );
      }
    } catch (error) {
      if (isError(error)) {
        await options.logger.Write(
          LoggerMessageType.Error,
          `An error occurred. The message was: ${error.message}`,
          error,
        );
      } else {
        await options.logger.Write(
          LoggerMessageType.Error,
          'An unexpected error occurred.',
          error,
        );
      }
    }
  }
}
