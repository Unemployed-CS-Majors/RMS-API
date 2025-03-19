const { info, debug, warn, error, write } = require("firebase-functions/logger");
const chalk = require("chalk");
const util = require("util");
const dayjs = require("dayjs");

// Force chalk to always use colors
chalk.level = 3;

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4,
  NONE: 5,
};

const LevelStyles = {
  [LogLevel.DEBUG]: chalk.cyan,
  [LogLevel.INFO]: chalk.blue,
  [LogLevel.WARN]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
  [LogLevel.CRITICAL]: chalk.bgRed.white,
};

class FirebaseLogger {
  constructor(config = {}) {
    this.logLevel = config.logLevel || this._getDefaultLogLevel();
    this.defaultMeta = config.defaultMeta || {};
    this.isProduction = process.env.NODE_ENV === "production";
    this.isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
  }

  _getDefaultLogLevel() {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    return LogLevel[level] || LogLevel.INFO;
  }

  _shouldLog(level) {
    return level >= this.logLevel;
  }

  _formatMessage(level, message) {
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
    const levelName = Object.keys(LogLevel).find((key) => LogLevel[key] === level);
    const style = LevelStyles[level] || chalk.white;

    const formatted = [
      chalk.gray(`[${timestamp}]`),
      style.bold(`[${levelName.padEnd(7)}]`),
      chalk.white(message),
    ].join(" ");

    return formatted;
  }

  _formatData(data) {
    if (!data || typeof data !== "object") return "";
    return (
      "\n" +
      util.inspect(data, {
        colors: true,
        depth: 5,
        compact: false,
        sorted: true,
        breakLength: process.stdout.columns || 80,
      })
    );
  }

  _logToConsole(level, message, data) {
    const formattedMessage = this._formatMessage(level, message, data);
    const formattedData = this._formatData(data);
    const output = formattedMessage + formattedData;

    if (level >= LogLevel.ERROR) {
      console.error(output);
    } else {
      console.log(output);
    }
  }

  _logToCloud(level, message, data) {
    const logData = { ...this.defaultMeta, ...data };
    const logMessage = `${message}`;

    switch (level) {
    case LogLevel.DEBUG:
      debug(logMessage, logData);
      break;
    case LogLevel.INFO:
      info(logMessage, logData);
      break;
    case LogLevel.WARN:
      warn(logMessage, logData);
      break;
    case LogLevel.ERROR:
      error(logMessage, logData);
      break;
    default:
      write(logMessage, logData);
    }
  }

  log(level, message, data = {}) {
    if (!this._shouldLog(level)) return;

    if (this.isEmulator) {
      this._logToConsole(level, message, data);
    } else {
      this._logToCloud(level, message, data);
    }
  }

  debug(message, data) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message, data) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message, data) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message, error, data = {}) {
    const errorData = {
      ...data,
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack,
    };

    if (this.isEmulator) {
      const messageParts = [
        chalk.redBright.bold("✖ ERROR:"),
        chalk.white(message),
        chalk.redBright(error?.message || "Unknown error"),
      ];

      const stackTrace = error?.stack ?
        "\n" + chalk.gray(error.stack.split("\n").slice(1).join("\n")) :
        "";

      console.error(messageParts.join(" ") + stackTrace);
      return;
    }

    this.log(LogLevel.ERROR, message, errorData);
  }

  critical(message, error, data = {}) {
    const errorData = {
      ...data,
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack,
    };

    if (this.isEmulator) {
      const messageParts = [
        chalk.bgRed.white.bold(" CRITICAL "),
        chalk.white(message),
        chalk.redBright(error?.message || "Unknown error"),
      ];

      const stackTrace = error?.stack ?
        "\n" + chalk.gray(error.stack.split("\n").slice(1).join("\n")) :
        "";

      console.error(messageParts.join(" ") + stackTrace);
      return;
    }

    this.log(LogLevel.CRITICAL, message, errorData);
  }

  httpMiddleware() {
    return (req, res, next) => {
      const start = process.hrtime();
      const method = req.method.padEnd(6);
      const url = req.originalUrl;

      // Log request
      if (this.isEmulator) {
        console.log(
          chalk.white.bold(method) +
            chalk.cyan(url) +
            chalk.gray(" → ") +
            chalk.blue("Request received"),
        );
      } else {
        debug("HTTP Request", {
          httpRequest: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.body,
          },
        });
      }

      res.on("finish", () => {
        const duration = process.hrtime(start);
        const ms = (duration[0] * 1e3 + duration[1] * 1e-6).toFixed(2);
        const status = res.statusCode;

        if (this.isEmulator) {
          const statusColor =
            status >= 500 ? chalk.red : status >= 400 ? chalk.yellow : chalk.green;

          console.log(
            chalk.white.bold(method) +
              chalk.cyan(url) +
              chalk.gray(" ← ") +
              statusColor(`${status} `) +
              chalk.gray(`${ms}ms`),
          );
        } else {
          info("HTTP Response", {
            httpRequest: {
              status,
              duration: `${ms}ms`,
              method: req.method,
              url: req.originalUrl,
            },
          });
        }
      });

      next();
    };
  }

  child(additionalMeta) {
    return new FirebaseLogger({
      logLevel: this.logLevel,
      defaultMeta: { ...this.defaultMeta, ...additionalMeta },
    });
  }

  setLogLevel(level) {
    if (typeof level === "string") {
      this.logLevel = LogLevel[level.toUpperCase()] || LogLevel.INFO;
    } else {
      this.logLevel = level;
    }
  }
}

// Singleton instance
const logger = new FirebaseLogger();

module.exports = {
  logger,
  LogLevel,
  FirebaseLogger,
};
