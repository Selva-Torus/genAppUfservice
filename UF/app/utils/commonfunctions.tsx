
'use client'
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { useContext } from "react";
export function normalToDynamicArrayCopyFormData(copiedData:any,type:any,state:any,setState:any=()=>{})
{

    if(type=='object')
    {
        setState({...state,...copiedData})
    }else{

    }
}

export function useHandleGroupArrayCopyFormData(){
    const AllStates:any = useContext(TotalContext) as TotalContextProps;
    return(copiedData:any,type:any,arraygroupName:any)=>{
    }
}