'use server'
import vault from 'node-vault';
import { publicEncrypt } from 'crypto';
import * as crypto from 'crypto';
import { localDecrypt } from '../utils/localCrypto';

export async function encryptData(ciphertext: any) {
    try {        
        const body = await localDecrypt(ciphertext)
        const { Credentials ,value, context } = body;
        const Method = Credentials.type;
        let getCredentials :any = {
          encCredentials:Credentials,
          encMethod:Method
          }
        if(getCredentials){
          let encryptCredentials = getCredentials?.encCredentials
          let encMethod = getCredentials?.encMethod
    
          if(encMethod && encryptCredentials){
            if(encMethod == 'vault'){
              const vaultClient = vault({
                apiVersion: 'v1',
                endpoint: encryptCredentials.url,
                token: encryptCredentials.token,
              });
              const result = await vaultClient.write(`transit/encrypt/${encryptCredentials.key}`, {
                plaintext: Buffer.from(JSON.stringify(value)).toString('base64'),
                context:Buffer.from(context).toString('base64')
              });
              return  result.data.ciphertext ;
            }else{
              throw 'Invalied Encryption Method'
            }
          }
        }
      } catch (error: any) {
        console.error('Vault encryption error:', error);
        return { error: 'Encryption failed' ,status: 500 };
      }
}