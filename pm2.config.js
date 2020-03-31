module.exports = {
    apps: [
        {
            name: 'agrec',
            script: 'node_modules/.bin/ts-node',

            // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
            args: '-T src/api/_start.ts',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
}
