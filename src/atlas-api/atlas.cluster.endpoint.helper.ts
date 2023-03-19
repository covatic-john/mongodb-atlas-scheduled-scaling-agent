import urllibClient from 'urllib';
import { IAtlasClusterEndpoint } from '../interfaces';
import { MongoDBAtlasClusterUpdateResponse } from '../types';

class AtlasClusterEndpoint implements IAtlasClusterEndpoint {
  private readonly baseUrl: string = 'https://cloud.mongodb.com/api/atlas/v1.0';

  private readonly digestAuth: string;

  private readonly requestOptions: any = {
    envelope: true,
    itemsPerPage: 10,
    pretty: true,
    httpOptions: {
      timeout: 5000,
    },
  };

  private readonly projectId: string;

  constructor(privateKey: string, publicKey: string, projectId: string) {
    this.digestAuth = `${publicKey}:${privateKey}`;
    this.projectId = projectId;
  }

  async Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse> {
    return urllibClient.request(
      `${this.baseUrl}/groups/${this.projectId}/clusters/${clustername}`,
      {
        digestAuth: this.digestAuth,
        dataType: 'json',
        method: 'PATCH',
        data: body,
        headers: { 'Content-Type': 'application/json' },
        ...this.requestOptions,
      },
    );
  }
}

export default AtlasClusterEndpoint;
