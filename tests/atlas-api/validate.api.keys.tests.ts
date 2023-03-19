import { ValidateApiKeys } from '../../src/atlas-api';

describe('The ValidateApiKeys() function', () => {
  it('should throw an error when the privateKey parameter is undefined', async () => {
    try {
      ValidateApiKeys(undefined, 'value');
      expect(true).toBe('The method did not throw as expected');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('The private key environment variable is not set. Please review your settings');
    }
  });

  it('should throw an error when the privateKey parameter is an empty string', async () => {
    try {
      ValidateApiKeys('', 'value');
      expect(true).toBe('The method did not throw as expected');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('The private key environment variable is not set. Please review your settings');
    }
  });

  it('should throw an error when the publicKey parameter is undefined', async () => {
    try {
      ValidateApiKeys('value', undefined);
      expect(true).toBe('The method did not throw as expected');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('The public key environment variable is not set. Please review your settings');
    }
  });

  it('should throw an error when the publicKey parameter is an empty string', async () => {
    try {
      ValidateApiKeys('value', '');
      expect(true).toBe('The method did not throw as expected');
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('The public key environment variable is not set. Please review your settings');
    }
  });
});
