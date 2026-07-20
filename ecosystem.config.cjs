// PM2 production process manager config for Balaji / Bala G Pet Clinic Web
// (Next.js, next start). Env vars come from .env.production.local.
//
// Usage:
//   pm2 start ecosystem.config.cjs
//   pm2 logs balaji-web
//   pm2 reload balaji-web

module.exports = {
  apps: [
    {
      name: 'balaji-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3300',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      out_file: './logs/balaji-web.out.log',
      error_file: './logs/balaji-web.error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
