import { isUndefinedOrNull } from '@cloudize/json';

export default function ValidateApiKeys(privateKey: string, publicKey: string) {
  if (isUndefinedOrNull(privateKey) || (privateKey === '')) {
    throw new Error('The private key environment variable is not set. Please review your settings');
  }

  if (isUndefinedOrNull(publicKey) || (publicKey === '')) {
    throw new Error('The public key environment variable is not set. Please review your settings');
  }
}
