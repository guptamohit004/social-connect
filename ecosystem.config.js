// Config file which is being used so as to enable the clustering/PM2 module.
module.exports = {
  apps: [
    {
      name: "app",
      script: "server/clustered.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
    },
  ],
};
