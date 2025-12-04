import axios from 'axios'
import * as crypto from 'crypto'
import { encryptData } from '../utils/encrypt'
import { decryptData } from '../utils/decrypt'
import { clientDecrypt } from '../utils/clientDecrypt'
import { clientEncrypt } from '../utils/clientEncrypt'
import getEnvData from '../getEnvData'
import {localEncrypt, localDecrypt} from '../utils/localCrypto'
const url = process.env.NEXT_PUBLIC_API_BASE_URL

const AxiosService = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json'
  }
})

AxiosService.interceptors.request.use(
  async (config) => {
     if (config.data && ['post', 'put', 'patch'].includes(config.method || '') && config.data.dpdKey && config.data.method ) {
      let encryptionData:any = {};
      let dpdKey = config.data.dpdKey
      let method = config.data.method
      let authTag: any
      let deploymentData:any =  await getEnvData(config.data.dpdKey,method)
      // let deploymentId = Object.keys(deploymentData)[0]
      for (let i = 0; i < deploymentData.encryptionInfo.items.length; i++) {
      if (deploymentData.encryptionInfo.items[i].type === config.data.method) {
        encryptionData["credentials"] = deploymentData.encryptionInfo.items[i];        
        }            
      }
      delete config.data.dpdKey
      delete config.data.method
      let ciphertext : any;
      if(method == "vault"){
        const encrypt = { Credentials: encryptionData.credentials, value: config.data, context: "ct003_ag001_oprmatrix_v1" }
        const vaultEncrypt = await localEncrypt(encrypt)
        ciphertext = await encryptData(vaultEncrypt)
      }else{
        ciphertext = await clientEncrypt(encryptionData.credentials,config.data,"ct003_ag001_oprmatrix_v1")
      }
      if(method == "AESGCM"){
        authTag = ciphertext?.authTag
        ciphertext = ciphertext.ciphertext  
      }
      config.data = JSON.stringify({ ciphertext, dpdKey , method, authTag}) // send { encrypted: <value> }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

AxiosService.interceptors.response.use(
  async(response:any) => {
    if ( response.data.dpdKey && response.data.method ) {
      let encryptionData:any = {};
      let dpdKey = response.data.dpdKey
      let method = response.data.method
      let deploymentData =  await getEnvData(response.data.dpdKey,method)
      // let deploymentId = Object.keys(deploymentData)[0]
      for (let i = 0; i < deploymentData.encryptionInfo.items.length; i++) {
      if (deploymentData.encryptionInfo.items[i].type === response.data.method) {
        encryptionData["credentials"] = deploymentData.encryptionInfo.items[i];        
        }            
      }
      delete response.data.dpdKey
      delete response.data.method

      if(method == "vault"){
        let vault = await decryptData(response.data, dpdKey)
        response.data = await localDecrypt(vault)
      }else{
        response.data = await clientDecrypt(encryptionData.credentials,response.data,"ct003_ag001_oprmatrix_v1")
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export { AxiosService }
