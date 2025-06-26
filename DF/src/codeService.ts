import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "./redisService";
 const _= require('lodash');
 
@Injectable()
export class CodeService{
  constructor(    
     private readonly redisService: RedisService) {
     }
  private readonly logger = new Logger(CodeService.name);

 
 

 async customCode(key,code,data,fabric){
    const declaredVars:any = this.extractDeclaredVariables(code);
    var arr:{ [key: string]: object | any[] } = {};
    if(declaredVars?.length>0){
       for(let a=0;a< declaredVars.length;a++){ 
      if(fabric == "DF-DFD"){
         if(data.hasOwnProperty(declaredVars[a])){
       
         arr[declaredVars[a]] = data[declaredVars[a]]
      }else{
         var customres = JSON.parse(await this.redisService.getJsonDataWithPath(key + ':NPV:'+declaredVars[a]+'.PRO','.customResponse'))
      
         if(customres)
         arr[declaredVars[a]] = [customres]
        }
      }else if(fabric == "PF-PFD"){
         if(await this.redisService.exist(key + ':NPV:'+declaredVars[a]+'.PRO')){
        var pro:any = JSON.parse(await this.redisService.getJsonData(key + ':NPV:'+declaredVars[a]+'.PRO')) 
      
        arr[declaredVars[a]] = pro.response
      }
      }
    }
    }
    let updatedFunctionString = code;
  
      for (let [key, value] of Object.entries(arr)) {
        updatedFunctionString = this.replaceVariable(updatedFunctionString, key, value);
      }
    
    console.log(2, updatedFunctionString)
  const output = await eval(updatedFunctionString);
  console.log('output',output);
  
    Object.assign(data, output)   
    return data
  
   }

   async containsForLoop(code) {
        const forLoopPattern = /\bfor\s*\(.*?\)\s*\{/s; // handles multiline
        return forLoopPattern.test(code);
  }

  async replaceVariable(code: string, variableName: string, newValue: object | any[]): Promise<any> {
      const newValueString = JSON.stringify(newValue, null, 2);
        const pattern = new RegExp(
      `${variableName}\\s*=\\s*(\\{(?:[^{}]*|\\{[^{}]*\\})*\\}|\\[(?:[^\\[\\]]*|\\[[^\\[\\]]*\\])*\\])\\s*([;,]?)`,
      'm'
    );
    

    var isForLoop = this.containsForLoop(code);
    if(isForLoop){
      return code.replace(pattern, `${variableName} = ${newValueString};`);
    }else{
    const pattern = new RegExp(`${variableName}\\s*=\\s*[^;\\n]+`, 'm');
      return code.replace(pattern, `${variableName} = ${newValueString}`);
  }
      
    }

  async extractDeclaredVariables(funcStr: string): Promise<any> {
      const letMatch = funcStr.match(/let\s+([\s\S]*?);/); 
      if (!letMatch) return [];
    
      const letContent = letMatch[1]; 
      const result: string[] = [];
      let depth = 0;
      let current = '';
      for (let i = 0; i < letContent.length; i++) {
        const char = letContent[i];
    
        if (char === '{' || char === '[') depth++;
        if (char === '}' || char === ']') depth--;
    
        if (char === ',' && depth === 0) {
          const variable = current.split('=')[0].trim();
          if (variable) result.push(variable);
          current = '';
        } else {
          current += char;
        }
      }
    
      const finalVar = current.split('=')[0].trim();
      if (finalVar) result.push(finalVar);
    
      return result;
    }


}