module.exports = {
  apps : [{
    name: 'scrape',
    script: 'scrape.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    time: true,
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exec_mode : "cluster",
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
};
