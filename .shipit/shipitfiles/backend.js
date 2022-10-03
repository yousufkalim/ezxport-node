// Init
const config = require('../config');
let end = 'backend';
let environment;
let releasePath;

module.exports = shipit => {
  // Load shipit tasks
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  environment = shipit.environment;

  //   Shipit configuration
  shipit.initConfig({
    default: {
      deployTo: `/root/${config.appName}/${environment}/`,
      repositoryUrl: config.backendRepoUrl,
      branch: 'main',
      keepReleases: 3,
      shallowClone: true,
      shared: {
        overwrite: true,
        dirs: [
          'node_modules',
          {
            path: 'uploads',
            chmod: '-R 777'
          }
        ]
      }
    },
    ...config.servers
  });
  shipit.config.deployTo = shipit.config.deployTo + end;

  // Our listeners and tasks will go here
  shipit.on('updated', () => {
    releasePath = shipit.releasePath;
    shipit.start('yarn-install', 'copy-config');
  });

  shipit.on('published', () => {
    shipit.start('pm2-server');
  });

  shipit.blTask('copy-config', async () => {
    // Creating env and nginx file on server
    await shipit.copyToRemote(
      `.shipit/config/nginx/${environment}.nginx`,
      `/etc/nginx/sites-available/${config.appName}-${environment}.conf`,
      {
        rsync: '--rsync-path="sudo rsync"'
      }
    );
    await shipit.copyToRemote(`.shipit/config/env/${environment}.env`, `${releasePath}/.env`);
    await shipit.remote(`sudo systemctl restart nginx`);
  });

  shipit.blTask('yarn-install', async () => {
    await shipit.remote(`cd ${releasePath} && yarn install --production`);
  });

  shipit.blTask('pm2-server', async () => {
    await shipit.remote(`pm2 delete -s ${config.appName}-${environment} || :`);
    await shipit.remote(
      `cd ${releasePath} && pm2 start index.js --name ${config.appName}-${environment} --watch true`
    );
  });

  shipit.on('rollback', () => {
    shipit.start('yarn-install', 'copy-config');
  });
};
