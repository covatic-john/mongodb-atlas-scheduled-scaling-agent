import { isFalse } from '@cloudize/json';
import cron from 'node-cron';

export default function ValidateCronExpression(expression: string, name: string) {
  if (isFalse(cron.validate(expression))) {
    throw new Error(`The ${name} cron expression is invalid. Please review your settings`);
  }
}
