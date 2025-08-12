import React, { useState } from 'react'
import JsonView from 'react18-json-view'
import { ArrowLeft, Copy, CopyCheckXmark, ChevronDown } from '@gravity-ui/icons'
import 'react18-json-view/src/style.css'
import { twMerge } from 'tailwind-merge'
import { Button, Loader } from '@gravity-ui/uikit'
import { AxiosService } from '../components/axiosService'

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

const RenderNodesInfo = ({
  nodes,
  selectedNode,
  handleNodeClick,
  handleCopyToClipboard,
  copied
}: {
  nodes: any[]
  selectedNode: any
  handleNodeClick: (node: any) => void
  handleCopyToClipboard: (uid: string) => Promise<void>
  copied: string | null
}) => {
  const [subFlowNodes, setSubFlowNodes] = useState<any[]>([])
  const [isExpanded, setIsExpanded] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)

  const handleSubFlowNodes = async (node: any) => {
    if (isExpanded === node.subFlowInfo?.subFlowUpId) {
      setIsExpanded(null)
      setSubFlowNodes([])
      return
    }
    if (node.subFlowInfo) {
      setLoading(true)
      const { subFlowKey, subFlowUpId } = node.subFlowInfo
      setIsExpanded(subFlowUpId)
      const response = await AxiosService.post(
        'http://192.168.2.96:7000/subFlowLog',
        {
          key: subFlowKey,
          upId: subFlowUpId
        }
      )
      if (response.status == 201 && Array.isArray(response.data)) {
        setIsExpanded(subFlowUpId)
        setSubFlowNodes(
          response.data.map((item: any) => ({
            name: item?.processInfo?.nodeName,
            request: item?.processInfo?.request,
            response: item?.processInfo?.response,
            exception: item?.errorDetails,
            status: item?.processInfo?.status,
            time: item?.DateAndTime,
            subFlowInfo: item?.processInfo?.subFlowInfo
          }))
        )
      }
    } else {
      setSubFlowNodes([])
      setIsExpanded(null)
    }
    setLoading(false)
    handleNodeClick(node)
  }

  return (
    <div className='scrollbar-hide flex  h-full flex-col overflow-auto py-1'>
      {nodes.map((item: Record<string, any>, index: number) => (
        <div key={index}>
          <div
            className={`mx-[0.2vw] flex cursor-pointer items-center justify-between rounded p-[0.87vw] transition-colors duration-300 ease-in-out`}
            onClick={e => {
              e.stopPropagation()
              handleSubFlowNodes(item)
            }}
          >
            <div className='flex flex-col items-start rounded-md'>
              <span
                style={{
                  fontSize: `${fontSize * 0.72}vw`,
                  color:
                    JSON.stringify(selectedNode) === JSON.stringify(item) ? 'var(--brand-color)' : ''
                }}
                className='px-[0.58vw] py-[0.42vh] leading-[1.25vw]'
              >
                {item.name}
              </span>
              {item.subFlowInfo && (
                <div
                  className='flex w-fit items-center gap-1 rounded-full p-2 font-medium leading-[1.85vh]'
                  style={{
                    backgroundColor: 'var(--selection-color)',
                    fontSize: `${fontSize * 0.625}vw`
                  }}
                >
                  UID: {item?.subFlowInfo?.subFlowUpId}
                  <Button
                    view='flat'
                    size='xs'
                    className='border-none'
                    onClick={e => {
                      e.stopPropagation()
                      handleCopyToClipboard(item?.subFlowInfo?.subFlowUpId)
                    }}
                  >
                    {copied && copied === item?.subFlowInfo?.subFlowUpId ? (
                      <CopyCheckXmark className='text-green-500' />
                    ) : (
                      <Copy />
                    )}
                  </Button>
                </div>
              )}
            </div>
            {item.subFlowInfo && (
              <div
                className={twMerge(
                  'transform-gpu transition-transform duration-300 ease-in-out',
                  isExpanded == item?.subFlowInfo?.subFlowUpId
                    ? 'rotate-180'
                    : 'rotate-0'
                )}
              >
                <ChevronDown />
              </div>
            )}
          </div>
          <div>
            {isExpanded &&
            item?.subFlowInfo?.subFlowUpId &&
            isExpanded == item?.subFlowInfo?.subFlowUpId &&
            isLoading ? (
              <Loader className='flex w-full justify-center' />
            ) : (
              isExpanded &&
              item?.subFlowInfo?.subFlowUpId &&
              isExpanded == item?.subFlowInfo?.subFlowUpId && (
                <div
                  className='border-b pl-[0.2vw]'
                  style={{ borderColor: 'var(--g-color-line-generic)' }}
                >
                  <RenderNodesInfo
                    nodes={subFlowNodes}
                    selectedNode={selectedNode}
                    handleNodeClick={handleNodeClick}
                    handleCopyToClipboard={handleCopyToClipboard}
                    copied={copied}
                  />
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const Artifactdetails = ({ nodeData, setNodeData }: Nodedataprops) => {
  const [copied, setCopied] = useState<string | null>(null)
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

  const handleCopyToClipboard = async (uid: string) => {
    try {
      await navigator.clipboard.writeText(uid)
      setCopied(uid)
      setTimeout(() => {
        setCopied(null)
      }, 2000)
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
        <div
          className='flex h-full w-[20%] flex-col rounded-lg border'
          style={{ borderColor: 'var(--g-color-line-generic)' }}
        >
          <div
            className='flex flex-col border-b py-[1vh]'
            style={{ borderColor: 'var(--g-color-line-generic)' }}
          >
            <div
              onClick={() => setNodeData(null)}
              className='flex items-center justify-between px-[0.87vw] py-[1vh]'
            >
              <ArrowLeft
                className='cursor-pointer'
                role='button'
                onClick={() => setNodeData(null)}
              />
              <h1
                style={{
                  fontSize: `${fontSize * 0.83}vw`
                }}
                className='mx-[0.29vw] w-[80%] truncate font-semibold leading-[1.25vw]'
                title={artifact.toUpperCase()}
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
            {processId && (
              <div
                className='flex w-fit items-center self-center rounded-full p-[0.2vw] font-medium leading-[1.85vh]'
                style={{
                  backgroundColor: 'var(--selection-color)',
                  fontSize: `${fontSize * 0.625}vw`
                }}
              >
                UID: {processId}
                <Button
                  view='flat'
                  size='xs'
                  className='border-none'
                  onClick={e => {
                    e.stopPropagation()
                    handleCopyToClipboard(processId)
                  }}
                >
                  {copied && copied === processId ? (
                    <CopyCheckXmark className='text-green-500' />
                  ) : (
                    <Copy />
                  )}
                </Button>
              </div>
            )}
          </div>
          {/* seperate */}
          <RenderNodesInfo
            nodes={nodeData.node}
            selectedNode={selectedNode}
            handleNodeClick={handleNodeClick}
            copied={copied}
            handleCopyToClipboard={handleCopyToClipboard}
          />
        </div>

        <div
          className='flex h-full w-[80%] flex-col rounded-lg border'
          style={{ borderColor: 'var(--g-color-line-generic)' }}
        >
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

            <hr
              className='h-[95%] w-[0.5px] self-center border'
              style={{ borderColor: 'var(--g-color-line-generic)' }}
            />

            <div className={`flex h-full w-[45%] p-[1.46vw] text-center`}>
              <div className='w-full'>
                <div
                  className='flex w-[98%] items-center gap-[0.58vw] rounded-md border'
                  style={{ borderColor: 'var(--g-color-line-generic)' }}
                >
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
