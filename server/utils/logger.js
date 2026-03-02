const { format, createLogger, transports}= require('winston');
const { combine, timestamp, printf, json } = format;
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const token = 'cUZJEnxQztPhT2tzuf3GP8zQ'
const logtail = new Logtail(token)
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      format: combine(
        timestamp(),
        logFormat
      )
    }),

    new LogtailTransport(logtail, {
      format: combine(timestamp(), json())
    }),

    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp(),
        json()
      )
    })
  ],
  defaultMeta: {service:'auth-service'}
});

module.exports = logger;
