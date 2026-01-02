
'use client'
import { useContext, useEffect, useState, useRef } from 'react';
import { codeExecution } from '@/app/utils/codeExecution';
import { getCookie } from '@/app/components/cookieMgment';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from '@/app/components/axiosService';
import { te_refreshDto } from "@/app/interfaces/interfaces";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip as TooltipDisplay, XAxis, YAxis } from 'recharts';
import { Text } from "@/components/Text";
import { Card } from '@/components/Card';

export default function LineChartsline_chart({ encryptionFlagCompData }: any) {  
  const token: string = getCookie('token');
  const { globalState, setGlobalState } = useContext(TotalContext) as TotalContextProps;
  const { accessProfile, setAccessProfile } = useContext(TotalContext) as TotalContextProps;
  const [data,setData] = useState<any>([]);
  const {dfd_mongo_line_chart_v1Props, setdfd_mongo_line_chart_v1Props} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const prevRefreshRef = useRef(false);
  const toast:any=useInfoMsg();
  /////////////
   //another screen
  const {vmc_dashboard_screen43803, setvmc_dashboard_screen43803}= useContext(TotalContext) as TotalContextProps;  
  const {vmc_dashboard_screen43803Props, setvmc_dashboard_screen43803Props}= useContext(TotalContext) as TotalContextProps;  
  const {maindashboard_cards0d32d, setmaindashboard_cards0d32d}= useContext(TotalContext) as TotalContextProps;  
  const {maindashboard_cards0d32dProps, setmaindashboard_cards0d32dProps}= useContext(TotalContext) as TotalContextProps;  
  const {line_chart_group23d18, setline_chart_group23d18}= useContext(TotalContext) as TotalContextProps;  
  const {line_chart_group23d18Props, setline_chart_group23d18Props}= useContext(TotalContext) as TotalContextProps;  
  const {line_chart8a506, setline_chart8a506}= useContext(TotalContext) as TotalContextProps;  
  const {bar_chart_group93773, setbar_chart_group93773}= useContext(TotalContext) as TotalContextProps;  
  const {bar_chart_group93773Props, setbar_chart_group93773Props}= useContext(TotalContext) as TotalContextProps;  
  const {api_repo_table83529, setapi_repo_table83529}= useContext(TotalContext) as TotalContextProps;  
  const {api_repo_table83529Props, setapi_repo_table83529Props}= useContext(TotalContext) as TotalContextProps;  
  const {api_repositorysb8178, setapi_repositorysb8178}= useContext(TotalContext) as TotalContextProps;  
  const {api_repositorysb8178Props, setapi_repositorysb8178Props}= useContext(TotalContext) as TotalContextProps;  
  //////////////
  let expenseData: any[];
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
        key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Dashboard_Screen:AFVK:v1",
        componentId: "cb830abb66e048799824873cb0423d18",
        controlId: "66b935fdb3754651a74688b80af8a506",
        isTable: false,
        accessProfile:accessProfile,
        from:"checkboxLine Chart"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    let code:any= orchestrationData?.data?.code ;
    if (code == '') {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
    } else if (code != '') {
        let codeStates: any = {}
        codeStates['vmc_dashboard_screen']  = vmc_dashboard_screen43803,
        codeStates['setvmc_dashboard_screen'] = setvmc_dashboard_screen43803,
        codeStates['maindashboard_cards']  = maindashboard_cards0d32d,
        codeStates['setmaindashboard_cards'] = setmaindashboard_cards0d32d,
        codeStates['line_chart_group']  = line_chart_group23d18,
        codeStates['setline_chart_group'] = setline_chart_group23d18,
        codeStates['bar_chart_group']  = bar_chart_group93773,
        codeStates['setbar_chart_group'] = setbar_chart_group93773,
        codeStates['api_repo_table']  = api_repo_table83529,
        codeStates['setapi_repo_table'] = setapi_repo_table83529,
        codeStates['api_repositorys']  = api_repositorysb8178,
        codeStates['setapi_repositorys'] = setapi_repositorysb8178,
      codeExecution(code,codeStates)
    }
      if(Array.isArray(dfd_mongo_line_chart_v1Props) && dfd_mongo_line_chart_v1Props?.length > 0){
    setData(dfd_mongo_line_chart_v1Props)
    setline_chart_group23d18((pre:any)=>({...pre,name:dfd_mongo_line_chart_v1Props[0]?.name}))
  }
    if(Array.isArray(dfd_mongo_line_chart_v1Props)){
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
},[line_chart8a506?.refresh])

useEffect(() => {
  if(Array.isArray(dfd_mongo_line_chart_v1Props) && dfd_mongo_line_chart_v1Props?.length > 0){
    setData(dfd_mongo_line_chart_v1Props)
    setline_chart_group23d18((pre:any)=>({...pre,name:dfd_mongo_line_chart_v1Props[0]?.name}))
  }
},[dfd_mongo_line_chart_v1Props])

  const colors = [
    '#FF9F40',
    '#FF6B6B',
    '#36A2EB',
    '#4CAF50',
    '#9C27B0',
    '#00BCD4'
  ]
    title  = "Message Calls Over Week"

  if (line_chart8a506?.isHidden) {
    return <></>
  }

  return (
    <div 
  style={{gridColumn: `1 / 13`,gridRow: `1 / 34`, gap:``, height: `100%`, overflow: 'auto'}} >
     {/*<Card className='w-full h-full min-h-[200px] space-y-2 '>*/} 
          <h3 className='text-base font-semibold'>{title}</h3>
          {parsedExpenseData.length > 0 ?
          <ResponsiveContainer width='100%' height='80%' >
          <LineChart data={parsedExpenseData}>
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
            <TooltipDisplay formatter={(value, name) => [`${showCurrencySign}${value}`, name]} />
            <Legend />
            {Object.keys(parsedExpenseData[0] || {})
              .filter((key) => key !== 'name')
              .map((key, index) => (
                <Line
                  key={key}
                  type='monotone'
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
          :<p className='text-center text-gray-500'> No data available</p>}
       {/* </Card>*/}
    </div>
    // </main>
  )
}
