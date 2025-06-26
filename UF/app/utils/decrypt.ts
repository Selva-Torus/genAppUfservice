'use server'
import vault from 'node-vault';
import { publicEncrypt } from 'crypto';
import * as crypto from 'crypto';

export async function decryptData(Credentials:any,value:any,context:string) {
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
            if (encMethod === 'vault') {
              const vaultClient = vault({
                apiVersion: 'v1',
                endpoint: encryptCredentials.url,
                token: encryptCredentials.token
              })
              let ciphertext = value.ciphertext
              const result = await vaultClient.write(
                `transit/decrypt/${encryptCredentials.key}`,
                {
                  ciphertext, // value should be the ciphertext string from Vault
                  context: Buffer.from(context).toString(
                    'base64'
                  )
                }
              )
    
              let decoded = Buffer.from(result.data.plaintext, 'base64').toString(
                'utf8'
              )
              let res = JSON.parse(JSON.parse(decoded))    
              return  res 
            }else {
              throw 'Invalied Decryption Method'
            }
          }
        }
      } catch (error: any) {
        return{ error: 'Decryption failed' , status: 500 }
      }
}