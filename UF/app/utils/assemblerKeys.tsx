export function getRouteScreenDetails(key: string, artfactName: string): string {
  let assemblerKeys: any = [
  {
    "screenName": "test",
    "screensName": "test-v1",
    "ufKey": "CK:CI001:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:test:AFVK:v1"
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
  filterProps?.map((dfdData:any)=>{
    dfdData?.nodeBasedData?.map((nodes:any)=>{
      let filterObj=nodes?.object||{}
      Object.keys(nodes?.object).map((keys:any)=>{
        let keysSplit = keys.split('.').at(-1) ?? keys  // "properties.cr_currency" → "cr_currency"
        filterObj[keys] = mainData[keysSplit] || ""
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

