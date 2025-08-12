export function getRouteScreenDetails(key: string, artfactName: string): string {
  let assemblerKeys: any = [
  {
    "screensName": "formitem-v1",
    "ufKey": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1"
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

export function getFilterProps(filterProps: any, mainData: any) {
  let result = [];

  for (let i = 0; i < filterProps.length; i++) {
    let filterObject:any = {};
    filterObject["DFDkey"] = filterProps[i].value;    
    filterObject["nodeId"] = filterProps[i].subSelection.value;  
    let filterKey = filterProps[i].filterKey.value.toLowerCase();  
    if (filterKey in mainData) {
    filterObject[filterKey] = mainData[filterKey]
    } else {
        console.warn(`Key '${filterKey}' not found in mainData`);
    }
    result.push(filterObject);
  }
  return result;
}
