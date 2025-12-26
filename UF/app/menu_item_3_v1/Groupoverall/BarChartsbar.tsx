
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
  const {overall05a6d, setoverall05a6d}= useContext(TotalContext) as TotalContextProps;  
  const {overall05a6dProps, setoverall05a6dProps}= useContext(TotalContext) as TotalContextProps;  
  const {card119379, setcard119379}= useContext(TotalContext) as TotalContextProps;  
  const {card234061, setcard234061}= useContext(TotalContext) as TotalContextProps;  
  const {card31630c, setcard31630c}= useContext(TotalContext) as TotalContextProps;  
  const {card480a32, setcard480a32}= useContext(TotalContext) as TotalContextProps;  
  const {card5e0759, setcard5e0759}= useContext(TotalContext) as TotalContextProps;  
  const {bar9c49f, setbar9c49f}= useContext(TotalContext) as TotalContextProps;  
  const {pie5e484, setpie5e484}= useContext(TotalContext) as TotalContextProps;  
  const {table5cf93, settable5cf93}= useContext(TotalContext) as TotalContextProps;  
  const {table5cf93Props, settable5cf93Props}= useContext(TotalContext) as TotalContextProps;  
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
        key: "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:OpenBanking:AFVK:v1",
        componentId: "f0f6a573e6b64b268dd38ea18e005a6d",
        controlId: "4039b181c2614947ad35be0fc4a9c49f",
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
          codeStates['overall']  = overall05a6d,
          codeStates['setoverall'] = setoverall05a6d,
          codeStates['table']  = table5cf93,
          codeStates['settable'] = settable5cf93,
        codeExecution(code,codeStates)
      }
      // if(Array.isArray() && ?.length > 0){
      //   setData()
      //   setoverall05a6d((pre:any)=>({...pre,bar:[0]?.bar}))
      // }
      // if(Array.isArray()){
      //   return
      // }
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
   },[bar9c49f?.refresh])


  const colors = [
    '#FF9F40',
    '#FF6B6B',
    '#36A2EB',
    '#4CAF50',
    '#9C27B0',
    '#00BCD4'
  ]

      title  = "Account Balance Over Time"
      showCurrencySign = "₹"
  if (bar9c49f?.isHidden) {
    return <></>
  }
  return (
    <div 
      style={{gridColumn: `1 / 5`,gridRow: `135 / 229`, gap:``, height: `100%`, overflow: 'auto'}} >
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
