module.exports = {
  appName: 'ezxport',
  backendRepoUrl: 'git@github.com:Ezxport-Inc/ezxport-api.git',
  servers: {
    prod: {
      servers: 'falcon@ec2-13-37-212-74.eu-west-3.compute.amazonaws.com',
      key: 'path_to_shh_key',
      deployTo: '/home/falcon/ezxport/prod/'
    }
  }
};
