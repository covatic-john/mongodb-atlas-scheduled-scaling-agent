import { MongoDBAtlasClusterUpdateResponse } from '../types';

export interface IAtlasClusterEndpoint {
    Update(clustername: string, body: object): Promise<MongoDBAtlasClusterUpdateResponse>;
}
