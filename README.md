# This repo contains the MongoDB Atlas Scheduled Scaling Agent

![](https://img.shields.io/badge/license-MIT-blue)

The Cloudize MongoDB Atlas Scheduled Scaling Agent provides the ability for developers to easily configure a service that scales their Atlas Clusters up and down based on a cron schedule.

* * *

## Download & Installation

Please fork this repo for your projects and update the following constants in the /src/index.ts file

### Scaling Parameters
```
// Atlas Cluster Parameters
const ATLAS_PROVIDER: MongoDBAtlasProvider = 'AWS';
const ATLAS_PROJECT_ID = 'XXXXXXXXXXXXXXXXXXXXXXXX';
const ATLAS_CLUSTER_NAME = 'ClusterName';

// Scale up scheduling & configuration
const SCALE_UP_DAYS: CrontabDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SCALE_UP_HOUR: string = '6';
const SCALE_UP_MINUTE: string = '0';
const SCALE_UP_INSTANCE_SIZE: MongoDBAtlasInstanceSize = 'M50';

// Scale down scheduling & configuration
const SCALE_DOWN_DAYS: CrontabDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SCALE_DOWN_HOUR = '18';
const SCALE_DOWN_MINUTE: string = '0';
const SCALE_DOWN_INSTANCE_SIZE: MongoDBAtlasInstanceSize = 'M30';
```

### Runtime Environment Variables
In addition, please ensure that the following environment vars are set at runtime with your MongoDB Atlas API Key parameters:

`ATLAS_API_PRIVATE_KEY` - Your MongoDB Atlas private key 

`ATLAS_API_PUBLIC_KEY` - Your MongoDB Atlas public key

## Authors or Acknowledgments

*   Cloudize Limited

## License

This project is licensed under the MIT License.
