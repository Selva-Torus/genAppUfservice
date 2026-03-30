import * as crypto from 'crypto';
const ALGORITHM = 'aes-256-gcm' as const;
const KEY_LENGTH = 32;

const REDIS_KEY = (() => {
    if (!process.env.REDIS_AES_KEY) {
        throw new Error('REDIS_AES_KEY is not set');
    }

    const key = Buffer.from(process.env.REDIS_AES_KEY, 'base64');

    if (key.length !== KEY_LENGTH) {
        throw new Error(`REDIS_AES_KEY must be 32 bytes, got ${key.length}`);
    }

    return key;
})();


function decryptWithKey<T = unknown>(payload: string, key: Buffer): T {
  try {
    const parsed: any = JSON.parse(payload);

    if (parsed.v !== 1) {
        throw new Error(`Unsupported version: ${parsed.v}`);
    }

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(parsed.iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(parsed.tag, 'base64'));

    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(parsed.data, 'base64')),
        decipher.final(),
    ]);

    return JSON.parse(plaintext.toString('utf8')) as T;
    } catch (err) {
    throw new Error('Failed to decrypt payload');
  }
}

export function decrypt<T = unknown>(payload: string): T {
    return decryptWithKey<T>(payload, REDIS_KEY);
}