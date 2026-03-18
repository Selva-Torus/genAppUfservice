import React, { useState } from 'react'
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import { twMerge } from 'tailwind-merge'
import { AxiosService } from '@/app/components/axiosService'
import { TbCopy } from 'react-icons/tb'
import { TbCopyCheckFilled } from 'react-icons/tb'
import { GoArrowLeft } from 'react-icons/go'
import { FiChevronDown } from 'react-icons/fi'
import Spin from '@/components/Spin'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { Tabs } from '@/components/Tabs'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import { getFontSizeForSubHeader } from '@/app/utils/branding'

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
  const { borderColor } = useTheme()
  const { branding } = useGlobal()
  const { selectionColor } = branding

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
      const response = await AxiosService.post('subFlowLog', {
        key: subFlowKey,
        upId: subFlowUpId
      })
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
    <div className='flex h-full flex-col overflow-auto py-1 scrollbar-hide'>
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
                color={
                  JSON.stringify(selectedNode) === JSON.stringify(item)
                    ? 'brand'
                    : 'primary'
                }
                className='px-2 py-1'
              >
                {item.name}
              </Text>
              {item.subFlowInfo && (
                <div
                  className='flex w-fit items-center gap-1 rounded-full p-2'
                  style={{
                    backgroundColor: selectionColor
                  }}
                >
                  UID: {item?.subFlowInfo?.subFlowUpId}
                  <Button
                    view='flat'
                    className='!w-4 rounded-md p-1'
                    onClick={e => {
                      e.stopPropagation()
                      handleCopyToClipboard(item?.subFlowInfo?.subFlowUpId)
                    }}
                  >
                    {copied && copied === item?.subFlowInfo?.subFlowUpId ? (
                      <TbCopyCheckFilled className='text-green-500' />
                    ) : (
                      <TbCopy />
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
                <FiChevronDown />
              </div>
            )}
          </div>
          <div>
            {isExpanded &&
            item?.subFlowInfo?.subFlowUpId &&
            isExpanded == item?.subFlowInfo?.subFlowUpId &&
            isLoading ? (
              <Spin
                className='flex w-full justify-center'
                spinning
                color='success'
                style='dots'
              />
            ) : (
              isExpanded &&
              item?.subFlowInfo?.subFlowUpId &&
              isExpanded == item?.subFlowInfo?.subFlowUpId && (
                <div className={twMerge('border-b pl-0.5', borderColor)}>
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
  const { borderColor, bgColor } = useTheme()
  const { branding } = useGlobal()
  const { brandColor, selectionColor } = branding

  const handleNodeClick = (node: any) => {
    if (JSON.stringify(node) !== JSON.stringify(selectedNode)) {
      setSelectedNode(node)
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
          processingTime: `${timeDifference}ms`
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

  const NodeLevelDetails = ({ tabId }: { tabId: string }) => {
    return (
      <JsonView
        src={
          selectedNode?.[tabId] ?? {
            data: `no ${tabId} data available`
          }
        }
        theme='atom'
        enableClipboard={false}
        style={{ fill: '#1A2024' }}
        className='g-text g-text_variant_code-2 h-full overflow-scroll'
      />
    )
  }

  return (
    <div className='flex h-full w-full gap-2 overflow-hidden p-2'>
      <div
        className={twMerge(
          'flex h-full w-1/3 min-w-[200px] flex-col rounded-lg border px-2 lg:w-1/4',
          borderColor
        )}
      >
        <div
          className={twMerge('flex w-full flex-col border-b py-2', borderColor)}
        >
          <div
            onClick={() => setNodeData(null)}
            className='flex w-full items-center justify-between px-3 py-2'
          >
            <div className='flex w-2/3 gap-2'>
              <span>
                <GoArrowLeft
                  className='cursor-pointer '
                  role='button'
                  onClick={() => setNodeData(null)}
                />
              </span>
              <Text variant={getFontSizeForSubHeader(branding.fontSize)} className='w-full truncate'>
                <span title={artifact.toUpperCase()}>
                  {artifact.toUpperCase()}
                </span>
              </Text>
            </div>
            <Text color='brand' className='rounded-xl px-3 text-end'>
              {version}
            </Text>
          </div>
          {processId && (
            <div
              className='flex w-fit rounded-full p-2'
              style={{
                backgroundColor: selectionColor
              }}
            >
              <Text>UID: {processId}</Text>
              <Button
                view='flat'
                className='!w-4 rounded-md p-1'
                onClick={e => {
                  e.stopPropagation()
                  handleCopyToClipboard(processId)
                }}
              >
                {copied && copied === processId ? (
                  <TbCopyCheckFilled className='text-green-500' />
                ) : (
                  <TbCopy />
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
        className={twMerge(
          'flex h-full w-full flex-col overflow-x-auto rounded-lg border',
          borderColor
        )}
      >
        <div className='flex h-[99.5%] w-full rounded-lg'>
          <div className='flex h-full w-[70%] min-w-[400px] flex-col gap-3 p-2'>
            <div
              className={twMerge(
                'flex w-full justify-between rounded border px-[1.5vw] py-[1vh]',
                borderColor,
                bgColor
              )}
            >
              <Text className='text-start'>
                Queue Name
              </Text>
              <Text className='text-center'>
                Processing Time
              </Text>
              <Text className='text-end'>
                Status
              </Text>
            </div>
            <div
              className={twMerge(
                'flex w-full gap-2 rounded-lg border p-3',
                borderColor,
                bgColor
              )}
            >
              <div className='flex gap-3'>
                <p
                  className='text-torus-text w-[5vw] truncate font-semibold'
                  title={selectedNode?.queue ?? undefined}
                >
                  {selectedNode?.queue ?? '-'}
                </p>
                <div className='mt-3 flex flex-col gap-3'>
                  <div className='flex flex-col gap-2'>
                    <Text className='text-nowrap text-end'>
                      Process started at
                    </Text>
                    <Text
                     
                      color='secondary'
                      className='text-nowrap'
                    >
                      {formatDate(selectedNode?.time)}
                    </Text>
                  </div>
                  <div className='flex flex-col gap-2 py-2'>
                    <Text className='text-nowrap text-end'>
                      Finished at
                    </Text>
                    <Text
                     
                      color='secondary'
                      className='text-nowrap'
                    >
                      {handleGetFinishingTime(selectedNode?.time).endTime}
                    </Text>
                  </div>
                </div>

                <div className='relative flex flex-col items-center'>
                  <div
                    style={{
                      backgroundColor: brandColor
                    }}
                    className='absolute h-full w-px'
                  ></div>
                  <div className='flex flex-col'>
                    <div className='flex items-center '>
                      <div
                        style={{
                          backgroundColor: brandColor
                        }}
                        className='h-2 w-2 rounded-full'
                      ></div>
                      <div className='h-20'></div>
                    </div>
                    <div className='flex items-center '>
                      <div
                        style={{
                          backgroundColor: brandColor
                        }}
                        className='h-2 w-2 rounded-full'
                      ></div>
                      <div className='h-16'></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex w-full justify-between'>
                <div>
                  <Text className='ml-16 text-nowrap'>
                    {handleGetFinishingTime(selectedNode?.time).processingTime}
                  </Text>
                </div>
                  <Text
                   
                    className={twMerge(
                      `rounded-full bg-red-500 px-2 py-1 text-white !w-fit !h-fit`,
                     selectedNode && selectedNode.status.toLowerCase() == 'success' && 'bg-green-500'
                    )}
                  >
                    {selectedNode ? selectedNode.status : status}
                  </Text>
              </div>
            </div>
          </div>

          <hr
            className={twMerge(
              'h-full w-[0.5px] self-center border',
              borderColor
            )}
          />

          <div className={`flex h-full w-1/2 min-w-[400px] p-3 text-center`}>
            <div className='w-full'>
              <Tabs
                direction='horizontal'
                items={[
                  {
                    id: 'request',
                    title: 'Request',
                    content: <NodeLevelDetails tabId='request' />
                  },
                  {
                    id: 'response',
                    title: 'Response',
                    content: <NodeLevelDetails tabId='response' />
                  },
                  {
                    id: 'exception',
                    title: 'Exception',
                    content: <NodeLevelDetails tabId='exception' />
                  }
                ]}
                onChange={setActiveTab}
                className={twMerge(' w-full ', borderColor)}
              ></Tabs>
              {/* {['request', 'response', 'exception'].map(tabId => (
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
                      className='g-text g-text_variant_code-2 h-[90%] overflow-scroll'
                    />
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Artifactdetails
