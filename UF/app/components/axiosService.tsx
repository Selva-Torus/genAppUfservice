import axios from 'axios'
import { getData } from '../redis/utils/redisFunction'
import { encryptData } from '../utils/encrypt'
import { decryptData } from '../utils/decrypt'
import { clientDecrypt } from '../utils/clientDecrypt'
import { clientEncrypt } from '../utils/clientEncrypt'

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
      let deploymentData =  await getData(config.data.dpdKey+":NDP","ReJSON-RL")
      let deploymentId = Object.keys(deploymentData)[0]
      for (let i = 0; i < deploymentData[deploymentId].data.encryption.encryptionInfo.items.length; i++) {
      if (deploymentData[deploymentId].data.encryption.encryptionInfo.items[i].type === config.data.method) {
        encryptionData["credentials"] = deploymentData[deploymentId].data.encryption.encryptionInfo.items[i];        
        }            
      }
      delete config.data.dpdKey
      delete config.data.method
      let ciphertext : any;
      if(method == "vault"){
        ciphertext = await encryptData(encryptionData.credentials,config.data,"ct242_tob001_tob002_v1")
      }else{
        ciphertext = await clientEncrypt(encryptionData.credentials,config.data,"ct242_tob001_tob002_v1")
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
      let deploymentData =  await getData(response.data.dpdKey+":NDP","ReJSON-RL")
      let deploymentId = Object.keys(deploymentData)[0]
      for (let i = 0; i < deploymentData[deploymentId].data.encryption.encryptionInfo.items.length; i++) {
        if (deploymentData[deploymentId].data.encryption.encryptionInfo.items[i].type === response.data.method) {
          encryptionData["credentials"] = deploymentData[deploymentId].data.encryption.encryptionInfo.items[i];        
        }            
      }
      delete response.data.dpdKey
      delete response.data.method

      if(method == "vault"){
        response.data = await decryptData(encryptionData.credentials,response.data,"ct242_tob001_tob002_v1")
      }else{
        response.data = await clientDecrypt(encryptionData.credentials,response.data,"ct242_tob001_tob002_v1")
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export { AxiosService }
