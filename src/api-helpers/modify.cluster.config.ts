import { isError } from '@cloudize/json';
import { MongoDBAtlasClusterScalingOptions } from '../types';
import { LoggerMessageType } from '../interfaces/logger';
import Cluster from './api.cluster.endpoint.helper';

export default async function ModifyClusterConfig(options: MongoDBAtlasClusterScalingOptions) {
  const cluster = new Cluster(options.apikey.private, options.apikey.public, options.projectId);

  const atlasClientOptions = {
    envelope: true,
    itemsPerPage: 10,
    pretty: true,
    httpOptions: { // This parameter will not be sent as querystring. This will be send to http request package `urllib`
      timeout: 5000,
    },
  };

  try {
    const response: any = await cluster.update(options.clusterName, {
      name: options.clusterName,
      providerSettings: {
        providerName: options.provider,
        instanceSizeName: options.instanceSize,
      },
    }, atlasClientOptions);

    if (response.status === 200) {
      await options.logger.Write(
        LoggerMessageType.Info,
        `The update to the ${options.clusterName} cluster has been accepted and is in progress.`,
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
