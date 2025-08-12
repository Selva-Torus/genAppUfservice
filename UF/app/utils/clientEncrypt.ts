'use client'

import { publicEncrypt } from 'crypto';
import * as crypto from 'crypto';
const NodeRSA = require('node-rsa')



export async function clientEncrypt(Credentials:any,value:string,context:string) {
    try {        
        // const { Credentials, Method,value, context } = body;
        const Method = Credentials.type;
        let getCredentials :any = {
          encCredentials:Credentials,
          encMethod:Method
          }
        if(getCredentials){
          let encryptCredentials = getCredentials?.encCredentials
          let encMethod = getCredentials?.encMethod
    
          if(encMethod && encryptCredentials){
            if(encMethod == 'AESCTR'){
              const key =  Uint8Array.from(Buffer.from(encryptCredentials.Key, 'base64')); 
              const iv = Uint8Array.from(Buffer.from(encryptCredentials.IVlength, 'base64'));
              const cipher = crypto.createCipheriv(encryptCredentials.mode,key,iv);     
              let ciphertext = cipher.update(JSON.stringify(value), 'utf8', 'base64');      
              // ciphertext += cipher.final('base64');    
    
              return ciphertext += cipher.final('base64');
            }else if(encMethod == 'AESGCM'){  
              const key =  Uint8Array.from(Buffer.from(encryptCredentials.Key, 'base64'));
              const iv = Uint8Array.from(Buffer.from(encryptCredentials.IVlength, 'base64'));
 
              const cipher = crypto.createCipheriv(encryptCredentials.mode, key, iv);
              let ciphertext = cipher.update(JSON.stringify(value), 'utf8', 'base64');
              ciphertext += cipher.final('base64');
 
              const authTag = cipher.getAuthTag().toString('base64');
                     
              return {ciphertext,authTag};
            }else if (encMethod == 'RSA') {
            try {
              const publicKey = encryptCredentials.publicKey
              const encryptData = async (data: string) => {
                const key = new NodeRSA(publicKey)
                return key.encrypt(data, 'base64') 
              }

              const sensitiveData = value
              const encryptedData = await encryptData(
                JSON.stringify(sensitiveData)
              )
              return encryptedData
              } catch (error) {
              console.error('RSA encryption error:', error)
              }
            } else{
              throw 'Invalied Encryption Method'
            }
          }
        }
      } catch (error: any) {
        console.error('Vault encryption error:', error);
        return { error: 'Encryption failed' ,status: 500 };
      }
}