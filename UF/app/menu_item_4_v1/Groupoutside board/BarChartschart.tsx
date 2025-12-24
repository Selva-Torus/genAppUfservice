
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

export default function BarChartschart({ encryptionFlagCompData }: any) {
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
  const {outside board012f9, setoutside board012f9}= useContext(TotalContext) as TotalContextProps;  
  const {outside board012f9Props, setoutside board012f9Props}= useContext(TotalContext) as TotalContextProps;  
  const {headera5dfc, setheadera5dfc}= useContext(TotalContext) as TotalContextProps;  
  const {headera5dfcProps, setheadera5dfcProps}= useContext(TotalContext) as TotalContextProps;  
  const {side5fa55, setside5fa55}= useContext(TotalContext) as TotalContextProps;  
  const {side5fa55Props, setside5fa55Props}= useContext(TotalContext) as TotalContextProps;  
  const {152d9, set152d9}= useContext(TotalContext) as TotalContextProps;  
  const {card2a34c5, setcard2a34c5}= useContext(TotalContext) as TotalContextProps;  
  const {card2a34c5Props, setcard2a34c5Props}= useContext(TotalContext) as TotalContextProps;  
  const {5f38e, set5f38e}= useContext(TotalContext) as TotalContextProps;  
  const {5f38eProps, set5f38eProps}= useContext(TotalContext) as TotalContextProps;  
  const {card35fd72, setcard35fd72}= useContext(TotalContext) as TotalContextProps;  
  const {card35fd72Props, setcard35fd72Props}= useContext(TotalContext) as TotalContextProps;  
  const {0cce7, set0cce7}= useContext(TotalContext) as TotalContextProps;  
  const {0cce7Props, set0cce7Props}= useContext(TotalContext) as TotalContextProps;  
  const {card42e38a, setcard42e38a}= useContext(TotalContext) as TotalContextProps;  
  const {card42e38aProps, setcard42e38aProps}= useContext(TotalContext) as TotalContextProps;  
  const {6b783, set6b783}= useContext(TotalContext) as TotalContextProps;  
  const {6b783Props, set6b783Props}= useContext(TotalContext) as TotalContextProps;  
  const {card1dced1, setcard1dced1}= useContext(TotalContext) as TotalContextProps;  
  const {card1dced1Props, setcard1dced1Props}= useContext(TotalContext) as TotalContextProps;  
  const {dd147, setdd147}= useContext(TotalContext) as TotalContextProps;  
  const {dd147Props, setdd147Props}= useContext(TotalContext) as TotalContextProps;  
  const {table45205, settable45205}= useContext(TotalContext) as TotalContextProps;  
  const {table45205Props, settable45205Props}= useContext(TotalContext) as TotalContextProps;  
  const {chartdebed, setchartdebed}= useContext(TotalContext) as TotalContextProps;  
  const {line1d22d, setline1d22d}= useContext(TotalContext) as TotalContextProps;  
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
        key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1",
        componentId: "608b841ddc674195a6ec9956809012f9",
        controlId: "28859c15050a4cb09fb70052930debed",
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
          codeStates['outside board']  = outside board012f9,
          codeStates['setoutside board'] = setoutside board012f9,
          codeStates['header']  = headera5dfc,
          codeStates['setheader'] = setheadera5dfc,
          codeStates['side']  = side5fa55,
          codeStates['setside'] = setside5fa55,
          codeStates['card2']  = card2a34c5,
          codeStates['setcard2'] = setcard2a34c5,
          codeStates['']  = 5f38e,
          codeStates['set'] = set5f38e,
          codeStates['card3']  = card35fd72,
          codeStates['setcard3'] = setcard35fd72,
          codeStates['']  = 0cce7,
          codeStates['set'] = set0cce7,
          codeStates['card4']  = card42e38a,
          codeStates['setcard4'] = setcard42e38a,
          codeStates['']  = 6b783,
          codeStates['set'] = set6b783,
          codeStates['card1']  = card1dced1,
          codeStates['setcard1'] = setcard1dced1,
          codeStates['']  = dd147,
          codeStates['set'] = setdd147,
          codeStates['table']  = table45205,
          codeStates['settable'] = settable45205,
        codeExecution(code,codeStates)
      }
      if(Array.isArray() && ?.length > 0){
        setData()
        setoutside board012f9((pre:any)=>({...pre,chart:[0]?.chart}))
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
   },[chartdebed?.refresh])


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
  if (chartdebed?.isHidden) {
    return <></>
  }
  return (
    <div 
      style={{gridColumn: `2 / 8`,gridRow: `345 / 472`, gap:``, height: `100%`, overflow: 'auto'}} >
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
