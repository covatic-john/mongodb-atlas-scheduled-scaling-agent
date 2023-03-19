import { ValidateCronExpression } from '../../src/cron';

describe('The ValidateCronExpression() function', () => {
  it('should throw an error when the expression is invalid', async () => {
    try {
      ValidateCronExpression('invalid', 'test-service');
      expect(true).toBe('The method did not throw as expected');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('The test-service cron expression is invalid. Please review your settings');
    }
  });

  it('should NOT throw an error when the expression is valid', async () => {
    ValidateCronExpression('* * * * *', 'test-service');
  });
});
