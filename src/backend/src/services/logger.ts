const winston = require('winston');

const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
  ignoreRoute: (req: { path: string }, res: any) => req.path === '/healthz',
});

export default Logger;
