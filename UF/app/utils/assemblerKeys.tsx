import UOmapperData from '@/context/dfdmapperContolnames.json'


export function getRouteScreenDetails(key: string, artfactName: string): string {
  let assemblerKeys: any = [
  {
    "screenName": "transaction",
    "screensName": "transaction-v1",
    "ufKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_KEDTB_Main_Screen:AFVK:v1"
  },
  {
    "screenName": "dashboard",
    "screensName": "dashboard-v1",
    "ufKey": "CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard:AFVK:v1"
  }
]

  let routeScreen: string = artfactName

  assemblerKeys.forEach((item: any) => {
    if (item.ufKey == key) {
      routeScreen = item.screensName.replace('-v','_v')
    }
  })

  return routeScreen
}

export function getFilterProps(filterProps:any=[],mainData:any={}) {
  let result:any = [];  
  try{
  filterProps?.map((dfdData:any)=>{
    dfdData?.nodeBasedData?.map((nodes:any)=>{
      let filterObj:any = {}
      Object.keys(nodes?.object||{}).map((keys:any)=>{
        const mapperEntry = nodes?.object[keys]
        const mapperData = (UOmapperData as Record<string, any>)[mapperEntry]
        if (!mapperData) return
        const value = mainData[mapperData["source"]]
        if (value !== undefined) filterObj[keys] = value
      })
      result.push({
      DFDkey:dfdData.key,
      nodeId:nodes.nodeId,
      ...filterObj
    })
    }) 
  })
  return result;
}catch(e){
  console.log(e);
}
}

