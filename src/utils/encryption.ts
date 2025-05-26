import * as crypto from 'crypto';

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class RSAUtils {
  /**
   * Generates an RSA key pair.
   * @param passphrase Optional passphrase to encrypt the private key.
   * @returns Promise resolving to a KeyPair object.
   */
  static generateKeyPair(passphrase = ''): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        'rsa',
        {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: passphrase ? 'aes-256-cbc' : undefined,
            passphrase,
          },
        },
        (err, publicKey, privateKey) => {
          if (err) return reject(new Error(`Key pair generation failed: ${err.message}`));
          resolve({ publicKey, privateKey });
        }
      );
    });
  }

  /**
   * Encrypts plaintext using the recipient's RSA public key.
   * @param publicKey RSA public key in PEM format.
   * @param plaintext The plaintext to encrypt.
   * @returns Encrypted data as a Buffer.
   */
  static encrypt(publicKey: string, plaintext: string): Buffer {
    return crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(plaintext, 'utf-8')
    );
  }

  /**
   * Decrypts RSA-encrypted data using the private key.
   * @param privateKey RSA private key in PEM format.
   * @param encrypted Buffer containing encrypted data.
   * @param passphrase Optional passphrase if private key is encrypted.
   * @returns Decrypted data as a Buffer.
   */
  static decrypt(privateKey: string, encrypted: Buffer, passphrase = ''): Buffer {
    return crypto.privateDecrypt(
      {
        key: privateKey,
        passphrase,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      encrypted
    );
  }

  /**
   * Signs a message using an RSA private key.
   * @param privateKey RSA private key in PEM format.
   * @param message The message to sign.
   * @returns Signature in base64 format.
   */
  static sign(privateKey: string, message: string): string {
    const signer = crypto.createSign('sha256');
    signer.update(message);
    signer.end();
    return signer.sign(privateKey, 'base64');
  }

  /**
   * Verifies a message signature using an RSA public key.
   * @param publicKey RSA public key in PEM format.
   * @param message The original message.
   * @param signature Signature in base64 format.
   * @returns Boolean indicating if the signature is valid.
   */
  static verify(publicKey: string, message: string, signature: string): boolean {
    const verifier = crypto.createVerify('sha256');
    verifier.update(message);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
  }
}
