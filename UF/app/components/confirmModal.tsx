
'use client'
import { Modal } from '@gravity-ui/uikit'
import React from 'react'

const ConfirmModal = ({confirmMsg, setConfirmMsg, confirmMsgTitle, confirmMsgContent,handleConfirm}:any) => {
  return (
      <Modal open={confirmMsg}  className='rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out'>
            <div className='w-11/12 scale-95 transform rounded-lg bg-white p-6 shadow-2xl transition-all duration-300 md:w-96'>
      
              <div className='text-center'>
                <h3 className='mb-2 text-xl font-semibold text-gray-800'>
                  {confirmMsgTitle}
                </h3>
                <p className='text-gray-600'>
                  {confirmMsgContent}
                </p>
              </div>
      
              <div className='mt-6 flex justify-center space-x-4'>
                <button onClick={() => {
                  setConfirmMsg(false)
                  
                }} className='rounded-lg bg-gray-300 px-6 py-2 text-gray-700 transition duration-200 hover:bg-gray-400'>
                  Cancel
                </button>
                <button onClick={() => {
                  setConfirmMsg(false)
                  handleConfirm()
                }} className='rounded-lg bg-red-500 px-6 py-2 text-white transition duration-200 hover:bg-red-600'>
                  Confirm
                </button>
              </div>
            </div>
          </Modal>
  )
}

export default ConfirmModal
