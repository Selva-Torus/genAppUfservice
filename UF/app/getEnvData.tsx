let data:any ={
  "TG2DPD": {
    "encryptionType": {
      "name": "encryptionType",
      "_type": "select",
      "selectionList": [
        "vault",
        "AESGCM",
        "AESCTR",
        "RSA"
      ],
      "value": "",
      "enabled": true
    },
    "encryptionInfo": {
      "name": "encryptionInfo",
      "_type": "array",
      "items": [
        {
          "type": "vault",
          "url": "https://vaultdr.gsstvl.com",
          "key": "torus9x-cmk",
          "token": "s.LXcFbr59qFPTgXdD1lL5tFjK"
        },
        {
          "type": "AESGCM",
          "mode": "aes-256-gcm",
          "Key": "w9dH6b9t3JH9L4MvqIgFbq12H2nm8D9AoG7j0ZCxOrk=",
          "IVlength": "MTIzNDU2Nzg5MDEyMzQ1Ng=="
        },
        {
          "type": "AESCTR",
          "mode": "aes-256-ctr",
          "Key": "w9dH6b9t3JH9L4MvqIgFbq12H2nm8D9AoG7j0ZCxOrk=",
          "IVlength": "MTIzNDU2Nzg5MDEyMzQ1Ng=="
        },
        {
          "type": "RSA",
          "privateKey": "-----BEGIN RSA PRIVATE KEY----- MIICXAIBAAKBgQC2WHaJLVfJ3V+9LDFFFyBDNTwCozqdCfyoYWJwZ3n2vUDBtEme VI6HbFaQjN9pPZ5u/s3R7kjnvsYxpXBaYIsQx+Cwd7fQaxk+3UE6vajxAzHVqs1I oDbHkRSyE35oTPVE6G5Bd4643ilt4MIDkKEqb68mzJi+u0/f91+9K560IwIDAQAB AoGALeFwYe/AyRAkiMrX0tSQz5hTcy5zDxR2OD/YrwO6UnUoGBUu+OG5wyVlWpW3 mRliBfei/hGA0p7T66X+8R6dnrxCiJhlm2uPypC1Xgxk7iqB2T1/xzAyKbeX3HgS 7yQOeoOjfwrYB78OEAsIde9GX1X/+br6O8XZI9hu8wx4KTECQQDpA7v8XV22DSdQ demSOgJJNKckGxvhUWSx4tEVPF11YfqJzFK3g0K3OsmWshL3H4wSWFhIKoA9KqJz DpcfylCXAkEAyFUx6eKR/JDLQSjbN76gfdDJEVh2lLXZ8vLZI4a0QwLfR4gmufk5 /jrRumvUiQunTQyKmRwjeo+GtM2p48neVQJBAIX9xb3LGrYzPiZAh720adga1Poo NJIOse6w1TZ27e8wFlfjDLXGXzjqLz3ezJUaqPtrnehxuCh0OdIb079OIaUCQDOg SOmmGssEoWycU8oM1R03Remza3OtXYpPbQfLuf6e6d1sR9abVIegrtWk3jOnDik7 9ye36ai2/hbv/T0Xk7UCQHHQp+bIteUBc8gZxPoETGQ1y3qKWkdRhUZIIL9TVpbe 7oy3zJSB1jHidzgNn2F2oHOUshmWCg5yyoQ5udWJXC4= -----END RSA PRIVATE KEY-----",
          "publicKey": "-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2WHaJLVfJ3V+9LDFFFyBDNTwC ozqdCfyoYWJwZ3n2vUDBtEmeVI6HbFaQjN9pPZ5u/s3R7kjnvsYxpXBaYIsQx+Cw d7fQaxk+3UE6vajxAzHVqs1IoDbHkRSyE35oTPVE6G5Bd4643ilt4MIDkKEqb68m zJi+u0/f91+9K560IwIDAQAB -----END PUBLIC KEY-----"
        }
      ],
      "enabled": true
    }
  }
};

const getEnvData = (dpdKey: string,method: string) => {
  let artifactName = dpdKey.split(":")[11];
  let result:any =data[artifactName]
  return result;
}
export default getEnvData