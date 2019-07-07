module.exports = {
  apps : [{
    name: 'web',
    script: 'web.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    time: true
    instances: 5,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
