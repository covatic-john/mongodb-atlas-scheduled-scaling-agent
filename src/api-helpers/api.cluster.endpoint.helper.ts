import urllibClient from 'urllib';

class Cluster {
  private readonly baseUrl: string = 'https://cloud.mongodb.com/api/atlas/v1.0';

  private readonly digestAuth: string;

  private readonly projectId: string;

  constructor(privateKey: string, publicKey: string, projectId: string) {
    this.digestAuth = `${publicKey}:${privateKey}`;
    this.projectId = projectId;
  }

  async update(clustername: string, body: object, options: any = {}) {
    return urllibClient.request(
      `${this.baseUrl}/groups/${this.projectId}/clusters/${clustername}`,
      {
        digestAuth: this.digestAuth,
        dataType: 'json',
        method: 'PATCH',
        data: body,
        headers: { 'Content-Type': 'application/json' },
        ...options,
      },
    );
  }
}

export default Cluster;
