module.exports = {
  apps : [
  {
    name: 'noiseMaker',
    script: 'noiseMaker.js',
    error_file: './logs/noise-maker-err.log',
    out_file: './logs/noise-maker-out.log',
    time: true,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exec_mode : "cluster",
    env: {
      NODE_ENV: 'development',
      PORT: 4000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  },
  ]
};
