'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { dateTimeParse } from '@gravity-ui/date-utils';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';

const TorusTimePicker = ({timeType="normal",setting="HH:mm",label="",state="",setState=()=>{}}:any) => {
const [hour, setHour] = useState<string>('00')
  const [minute, setMinute] = useState<string>('00')
  const [second, setSecond] = useState<string>('00')
  const [period, setPeriod] = useState<string>('AM');
  const periods = ['AM', 'PM'];

  const [forFirstTime,setForFirstTime]=useState(false)

  const setTime = () => {
    let time: any =""
    if(timeType="normal")
    {
        if(period=="AM")
        {
            time= `2025-01-23T${hour || '00'}:${minute || '00'}:${second || '00'}Z`
        }else{
            time= `2025-01-23T${parseInt(hour)+12 || '00'}:${minute || '00'}:${second || '00'}Z`
        }

    }else{
        time= `2025-01-23T${hour || '00'}:${minute || '00'}:${second || '00'}Z`
    }
  if(forFirstTime)
    setState((pre: any) => ({ ...pre, [label]: time }))
  setForFirstTime(true)
  }
  useEffect(() => {
    setTime()
  }, [hour, minute, second,period])

  const hours = Array.from({ length: timeType=="normal"?12: 24}, (_, i) =>
    String(i).padStart(2, '0')
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  )
  const seconds = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  )

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHour(e.target.value)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinute(e.target.value)
  }

  const handleSecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecond(e.target.value)
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value)
  }
  const keyset: any = i18n.keyset('language')
return (
  <div className="col-start-11 col-end-13 row-start-1 row-end-2 gap-10px" >
    {/* Hour Selector */}
      <select
        className='rounded-md border border-gray-300  text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={hour}
        onChange={handleHourChange}
      >
        {hours.map(h => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      {/* Minute Selector */}
      <select
        className='rounded-md border border-gray-300  text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={minute}
        onChange={handleMinuteChange}
      >
        {minutes.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Second Selector */}
      {setting=="HH:mm:ss"?
      <select
        className='rounded-md border border-gray-300  text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={second}
        onChange={handleSecChange}
      >
        {seconds.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>:null}

      {/* for AM and PM */}

      {timeType=="normal"?
       <select
       className='rounded-md border border-gray-300  text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
       value={period}
       onChange={handlePeriodChange}
     >
       {periods.map((p) => (
         <option key={p} value={p}>
           {p}
         </option>
       ))}
     </select>:null
      }
  </div>
  )
}
export default TorusTimePicker