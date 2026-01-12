export function getRouteScreenDetails(key: string, artfactName: string): string {
  let assemblerKeys: any = [
  {
    "screenName": "tabs",
    "screensName": "tabs-v1",
    "ufKey": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1"
  },
  {
    "screenName": "progress",
    "screensName": "progress-v1",
    "ufKey": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:progress:AFVK:v1"
  },
  {
    "screenName": "tablecheck",
    "screensName": "tablecheck-v1",
    "ufKey": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:tablecheck:AFVK:v1"
  },
  {
    "screenName": "dynamicforms",
    "screensName": "dynamicforms-v1",
    "ufKey": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1"
  },
  {
    "screenName": "save",
    "screensName": "save-v1",
    "ufKey": "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1"
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

