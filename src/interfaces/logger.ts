// eslint-disable-next-line no-shadow
export enum LoggerMessageType {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
  Debug = 'Debug',
}

export type LoggerPayload = any;

export interface ILogger {
  Write(type: LoggerMessageType, message: string, payload?: LoggerPayload, date?: Date): Promise<void>;
}
