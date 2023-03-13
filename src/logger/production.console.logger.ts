import { isDefined, isError } from '@cloudize/json';
import { ILogger, LoggerMessageType, LoggerPayload } from '../interfaces/logger';

// eslint-disable-next-line import/prefer-default-export
const ProductionConsoleLogger: ILogger = class {
  static Write = async (type: LoggerMessageType, message: string, payload?: LoggerPayload, date?: Date): Promise<void> => {
    if ((type !== LoggerMessageType.Debug)) {
      let messageDate = date;
      if (!messageDate) {
        messageDate = new Date();
      }

      let typeStr: string = type;
      while (typeStr.length < 7) typeStr += ' ';

      // eslint-disable-next-line no-console
      console.log(`${messageDate.toISOString()} ${typeStr.toUpperCase()} ${message}`);

      if (isDefined(payload)) {
        let payloadObject = payload;
        if (isError(payload)) payloadObject = { name: payload.name, message: payload.message };

        // eslint-disable-next-line no-console
        console.log(`${messageDate.toISOString()} PAYLOAD ${JSON.stringify(payloadObject)}`);
      }
    }
  };
};

export default ProductionConsoleLogger;
