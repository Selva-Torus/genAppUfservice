export function getRouteScreenDetails(key: string, artfactName: string): string {
  let assemblerKeys: any = [
  {
    "screenName": "app1",
    "screensName": "app1-v1",
    "ufKey": "CK:CI001:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:defaultapp:AFVK:v1"
  },
  {
    "screenName": "menu item 3",
    "screensName": "menu_item_3-v1",
    "ufKey": "CK:CI001:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:artifact2:AFVK:v1"
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

