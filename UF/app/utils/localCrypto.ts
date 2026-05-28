import * as crypto from 'crypto'

const encryptCredentials = {
  Key: process.env.NEXT_PUBLIC_ENCRYPTIONKEY || '',
  IVlength: process.env.NEXT_PUBLIC_ENCRYPTIONIVLENGTH || '',
  mode: process.env.NEXT_PUBLIC_ENCRYPTIONMODE || ''
}
export async function localEncrypt( encrypt: any ) {
  try {
  const key = Uint8Array.from(Buffer.from(encryptCredentials.Key, 'base64'))
  const iv = Uint8Array.from(Buffer.from(encryptCredentials.IVlength, 'base64'))
  const cipher = crypto.createCipheriv(encryptCredentials.mode, key, iv)
  let ciphertext = cipher.update(JSON.stringify(encrypt), 'utf8', 'base64')
  // ciphertext += cipher.final('base64');

  return (ciphertext += cipher.final('base64'))
  } catch (error) {
    throw new Error(`Local Encryption Error: ${error}`)
  }
}
export async function localDecrypt(ciphertext: any) {
    try {
  const key = Uint8Array.from(Buffer.from(encryptCredentials.Key, 'base64'))
  const iv = Uint8Array.from(Buffer.from(encryptCredentials.IVlength, 'base64'))

  const encryptedBase64 = ciphertext
  const decipher = crypto.createDecipheriv(encryptCredentials.mode, key, iv)

  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
  } catch (error) {
    throw new Error(`Local Decryption Error: ${error}`)
  }
}