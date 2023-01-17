module.exports = {
  apps: [
    {
      name: 'arcaWWW',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: '.output/server/index.mjs',
      env: {
        PORT: '4043',
      },
    },
  ],
};
