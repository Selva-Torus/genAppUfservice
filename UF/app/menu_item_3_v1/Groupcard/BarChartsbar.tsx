
'use client'
import { useContext, useEffect, useState, useRef } from 'react'
import { codeExecution } from '@/app/utils/codeExecution'
import { getCookie } from '@/app/components/cookieMgment'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { AxiosService } from '@/app/components/axiosService'
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as TooltipDisplay,
  XAxis,
  YAxis
} from 'recharts'
import { Text } from "@/components/Text";
import { Card } from '@/components/Card';

export default function BarChartsbar({ encryptionFlagCompData }: any) {
  const token: string = getCookie('token'); 
  const { globalState, setGlobalState } = useContext(TotalContext) as TotalContextProps;
  const { accessProfile, setAccessProfile } = useContext(TotalContext) as TotalContextProps;
  const [data,setData] = useState<any>([])
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef(false);
  const toast:any=useInfoMsg();
  /////////////
   //another screen
  const {cf46a, setcf46a}= useContext(TotalContext) as TotalContextProps;  
  const {cf46aProps, setcf46aProps}= useContext(TotalContext) as TotalContextProps;  
  const {4f7b1, set4f7b1}= useContext(TotalContext) as TotalContextProps;  
  const {4f7b1Props, set4f7b1Props}= useContext(TotalContext) as TotalContextProps;  
  const {search676ad, setsearch676ad}= useContext(TotalContext) as TotalContextProps;  
  const {search676adProps, setsearch676adProps}= useContext(TotalContext) as TotalContextProps;  
  const {8394d, set8394d}= useContext(TotalContext) as TotalContextProps;  
  const {8394dProps, set8394dProps}= useContext(TotalContext) as TotalContextProps;  
  const {cardbb124, setcardbb124}= useContext(TotalContext) as TotalContextProps;  
  const {cardbb124Props, setcardbb124Props}= useContext(TotalContext) as TotalContextProps;  
  const {abdaf, setabdaf}= useContext(TotalContext) as TotalContextProps;  
  const {card4d75a4, setcard4d75a4}= useContext(TotalContext) as TotalContextProps;  
  const {card4d75a4Props, setcard4d75a4Props}= useContext(TotalContext) as TotalContextProps;  
  const {card108d97, setcard108d97}= useContext(TotalContext) as TotalContextProps;  
  const {card108d97Props, setcard108d97Props}= useContext(TotalContext) as TotalContextProps;  
  const {card23ac19, setcard23ac19}= useContext(TotalContext) as TotalContextProps;  
  const {card23ac19Props, setcard23ac19Props}= useContext(TotalContext) as TotalContextProps;  
  const {card393c35, setcard393c35}= useContext(TotalContext) as TotalContextProps;  
  const {card393c35Props, setcard393c35Props}= useContext(TotalContext) as TotalContextProps;  
  const {bar3b56d, setbar3b56d}= useContext(TotalContext) as TotalContextProps;  
  const {timing0cafc, settiming0cafc}= useContext(TotalContext) as TotalContextProps;  
  const {timing0cafcProps, settiming0cafcProps}= useContext(TotalContext) as TotalContextProps;  
  const {table8472d, settable8472d}= useContext(TotalContext) as TotalContextProps;  
  const {table8472dProps, settable8472dProps}= useContext(TotalContext) as TotalContextProps;  
  //////////////
  let expenseData: any[]
  let title : String = "";
  let showCurrencySign : String = "";
  interface ExpenseData {
    name: string
    [key: string]: string | number
 }
  const handleMapperDetails=async()=>{
    try{
    const orchestrationData: any = await AxiosService.post(
    '/UF/Orchestration',
      {
        key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard4:AFVK:v1",
        componentId: "9097c8cd8a9744b9b196225136abb124",
        controlId: "7c502f9f81ba4f74839c6de7c073b56d",
        isTable: false,
        accessProfile:accessProfile,
        from:"checkbox"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    let code:any= orchestrationData?.data?.code;
      if (code != '') {
        let codeStates: any = {}
          codeStates['']  = cf46a,
          codeStates['set'] = setcf46a,
          codeStates['']  = 4f7b1,
          codeStates['set'] = set4f7b1,
          codeStates['search']  = search676ad,
          codeStates['setsearch'] = setsearch676ad,
          codeStates['']  = 8394d,
          codeStates['set'] = set8394d,
          codeStates['card']  = cardbb124,
          codeStates['setcard'] = setcardbb124,
          codeStates['card4']  = card4d75a4,
          codeStates['setcard4'] = setcard4d75a4,
          codeStates['card1']  = card108d97,
          codeStates['setcard1'] = setcard108d97,
          codeStates['card2']  = card23ac19,
          codeStates['setcard2'] = setcard23ac19,
          codeStates['card3']  = card393c35,
          codeStates['setcard3'] = setcard393c35,
          codeStates['timing']  = timing0cafc,
          codeStates['settiming'] = settiming0cafc,
          codeStates['table']  = table8472d,
          codeStates['settable'] = settable8472d,
        codeExecution(code,codeStates)
      }
      if(Array.isArray() && ?.length > 0){
        setData()
        setcardbb124((pre:any)=>({...pre,bar:[0]?.bar}))
      }
      if(Array.isArray()){
        return
      }
    }catch(err){
      console.log(err)
    }
  }
  
  expenseData = data.map(({ process_id, ...rest }: any) => rest)

  const parsedExpenseData: ExpenseData[] = expenseData.map(item => {
    const parsedItem: ExpenseData = { name: String(item.name) }
    Object.keys(item).forEach(key => {
      if (key !== 'name') {
        item[key] = item[key] === null ? '0' : item[key]
        const cleanedValue = String(item[key]).replace(/,/g, "")
        parsedItem[key] = parseFloat(cleanedValue as string) // Convert string to number
      }
    })
    return parsedItem
  })

  let totalExpenses = parsedExpenseData.reduce((acc, item) => {
    const { name, ...rest } = item // Exclude the 'name' key
    const sum = Object.values(rest as Record<string, number>).reduce(
      (sum, value) => sum + value,
      0
    ) // Sum remaining values
    return acc + sum
  }, 0)

  useEffect(() => {
    if (prevRefreshRef.current) {
       handleMapperDetails()
    }else 
     prevRefreshRef.current= true
   },[bar3b56d?.refresh])


  const colors = [
    '#FF9F40',
    '#FF6B6B',
    '#36A2EB',
    '#4CAF50',
    '#9C27B0',
    '#00BCD4'
  ]

      title  = "Bar Chart"
      showCurrencySign = "₹"
  if (bar3b56d?.isHidden) {
    return <></>
  }
  return (
    <div 
      style={{gridColumn: `1 / 7`,gridRow: `120 / 243`, gap:``, height: `100%`, overflow: 'auto'}} >
        {/* <Card className='w-full h-full min-h-[200px] space-y-2 '>    */} 
            <h3 className='text-base font-semibold'>{title}</h3>
            {parsedExpenseData.length > 0 ?
            <ResponsiveContainer width='100%' height='80%'>
            <BarChart data={parsedExpenseData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tickFormatter={(value) => {
                    const maxLength = 6; // shrink length
                    return value && value.length > maxLength
                      ? `${value.substring(0, maxLength)}...`
                      : value;
                  }}
                  interval={0} // force showing all labels
                />
                <YAxis 
                className="text-xs"
                tickFormatter={(value) => {
                    const maxLength = 6; // shrink length
                    return value && value.length > maxLength
                      ? `${value.substring(0, maxLength)}...`
                      : `${value}`;
                  }}              
                />
                <TooltipDisplay                
                formatter={(value, name) => [`${showCurrencySign}${value}`, name]}
                />
                <Legend />
                {Object.keys(parsedExpenseData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                    <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    />
                ))}
            </BarChart>
            </ResponsiveContainer>
            :<p className='text-center text-gray-500'> No data available</p>}
          {/*</Card>*/}
    </div>
    // </main>
  )
}
