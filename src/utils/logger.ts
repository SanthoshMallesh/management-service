import * as winston from 'winston';
import {logLevel as level} from '../config';
const {combine, timestamp, printf, splat, simple} = winston.format;

export class Logger {
  private correlationId: string;
  static logger: winston.Logger;
  static initiateLogger() {
    const customFormat = printf(info => {
      if (Array.isArray(info.message)) {
        return `${info.level.toUpperCase()}:${info.message[1]}:[${
          info.timestamp
        }] ${info.message[0]}`;
      }
      return `${info.level.toUpperCase()}: [${info.timestamp}] ${info.message}`;
    });

    const format = combine(splat(), timestamp(), simple(), customFormat);
    const dt = new Date();
    const date = `${dt.getDate()}-${dt.getMonth() + 1}-${dt.getFullYear()}`;
    this.logger = winston.createLogger({
      level,
      format,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `logs/logs_${date}.log`,
        }),
      ],
    });
  } // initiateLogger ends

  setCorrelationId(correlationId: string) {
    this.correlationId = correlationId;
  }

  info(...args: winston.LeveledLogMethod[]) {
    args.push(this.correlationId as unknown as winston.LeveledLogMethod);
    return Logger.logger.info(args);
  }

  error(...args: winston.LeveledLogMethod[]) {
    args.push(this.correlationId as unknown as winston.LeveledLogMethod);
    return Logger.logger.error(args);
  }

  debug(...args: winston.LeveledLogMethod[]) {
    args.push(this.correlationId as unknown as winston.LeveledLogMethod);
    return Logger.logger.debug(args);
  }
}
