/**
 * Logger levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  level: LogLevel;
  enableColors: boolean;
  context?: string;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableColors: process.env.NODE_ENV !== 'production',
};

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

/**
 * Creates a logger instance with specified configuration
 * 
 * @param customConfig Custom logger configuration
 * @returns Logger object with logging methods
 */
export function createLogger(customConfig?: Partial<LoggerConfig>) {
  const config = { ...defaultConfig, ...customConfig };
  
  /**
   * Gets the current timestamp in ISO format
   */
  const getTimestamp = () => new Date().toISOString();
  
  /**
   * Formats a log message with timestamp and context
   */
  const formatMessage = (level: string, message: string) => {
    const timestamp = getTimestamp();
    const context = config.context ? `[${config.context}]` : '';
    return `${timestamp} ${level}${context}: ${message}`;
  };
  
  /**
   * Logs a message with the specified level
   */
  const log = (level: LogLevel, levelStr: string, color: string, message: any, ...args: any[]) => {
    if (level < config.level) return;
    
    const formattedMessage = formatMessage(levelStr, typeof message === 'string' ? message : JSON.stringify(message));
    
    if (config.enableColors) {
      console.log(`${color}${formattedMessage}${colors.reset}`, ...args);
    } else {
      console.log(formattedMessage, ...args);
    }
  };
  
  return {
    debug: (message: any, ...args: any[]) => 
      log(LogLevel.DEBUG, 'DEBUG', colors.gray, message, ...args),
    
    info: (message: any, ...args: any[]) => 
      log(LogLevel.INFO, 'INFO', colors.green, message, ...args),
    
    warn: (message: any, ...args: any[]) => 
      log(LogLevel.WARN, 'WARN', colors.yellow, message, ...args),
    
    error: (message: any, ...args: any[]) => 
      log(LogLevel.ERROR, 'ERROR', colors.red, message, ...args),
    
    /**
     * Create a child logger with a specific context
     */
    child: (context: string) => 
      createLogger({ ...config, context: config.context ? `${config.context}:${context}` : context }),
  };
}

/**
 * Default logger instance
 */
export const logger = createLogger();

export default logger;
