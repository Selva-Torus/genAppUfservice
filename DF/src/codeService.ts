import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "./redisService";
 const _= require('lodash');
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

@Injectable()
export class CodeService{
  constructor(    
     private readonly redisService: RedisService) {
     }
  private readonly logger = new Logger(CodeService.name);

 

async replaceVariable(code: string, variableName: string, newValue: any): Promise<string> {
  
function buildLiteralAST(value: any, seen = new Set()): t.Expression {
  if (value === null) return t.nullLiteral();
  if (typeof value === 'boolean') return t.booleanLiteral(value);
  if (typeof value === 'number') return t.numericLiteral(value);
  if (typeof value === 'string') return t.stringLiteral(value);

  if (typeof value === 'object') {
    if (seen.has(value)) {
      // Prevent infinite recursion
      return t.stringLiteral('[Circular]');
    }
    seen.add(value);

    if (Array.isArray(value)) {
      return t.arrayExpression(value.map((item) => buildLiteralAST(item, seen)));
    }

    return t.objectExpression(
      Object.entries(value).map(([key, val]) =>
        t.objectProperty(t.stringLiteral(key), buildLiteralAST(val, seen))
      )
    );
  }

  throw new Error(`Unsupported value type: ${typeof value}`);
}

  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  traverse(ast, {
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id) && path.node.id.name === variableName) {
        path.node.init = buildLiteralAST(newValue); // ✅ Call it as a standalone function
      }
    },
  });

  return generate(ast).code;
}


 async customCode(key,code,data,fabric,SessionInfo){
    const declaredVars:any = await this.extractDeclaredVariables(code);
    var arr:{ [key: string]: object | any[] } = {};
    if(declaredVars?.length>0){
       for(let a=0;a< declaredVars.length;a++){ 
         if(declaredVars[a] == 'sessionInfo'){
          arr[declaredVars[a]] = SessionInfo
        }
      if(fabric == "DF-DFD"){
         if(data && data.hasOwnProperty(declaredVars[a])){
       
         arr[declaredVars[a]] = data[declaredVars[a]]
      }else{
         var customres = JSON.parse(await this.redisService.getJsonDataWithPath(key + ':NPV:'+declaredVars[a]+'.PRO','.customResponse',process.env.CLIENTCODE))
      
         if(customres){
            if(Array.isArray(customres) && customres.length > 0){
              arr[declaredVars[a]] = customres
            }else if(Object.keys(customres).length > 0){
              arr[declaredVars[a]] = [customres]
            }          
         }
        }
      }else if(fabric == "PF-PFD" || fabric == "PF-SFD"){
         if(await this.redisService.exist(key + ':NPV:'+declaredVars[a]+'.PRO',process.env.CLIENTCODE)){
        var pro:any = JSON.parse(await this.redisService.getJsonData(key + ':NPV:'+declaredVars[a]+'.PRO',process.env.CLIENTCODE)) 
      
        arr[declaredVars[a]] = pro.response
      }
      }
    }
    }
    let updatedFunctionString = code;
      //console.log('code startTime',new Date());
      
      for (let [key, value] of Object.entries(arr)) {
        updatedFunctionString = await this.replaceVariable(updatedFunctionString, key, value);
      }

      //console.log('code EndTime',new Date());

    //   const vm = new VM({
    //  timeout: 1000,
    //  sandbox: {},
    // });
    
    // ✅ Step 3: Execute the function in VM
  //   const output = vm.run(`
  //     ${updatedFunctionString}
  //     test(); 
  //  `);

      const output =  eval(updatedFunctionString);
    
   if(data && fabric == 'DF-DFD' ){  
      Object.assign(data, output)   
      return data
    }else{
      return output
    }
  
   }

 
 async fastReplaceVariable(code: string, variableName: string, newValue: any)  {
  const valueString = JSON.stringify(newValue, null, 2);
  const regex = new RegExp(
    `(const|let|var)\\s+${variableName}\\s*=\\s*[^;]*;`,
    'g'
  );

  return code.replace(regex, `$1 ${variableName} = ${valueString};`);
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


