'use client'

import { publicEncrypt } from 'crypto';
import * as crypto from 'crypto';
const NodeRSA = require('node-rsa')

export async function clientDecrypt(Credentials:any,value:any,context:string) {
      try {          
        const Method = Credentials.type;
        let getCredentials: any = {
          encCredentials:Credentials,
          encMethod:Method
          }
        if (getCredentials) {
          let encryptCredentials = getCredentials?.encCredentials
          let encMethod = getCredentials?.encMethod
    
          if (encMethod && encryptCredentials) {
            if (encMethod == 'AESCTR') {
              const key = Uint8Array.from(Buffer.from(encryptCredentials.Key, 'base64'))
              const iv = Uint8Array.from(Buffer.from(encryptCredentials.IVlength, 'base64'))
   
              const encryptedBase64 = value.ciphertext
              const decipher = crypto.createDecipheriv(
                encryptCredentials.mode,
                key,
                iv
              )
   
              let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8')
              decrypted += decipher.final('utf8')
 
              return   JSON.parse(JSON.parse(decrypted))
            } else if (encMethod == 'AESGCM') {
              const key = Uint8Array.from(Buffer.from(encryptCredentials.Key, 'base64'))
              const iv = Uint8Array.from(Buffer.from(encryptCredentials.IVlength, 'base64'))
              const encryptedBase64 = value.ciphertext
              const authTag = value?.authTag

              const decipher = crypto.createDecipheriv(encryptCredentials.mode,key,iv)
              decipher.setAuthTag(Uint8Array.from(Buffer.from(authTag, 'base64')));
              let decrypted = decipher.update(JSON.stringify(encryptedBase64),'base64','utf8')

              decrypted += decipher.final('utf8')
              
              return   JSON.parse(JSON.parse(decrypted)) 
            } else if (encMethod == 'RSA') {
              try {
              const encryptedBase64 = value.ciphertext
              const key = new NodeRSA(encryptCredentials.privateKey)

              const decrypted = key.decrypt(encryptedBase64, 'utf8')
              return JSON.parse(JSON.parse(decrypted))
              } catch (error) {
              console.error('Decryption error:', error)
              throw error
              }
            } else {
              throw 'Invalied Decryption Method'
            }
          }
        }
      } catch (error: any) {
        return{ error: 'Decryption failed' , status: 500 }
      }
}