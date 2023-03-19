import { ILogger, LoggerMessageType } from '@cloudize/logger';

export type ShutdownCleanupHandler = () => Promise<void>;

export function RegisterShutdownHandler(logger: ILogger, cleanupHandler: ShutdownCleanupHandler) {
  process.on('SIGTERM', async () => {
    await logger.Write(
      LoggerMessageType.Info,
      'The service has received a SIGTERM. Waiting for the service to achieve a clean state for a safe shutdown.',
    );
    await cleanupHandler();
    await logger.Write(LoggerMessageType.Info, 'The process is in a clean state and will shutdown now');

    process.exit(0);
  });
}
