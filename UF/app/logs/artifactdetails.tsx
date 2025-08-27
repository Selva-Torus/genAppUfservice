import React, { useState } from 'react'
import JsonView from 'react18-json-view'
import { ArrowLeft, Copy, CopyCheckXmark, ChevronDown } from '@gravity-ui/icons'
import 'react18-json-view/src/style.css'
import { twMerge } from 'tailwind-merge'
import { Button, Loader, Text } from '@gravity-ui/uikit'
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
        'subFlowLog',
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
    <div className='scrollbar-hide flex h-full flex-col overflow-auto py-1'>
      {nodes.map((item: Record<string, any>, index: number) => (
        <div key={index}>
          <div
            className={`mx-0.5 flex cursor-pointer items-center justify-between rounded p-3 transition-colors duration-300 ease-in-out`}
            onClick={e => {
              e.stopPropagation()
              handleSubFlowNodes(item)
            }}
          >
            <div className='flex flex-col items-start rounded-md'>
              <Text
                variant='body-1'
                style={{
                  color:
                    JSON.stringify(selectedNode) === JSON.stringify(item) ? 'var(--brand-color)' : ''
                }}
                className='px-2 py-1'
              >
                {item.name}
              </Text>
              {item.subFlowInfo && (
                <div
                  className='flex w-fit items-center gap-1 rounded-full p-2'
                  style={{
                    backgroundColor: 'var(--selection-color)',
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
                  className='border-b pl-0.5'
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
        className='col-span-12 flex h-full w-full gap-2 overflow-hidden'
      >
        <div
          className='flex h-full min-w-[200px] flex-col rounded-lg border px-2'
          style={{ borderColor: 'var(--g-color-line-generic)' }}
        >
          <div
            className='flex flex-col border-b py-2'
            style={{ borderColor: 'var(--g-color-line-generic)' }}
          >
            <div
              onClick={() => setNodeData(null)}
              className='flex items-center justify-between px-3 py-2'
            >
              <div className='flex gap-2'>
              <ArrowLeft
                className='cursor-pointer'
                role='button'
                onClick={() => setNodeData(null)}
              />
              <Text variant='subheader-1'
                title={artifact.toUpperCase()}
              >
                {artifact.toUpperCase()}
              </Text>
              </div>
              <Text variant='body-1'
                style={{
                  backgroundColor: 'var(--brand-color)'
                }}
                className='rounded-xl px-3'
              >
                {version}
              </Text>
            </div>
            {processId && (
                      <div
                        className='flex w-fit rounded-full p-2'
                        style={{
                          backgroundColor: 'var(--selection-color)'
                        }}
                      >
                        <Text variant='body-1'>UID: {processId}</Text>
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
          className='flex h-full w-full overflow-x-auto flex-col rounded-lg border'
          style={{ borderColor: 'var(--g-color-line-generic)' }}
        >
          <div className='flex h-full w-full rounded-lg'>
            <div className='flex h-full w-[70%] min-w-[400px]  flex-col gap-3 p-2'>
              <div
                style={{
                  backgroundColor: 'var(--selection-color)'
                }}
                className='flex w-full gap-2 rounded-lg p-3'
              >
                <div className='flex gap-3'>
                  <div className='mt-3 flex flex-col gap-3'>
                    <div className='flex flex-col gap-2'>
                      <Text variant='body-1' className='text-nowrap text-end'
                      >
                        Process started at
                      </Text>
                      <Text variant='body-1' color='secondary' className='text-nowrap'
                      >
                        {formatDate(selectedNode?.time)}
                      </Text>
                    </div>
                    <div className='flex flex-col gap-2 py-2'>
                      <Text variant='body-1' className='text-nowrap text-end'
                      >
                        Finished at
                      </Text>
                      <Text variant='body-1' color='secondary' className='text-nowrap'
                      >
                        {handleGetFinishingTime(selectedNode?.time).endTime}
                      </Text>
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
                          className='h-2 w-2 rounded-full'
                        ></div>
                        <div className='h-20'></div>
                      </div>
                      <div className='flex items-center '>
                        <div
                          style={{
                            backgroundColor: 'var(--brand-color)'
                          }}
                          className='h-2 w-2 rounded-full'
                        ></div>
                        <div className='h-16'></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex w-full justify-between '>
                  <div>
                    <Text variant='body-2' className='text-nowrap'
                    >
                      {
                        handleGetFinishingTime(selectedNode?.time)
                          .processingTime
                      }
                    </Text>
                  </div>
                  <div className='flex gap-3 text-center'>
                    <Text
                      variant='body-1'
                      style={{
                        ...determineStatusColorClass(selectedNode?.status),
                      }}
                      className={`rounded-full px-2`}
                    >
                      {selectedNode ? selectedNode.status : status}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <hr
              className='h-[95%] w-[0.5px] self-center border'
              style={{ borderColor: 'var(--g-color-line-generic)' }}
            />

            <div className={`flex h-full w-1/2 min-w-[400px] p-3 text-center`}>
              <div className='w-full'>
                <div
                  className='flex w-full items-center gap-2 rounded-md border p-0.5'
                  style={{ borderColor: 'var(--g-color-line-generic)' }}
                >
                  <Text
                    variant='subheader-1'
                    onClick={() => {
                      setActiveTab('request')
                    }}
                    className={twMerge(
                      `w-1/3 cursor-pointer rounded-md py-2`,
                      activeTab === 'request' && 'bg-[var(--selection-color)]'
                    )}
                  >
                    Request
                  </Text>
                  <Text
                    variant='subheader-1'
                    onClick={() => {
                      setActiveTab('response')
                    }}
                    className={twMerge(
                      `w-1/3 cursor-pointer rounded-md py-2`,
                      activeTab === 'response' && 'bg-[var(--selection-color)]'
                    )}
                  >
                    Response
                  </Text>
                  <Text
                    variant='subheader-1'
                    onClick={() => {
                      setActiveTab('exception')
                    }}
                    className={twMerge(
                      `w-1/3 cursor-pointer rounded-md py-2`,
                      activeTab === 'exception' && 'bg-[var(--selection-color)]'
                    )}
                  >
                    Exception
                  </Text>
                </div>

                <div
                  className={`h-[95.5%] overflow-auto pl-2 pt-3`}
                >
                  {['request', 'response', 'exception'].map(tabId => (
                    <div
                      style={{
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
                        className='g-text g-text_variant_code-2'
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
