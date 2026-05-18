let data:any ={
  "defaultDPD": {
    "encryptionInfo": {
      "name": "encryptionInfo",
      "_type": "array",
      "items": [
        {
          "key": "",
          "url": "",
          "type": "vault",
          "token": ""
        },
        {
          "Key": "",
          "mode": "aes-256-gcm",
          "type": "AESGCM",
          "IVlength": ""
        },
        {
          "Key": "",
          "mode": "aes-256-ctr",
          "type": "AESCTR",
          "IVlength": ""
        },
        {
          "type": "RSA",
          "publicKey": "",
          "privateKey": ""
        },
        {
          "type": "PKI",
          "publicKey": "",
          "privateKey": ""
        }
      ],
      "enabled": true
    },
    "encryptionType": {
      "name": "encryptionType",
      "_type": "select",
      "value": "",
      "enabled": true,
      "selectionList": [
        "vault",
        "AESGCM",
        "AESCTR",
        "RSA",
        "PKI"
      ]
    }
  }
};

const getEnvData = (dpdKey: string,method: string) => {
  let artifactName = dpdKey.split(":")[11];
  let result:any =data[artifactName]
  return result;
}
export default getEnvData