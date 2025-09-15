interface LogLevel {
  ERROR: "error"
  WARN: "warn"
  INFO: "info"
  DEBUG: "debug"
}

const LOG_LEVELS: LogLevel = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private log(level: keyof LogLevel, message: string, data?: any) {
    if (this.isDevelopment) {
      console[level](message, data || "")
    }

    // In production, you could send logs to a service like LogRocket, Sentry, etc.
    // Example: logService.send({ level, message, data, timestamp: new Date() })
  }

  error(message: string, data?: any) {
    this.log("ERROR", `[ERROR] ${message}`, data)
  }

  warn(message: string, data?: any) {
    this.log("WARN", `[WARN] ${message}`, data)
  }

  info(message: string, data?: any) {
    this.log("INFO", `[INFO] ${message}`, data)
  }

  debug(message: string, data?: any) {
    this.log("DEBUG", `[DEBUG] ${message}`, data)
  }
}

export const logger = new Logger()
