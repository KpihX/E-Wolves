// Système de logging centralisé pour le débogage
export interface LogEntry {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  component: string;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Limite pour éviter les fuites mémoire

  private log(level: LogEntry['level'], component: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      component,
      message,
      data
    };

    this.logs.push(entry);
    
    // Maintenir la limite
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output en développement
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    if (isDev) {
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      const prefix = `[${timestamp}][${component}]`;
      
      switch (level) {
        case 'debug':
          console.debug(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'error':
          console.error(prefix, message, data);
          break;
      }
    }
  }

  debug(component: string, message: string, data?: any) {
    this.log('debug', component, message, data);
  }

  info(component: string, message: string, data?: any) {
    this.log('info', component, message, data);
  }

  warn(component: string, message: string, data?: any) {
    this.log('warn', component, message, data);
  }

  error(component: string, message: string, data?: any) {
    this.log('error', component, message, data);
  }

  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Helper pour les composants React
export const useLogger = (componentName: string) => {
  return {
    debug: (message: string, data?: any) => logger.debug(componentName, message, data),
    info: (message: string, data?: any) => logger.info(componentName, message, data),
    warn: (message: string, data?: any) => logger.warn(componentName, message, data),
    error: (message: string, data?: any) => logger.error(componentName, message, data),
  };
};