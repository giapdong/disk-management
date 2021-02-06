import winston, { createLogger, transports } from "winston";
import { NODE_ENV } from "./enviroments";

const logLevel = NODE_ENV === "production" ? "info" : "silly";

winston.addColors({
  error: "bold red",
  warn: "bold yellow",
  info: "bold white",
  http: "bold white",
  verbose: "bold white",
  debug: "bold blue",
  silly: "bold gray"
});

const logger: winston.Logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ],
  exitOnError: false // do not exit on handled exceptions
});

export default logger;
