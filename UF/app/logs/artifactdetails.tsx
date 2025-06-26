import React, { useState } from 'react'

import JsonView from 'react18-json-view'
import { ArrowLeft } from '@gravity-ui/icons'
// import { TabProvider, TabList, Tab, TabPanel } from '@gravity-ui/uikit'
import 'react18-json-view/src/style.css'
import { twMerge } from 'tailwind-merge'

const fontSize = 1
interface Nodedataprops {
  nodeData: {
    id: string
    artifactName: Record<string, string>
    node: Record<string, string>[]
    artifact: string
    version: string
    processId: string
    status: string
    time: string[]
    fabric: string
  }
  setNodeData: any
}

interface Nodeprops {
  name: string
  request: string
  response: string
  time: string[]
  status: string
  exception: string
}

type ItemType = {
  id: string
  name: string
}

const Artifactdetails = ({ nodeData, setNodeData }: Nodedataprops) => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('')
  const [selectedNode, setSelectedNode] = useState<any>(nodeData?.node?.[0])
  const { artifact, version, processId, status, time } = nodeData

  const handleNodeClick = (node: any) => {
    if (JSON.stringify(node) !== JSON.stringify(selectedNode)) {
      setSelectedNode(node)
    }
  }
  const determineStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return {
          color: '#22c55e', // text-green-500
          backgroundColor: '#d1fae5', // bg-green-100
          border: '1px solid #bbf7d0', // border border-green-200
          width: '100%', // w-full
          height: '15%' // h-[15%]
        } // Green for success
      case 'failed':
        return {
          color: '#ef4444', // text-red-500
          backgroundColor: '#fee2e2', // bg-red-100
          border: '1px solid #fecaca', // border border-red-200
          width: '100%', // w-full
          height: '15%' // h-[15%]
        } // Red for failed
      default:
        return {
          color: '#6b7280' // text-gray-500
        } // Default gray for other statuses
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processId)
 

    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  function formatDate(inputDateStr: string) {
    // Create a Date object from the input string
    const dateObj = new Date(inputDateStr)

    // Get the day, month, year, hours, minutes, and seconds
    const day = dateObj.getDate()
    const month = dateObj.toLocaleString('default', { month: 'long' })
    const year = dateObj.getFullYear()
    const hours = dateObj.getHours()
    const minutes = dateObj.getMinutes()
    const seconds = dateObj.getSeconds()
    const milliseconds = dateObj.getMilliseconds()
    // Format the date and time components
    const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}:${milliseconds}`

    return formattedDate
  }

  const handleGetFinishingTime = (nodeTime: string) => {
    // Ensure 'time' is a string array
    if (Array.isArray(time) && time.every(item => typeof item === 'string')) {
      const currentIndex = time.findIndex(item => item === nodeTime)
      if (currentIndex !== -1 && time[currentIndex + 1]) {
        const timeDifference =
          new Date(time[currentIndex + 1]).getMilliseconds() -
          new Date(nodeTime).getMilliseconds()
        return {
          endTime: formatDate(time[currentIndex + 1]),
          processingTime: `Processing Time : ${timeDifference}ms`
        }
      } else {
        return status.toLowerCase() === 'success'
          ? {
              endTime: formatDate(time[time.length - 1]),
              processingTime: 'Process completed successfully'
            }
          : {
              endTime: 'process not finished',
              processingTime: 'Process not finished'
            }
      }
    } else {
      throw new Error("Invalid data: 'time' must be an array of strings.")
    }
  }

  return (
    <div className='grid h-full grid-cols-12'>
      <div
        style={{
          backgroundColor: 'transparent'
        }}
        className='col-span-12 flex h-full w-full gap-5 overflow-hidden'
      >
        <div className='flex h-full w-[15%] flex-col rounded-lg border'>
          <div className='flex flex-col border-b'>
            <div
              onClick={() => setNodeData(null)}
              className='flex justify-between p-[0.87vw]'
            >
              <ArrowLeft className='cursor-pointer' role='button' onClick={() => setNodeData(null)} />
              <h1
                style={{
                  fontSize: `${fontSize * 0.83}vw`
                }}
                className=' mx-[0.29vw] font-semibold leading-[1.25vw]'
              >
                {artifact.toUpperCase()}
              </h1>
              <p
                style={{
                  fontSize: `${fontSize * 0.52}vw`,
                  backgroundColor: 'var(--brand-color)'
                }}
                className='rounded-xl px-[0.87vw] leading-[1.25vw]'
              >
                {version}
              </p>
            </div>
          </div>
          <div className='scrollbar-hide flex  h-full flex-col overflow-auto py-1'>
            {nodeData.node.map(
              (item: Record<string, string>, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor:
                      selectedNode?.name === item.name
                        ? 'var(--selection-color)'
                        : ''
                  }}
                  // onMouseEnter={(e) => (e.target as HTMLDivElement).style.backgroundColor = torusTheme["bgCard"]}
                  // onMouseLeave={(e) => (e.target as HTMLDivElement).style.backgroundColor = ""}
                  className={`mx-[0.2vw] cursor-pointer rounded p-[0.87vw] transition-colors duration-300 ease-in-out`}
                  onClick={() => handleNodeClick(item)}
                >
                  <div className='flex items-center rounded-md'>
                    <span
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                      className='px-[0.58vw] py-[0.42vh] leading-[1.25vw]'
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className='flex h-full w-[85%] flex-col rounded-lg border'>
          <div className='flex h-full w-full rounded-lg'>
            <div className='flex h-full w-[70%] flex-col gap-[0.87vw] p-[0.58vw]'>
              <div
                style={{
                  backgroundColor: 'var(--selection-color)'
                }}
                className='flex w-full gap-[0.58vw] rounded-lg p-[1.46vw]'
              >
                <div className='flex gap-[0.87vw]'>
                  <div className='mt-[3vh] flex flex-col gap-[1.46vw]'>
                    <div className='flex flex-col gap-[0.58vw]'>
                      <p
                        style={{
                          fontSize: `${fontSize * 0.62}vw`
                        }}
                        className='text-end font-medium leading-[0.26vw]'
                      >
                        Process started at
                      </p>
                      <p
                        style={{
                          fontSize: `${fontSize * 0.62}vw`
                        }}
                        className='text-nowrap font-medium leading-[0.26vw]'
                      >
                        {formatDate(selectedNode?.time)}
                      </p>
                    </div>
                    <div className='flex flex-col gap-[0.58vw] py-[1.25vw]'>
                      <p
                        style={{
                          fontSize: `${fontSize * 0.62}vw`
                        }}
                        className='text-end font-medium leading-[0.26vw]'
                      >
                        Finished at
                      </p>
                      <p
                        style={{
                          fontSize: `${fontSize * 0.62}vw`
                        }}
                        className='text-nowrap font-medium leading-[0.26vw]'
                      >
                        {handleGetFinishingTime(selectedNode?.time).endTime}
                      </p>
                    </div>
                  </div>

                  <div className='relative flex flex-col items-center '>
                    <div
                      style={{
                        backgroundColor: 'var(--brand-color)'
                      }}
                      className='absolute h-full w-px'
                    ></div>
                    <div className='flex flex-col'>
                      <div className='flex items-center '>
                        <div
                          style={{
                            backgroundColor: 'var(--brand-color)'
                          }}
                          className='h-[0.58vw] w-[0.58vw] rounded-full'
                        ></div>
                        <div className='h-[4.09vw]'></div>
                      </div>
                      <div className='flex items-center '>
                        <div
                          style={{
                            backgroundColor: 'var(--brand-color)'
                          }}
                          className='h-[0.58vw] w-[0.58vw] rounded-full'
                        ></div>
                        <div className='h-[4.09vw]'></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex w-full justify-between '>
                  <div>
                    <p
                      style={{
                        fontSize: `${fontSize * 0.83}vw`
                      }}
                      className='text-nowrap font-medium leading-[1.04vw]'
                    >
                      {
                        handleGetFinishingTime(selectedNode?.time)
                          .processingTime
                      }
                    </p>
                  </div>
                  <div className='flex gap-[0.87vw] text-center'>
                    <p
                      style={{
                        ...determineStatusColorClass(selectedNode?.status),
                        fontSize: `${fontSize * 0.62}vw`
                      }}
                      className={`flex items-center rounded-full px-2 text-center font-semibold leading-[1.04vw] `}
                    >
                      {selectedNode ? selectedNode.status : status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className='h-[95%] w-[0.5px] border self-center' />

            <div className={`flex h-full w-[45%] p-[1.46vw] text-center`}>
              <div className='w-full'>
                <div className='ml-[0.2vw] mt-[0.5vh] flex w-[98%] items-center gap-[0.58vw] rounded-md border'>
                  <div
                    onClick={() => {
                      setActiveTab('request')
                    }}
                    style={{
                      fontSize: `${fontSize * 0.67}vw`
                    }}
                    className={twMerge(
                      `w-1/3 cursor-pointer rounded-md py-[0.58vw] text-center font-medium leading-[1.04vw] outline-none`,
                      activeTab === 'request' && 'bg-[var(--selection-color)]'
                    )}
                  >
                    Request
                  </div>
                  <div
                    onClick={() => {
                      setActiveTab('response')
                    }}
                    style={{
                      fontSize: `${fontSize * 0.67}vw`
                    }}
                    className={twMerge(
                      `w-1/3 cursor-pointer rounded-md py-[0.60vw] font-medium leading-[1.04vw] outline-none`,
                      activeTab === 'response' && 'bg-[var(--selection-color)]'
                    )}
                  >
                    Response
                  </div>
                  <div
                    onClick={() => {
                      setActiveTab('exception')
                    }}
                    style={{
                      fontSize: `${fontSize * 0.67}vw`
                    }}
                    className={twMerge(
                      `w-1/3 cursor-pointer rounded-md py-[0.60vw] font-medium leading-[1.04vw] outline-none`,
                      activeTab === 'exception' && 'bg-[var(--selection-color)]'
                    )}
                  >
                    Exception
                  </div>
                </div>

                <div
                  className={`scrollbar-thin h-[95.5%] overflow-auto pl-[0.58vw] pt-[3vh]`}
                >
                  {['request', 'response', 'exception'].map(tabId => (
                    <div
                      style={{
                        fontSize: `${fontSize * 1}vw`,
                        display: activeTab === tabId ? 'block' : 'none'
                      }}
                      key={tabId}
                    >
                      <JsonView
                        src={
                          selectedNode?.[tabId] ?? {
                            data: `no ${tabId} data available`
                          }
                        }
                        theme='atom'
                        enableClipboard={false}
                        style={{ fill: '#1A2024' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Artifactdetails
