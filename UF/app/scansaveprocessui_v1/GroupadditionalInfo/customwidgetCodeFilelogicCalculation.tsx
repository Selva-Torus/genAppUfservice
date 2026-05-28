
'use client'
import React, { useContext, useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
const ForNotFound = ({}: any) => {
    return (
    <div className='text-center text-2xl font-bold text-gray-900'>
        No custom code found
    </div>
    )
}
export default ForNotFound
