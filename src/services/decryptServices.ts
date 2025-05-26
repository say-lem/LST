import { rsaKeys } from '../config/keys';
import { RSAUtils } from '../utils/encryption';
import { BadRequestError } from '../utils/errorClasses';

/**
 * Decrypts a base64-encoded RSA-encrypted string.
 *
 * @param encryptedData - The base64 string to decrypt.
 * @returns The decrypted plaintext string.
 * @throws BadRequestError if the decryption fails.
 */
export const decryptSensitiveData = async (encryptedData: string): Promise<string> => {
  if (!rsaKeys?.privateKey) {
    throw new Error('RSA private key is not configured in environment variables');
  }

  try {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = RSAUtils.decrypt(rsaKeys.privateKey, buffer)?.toString();

    if (!decrypted) {
      throw new BadRequestError('Decryption returned empty result. Data may be invalid or corrupted.');
    }

    return decrypted;
  } catch (error: any) {
    throw new BadRequestError('Failed to decrypt data: Invalid encryption format or corrupted data');
  }
};
