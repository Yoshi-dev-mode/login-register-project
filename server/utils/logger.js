const { format, createLogger, transports}= require('winston');
const { combine, timestamp, printf, json } = format;
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
require('dotenv').config()

const logtail = new Logtail(process.env.WINSTON_TOKEN)
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
