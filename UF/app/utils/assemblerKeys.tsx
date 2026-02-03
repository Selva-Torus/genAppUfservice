export function getRouteScreenDetails(key: string, artfactName: string): string {
  let assemblerKeys: any = [
  {
    "screenName": "transaction",
    "screensName": "transaction-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1"
  },
  {
    "screenName": "system setup",
    "screensName": "system_setup-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1"
  },
  {
    "screenName": "checkerapproval",
    "screensName": "checkerapproval-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_Screen:AFVK:v1"
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
  filterProps.map((dfdData:any)=>{
    dfdData.nodeBasedData.map((nodes:any)=>{
      let filterObj=nodes?.object||{}
      Object.keys(nodes?.object).map((keys)=>{
        filterObj[keys]=mainData[filterObj[keys]] || ""
      })
      result.push({
      DFDkey:dfdData.key,
      nodeId:nodes.nodeId,
      ...filterObj
    })
    }) 
  })
  return result;
}

