import * as crypto from 'crypto';

// Encrypts short-lived bearer tokens before they're persisted anywhere
// outside the request lifecycle — e.g. BullMQ job payloads, which live in
// Redis for the job's lifetime (indefinitely for failed jobs) and are
// readable by anything with network reach to Redis. Uses the same
// AES-256-CTR scheme (fresh random IV per call, embedded in the output) as
// CommonService.aes256ctrEncrypt/Decrypt, kept as a standalone, dependency-free
// pair so callers outside CommonService's DI graph (e.g. the scheduler
// module) don't need to pull in its full provider chain just for this.
const IV_MARKER = Buffer.from('TOKENCTRV1:', 'utf8');

export function encryptToken(token: string): string {
  const key = Buffer.from(process.env.AES_KEY, 'base64');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(token, 'utf8')), cipher.final()]);
  return Buffer.concat([IV_MARKER, iv, encrypted]).toString('base64');
}

export function decryptToken(encryptedToken: string): string {
  const key = Buffer.from(process.env.AES_KEY, 'base64');
  const buf = Buffer.from(encryptedToken, 'base64');
  const markerLen = IV_MARKER.length;
  if (buf.length < markerLen + 16 || !buf.subarray(0, markerLen).equals(IV_MARKER)) {
    throw new Error('Malformed encrypted token');
  }
  const iv = buf.subarray(markerLen, markerLen + 16);
  const ciphertext = buf.subarray(markerLen + 16);
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
