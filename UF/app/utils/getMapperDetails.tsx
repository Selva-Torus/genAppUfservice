export  async function getDropdownDetails(dfData:any,mapperColumn: string,category: any, bindtranValue: any, code: any) {
  let codName:any
    if(!category && dfData && mapperColumn && !bindtranValue && !code){
      let result = dfData.map((item: any) => item[mapperColumn]);
      return result;
    } else if (!category && !bindtranValue && !code) {
      let data = dfData
      return data
    } else if (category && !bindtranValue && !code) {
      let categoryData: any[] = []
      let dropdownData: string[] = []
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (category === dfData[i][keyName]) {
            categoryData.push(dfData[i])
          }
        })
      }
      for (let i = 0; i < categoryData.length; i++) {
        Object.keys(categoryData[i]).map(keyName => {
          if (mapperColumn === keyName) {
            dropdownData.push(categoryData[i][keyName])
          }
        })
      }
      return dropdownData
    } else if (code && bindtranValue) {
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (bindtranValue === dfData[i][keyName]) {
            codName = dfData[i].code
          }
        })
      }
      return codName
    } else if (code) {
      let categoryData: any[] = []
      let dropdownData: string[] = []
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (category === dfData[i][keyName]) {
            categoryData.push(dfData[i])
          }
        })
      }
      for (let j = 0; j < categoryData.length; j++) {
        Object.keys(categoryData[j]).map(keyName => {
          if (
            categoryData[j].parentcode === code &&
            mapperColumn === keyName
          ) {
            dropdownData.push(categoryData[j][keyName])
          }
        })
      }
      return dropdownData
    } else if (bindtranValue) {
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (bindtranValue === dfData[i][keyName]) {
            codName = dfData[i].code
          }
        })
      }
      return codName
    } else {
      let dropdownData: string[] = []
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (mapperColumn === keyName) {
            dropdownData.push(dfData[i][keyName])
          }
        })
      }
      return dropdownData
    }
  }





  export  async function getDropdownDetailsNew(dfData:any,mapperColumn: string,mapperText:string,category: any, bindtranValue: any, code: any) {
  let codName:any
    if(!category && dfData && mapperColumn && !bindtranValue && !code){
      let result = dfData.map((item: any) => item[mapperColumn]);
      return result;
    } else if (!category && !bindtranValue && !code) {
      let data = dfData
      return data
    } else if (category && !bindtranValue && !code) {
      let categoryData: any[] = []
      let dropdownData: string[] = []
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (category === dfData[i][keyName]) {
            categoryData.push(dfData[i])
          }
        })
      }
      for (let i = 0; i < categoryData.length; i++) {
        Object.keys(categoryData[i]).map(keyName => {
          if (mapperColumn === keyName) {
            dropdownData.push(categoryData[i][keyName])
          }
        })
      }
      return dropdownData
    } else if (code && bindtranValue) {
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (bindtranValue === dfData[i][keyName]) {
            codName = dfData[i][mapperText]
          }
        })
      }
      return codName
    } else if (code) {
      let dropdownData: string[] = []
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (code === dfData[i][keyName]) {
            dropdownData.push(dfData[i][mapperColumn])
          }
        })
      }
      return dropdownData
    } else if (bindtranValue) {
      let codename: string ="";
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (bindtranValue === dfData[i][keyName]) {
            codename = dfData[i][mapperText]
          }
        })
      }
      return codename;
    } else {
      let dropdownData: string[] = []
      for (let i = 0; i < dfData.length; i++) {
        Object.keys(dfData[i]).map(keyName => {
          if (mapperColumn === keyName) {
            dropdownData.push(dfData[i][keyName])
          }
        })
      }
      return dropdownData
    }
  }