
    'use client'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import decodeToken from '@/app/components/decodeToken'
import { getCookie } from '@/app/components/cookieMgment'
import React, { use, useContext, useEffect } from 'react'
const ForNotFound = (props: any) => {
   const {savef2390, setsavef2390}= useContext(TotalContext) as TotalContextProps;
  const toast = useInfoMsg()
  useEffect(() => {
    if (!props?.basicinfo?.rate_ref_no && !props?.basicinfo?.rate_cust_id) {
      let forex_amount = Number(props?.basicinfo?.forex_amount)
      let exchange_rate = Number(props?.basicinfo?.exchange_rate)
      if (
        props?.basicinfo?.rate_code == 'TTS' ||
        props?.basicinfo?.rate_code == 'MEAN'
      ) {
        if (!isNaN(forex_amount) && !isNaN(exchange_rate)) {
          props?.setbasicinfo((prev: any) => {
            return {
              ...prev,
              base_amount: forex_amount * exchange_rate
            }
          })
        }
      } else if (props?.basicinfo?.rate_code == 'TTB') {
        if (!isNaN(forex_amount) && !isNaN(exchange_rate)) {
          props?.setbasicinfo((prev: any) => {
            return {
              ...prev,
              base_amount: forex_amount / exchange_rate
            }
          })
        }
      } else {
        toast('No values in rate code field', 'danger')
      }
    }
  }, [props?.basicinfo?.forex_amount, props?.basicinfo?.exchange_rate])


  useEffect(() => {

    if(props?.commoninfo?.dr_cust_ac_sanc_lmt<props?.basicinfo?.base_amount){
      setsavef2390((prev:any)=>({...prev,isDisabled:true}))
    }else
    {
      setsavef2390((prev:any)=>({...prev,isDisabled:false}))
    }



  },[props?.basicinfo?.base_amount])

  return null
}
export default ForNotFound
  
