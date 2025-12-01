'use client'
import * as XLSX from 'xlsx'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import {
  BsFiletypeJpg,
  BsFiletypeJson,
  BsFiletypePng,
  BsImage
} from 'react-icons/bs'
import { RiDeleteBinLine } from 'react-icons/ri'
import { BiHide } from 'react-icons/bi'
import {
  FaArrowCircleDown,
  FaCss3Alt,
  FaFileAlt,
  FaFileArchive,
  FaFileCode,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaHtml5,
  FaMarkdown,
  FaSass
} from 'react-icons/fa'
import { IoLogoJavascript } from 'react-icons/io'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { MdFileUpload, MdOutlineCloudDownload } from 'react-icons/md'
import { SiReact, SiTypescript } from 'react-icons/si'
import { TbFileUpload } from 'react-icons/tb'
import DocViewer from "@/components/DocumentViewer";
import axios from 'axios'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Icon } from '@/components/Icon'

type InputProps = {
  className?: string
  value?: FilesType[]
  onChange?: React.Dispatch<React.SetStateAction<FilesType[]>>
  disabled?: boolean
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>
  preview?: boolean
  draggable?: boolean
  id: string
  singleSelect?: boolean
}

interface FilesType {
  file: File
  url: string
}

type Drag_file = FilesType[]

const DocumentUploader = ({
  dropzoneOptions,
  value = [],
  className,
  disabled,
  onChange,
  preview = true,
  draggable = false,
  id,
  singleSelect = true,
  viewType="modal",
  DbType,
  enableEncryption,
  fileNamingPreference="use_system_generated_name"
}: any) => {
  const [files, setFiles] = React.useState<Drag_file>(value)
  const [open, setOpen] = React.useState(false)
  const [previewModel, setPreviewModel] = React.useState(false)
  const [currentFile, setCurrentFile] = React.useState<FilesType | null>(null);

  async function convertUrlToFile(url: string) {
    try {
      const response = await axios.get(url, { responseType: "blob" });
  
      const fileType = response.data.type || "application/octet-stream";
      const fileName = url.split("/").pop() || "downloaded-file";
  
      const file = new File([response.data], fileName, { type: fileType });
      const fileUrl = URL.createObjectURL(file);
  
      return { file, url: fileUrl };
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  }

  React.useEffect(() => {

      if (Array.isArray(value) && value.length > 0) {
        setFiles(value);
      } else if (value === "" || value === null || value === undefined) {
        setFiles([]);
      } else if (typeof value === "string") {
        convertUrlToFile(value).then((result) => {
          if (result) {
            setFiles([result]);
          }
        });
      }
   
  }, [value]);


  const handleDrop = (acceptedFiles: File[]) => {

    if (!acceptedFiles.length) {

      return
    }
    setFiles((prevFiles: any) => {
      const existingFileNames = new Set(
        prevFiles.map((file: any) =>
          file instanceof File ? `${file.name}-${file.size}` : file
        )
      )
      const newFiles = acceptedFiles.filter(file => {
        const uniqueKey = `${file.name}-${file.size}`
        return !existingFileNames.has(uniqueKey)
      })
 
      if (newFiles.length === 0) return prevFiles

      const filesWithUrls: FilesType[] = newFiles.map(file => {
        const ext = file.name.split('.').pop() || '';
        const baseName = file.name.replace(`.${ext}`, '');
        const uniqueName = `${baseName}${fileNamingPreference=="use_system_generated_name"?"_"+Date.now():""}.${ext}`; // name_time format

        const renamedFile = new File([file], uniqueName, { type: file.type });
        Object.defineProperty(renamedFile, 'DbType', {
          value: DbType,
          writable: true,
          enumerable: true
        })
        
        Object.defineProperty(renamedFile, 'enableEncryption', {
          value: enableEncryption,
          writable: true,
          enumerable: true
        })
        return {
          file: renamedFile,
          url: URL.createObjectURL(renamedFile)
        }
      })

      if (singleSelect) {
        if (typeof onChange === 'function') {
          onChange([{ file: filesWithUrls[0].file, url: filesWithUrls[0].url }])
        }
        return [filesWithUrls[0]]
      } else {
        const updatedFiles: FilesType[] = [...prevFiles, ...filesWithUrls]
        if (typeof onChange === 'function') {
          onChange(updatedFiles.map((f: any) => ({ file: f.file, url: f.url })))
        }
        return updatedFiles
      }
    })
  }

const removeFile = async (
    fileIndex: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const newFiles = [...files]
    newFiles.splice(fileIndex, 1)
    setFiles(newFiles)
    if (typeof onChange === 'function') {
      onChange(files.filter((_: any, index: number) => index !== fileIndex))
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: singleSelect ? false : true,
    disabled,
    onDrop: handleDrop,
    noClick: draggable,
    noDrag: !draggable,
    ...dropzoneOptions
  })

  const viewTypeUI=()=>{
    return           <div className='h-full w-full' {...getRootProps()}>
            <div className={` `}>

              <input {...getInputProps()} className='hidden' />

              <input
                id={id}
                type='file'
                multiple={!singleSelect}
                className='hidden'
                onChange={e => {
                  const selectedFiles = Array.from(e.target.files || [])
                  handleDrop(selectedFiles)
                }}
              />

              <div
                className={`scrollbar-none flex h-[83%] flex-col overflow-x-hidden overflow-y-scroll px-2 `}
              >
                <div
                  className={`flex h-[60%] w-full cursor-pointer items-center justify-center border border-dashed 
                                    ${isDragActive ? 'border-blue-500 bg-blue-200' : 'border-gray-300 bg-white'} 
                                    rounded-md`}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <div className='flex flex-col items-center justify-center gap-2 '>
                    {!isDragActive ? (
                      <>
                        <MdOutlineCloudDownload size={20} />
                        <span className='text-sm text-black'>
                          Choose a file to upload
                        </span>
                        <span className='text-xs text-black/50'>
                          JPEG,PNG,DOC,PDF,XLS,CSV and formats up to 5MB
                        </span>

                        <Button
                          pin='round-round'
                          // width='auto'
                          view='outlined'
                          size='l'
                          onClick={e => {
                            document.getElementById(id)?.click()
                            e.stopPropagation()
                            e.preventDefault()
                          }}
                        >
                          <span className='text-sm text-black'>
                            Browse File
                          </span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <FaArrowCircleDown size={20} />
                        <span className='text-sm text-black'>Drop here</span>
                        <span className='text-xs text-black/50'>
                          JPEG,PNG,DOC,PDF,XLS,CSV and formats up to 5MB
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className='scrollbar-none flex h-[40%] flex-col gap-1 overflow-y-scroll py-1'>
                  {files.length > 0 &&
                    files.map((file: any, index) => (
                      <div
                        className='flex w-full cursor-pointer select-none items-center justify-between rounded-md bg-slate-200 px-2 py-2 hover:bg-slate-300/85 '
                        onClick={e => {
                          e.stopPropagation()
                          setCurrentFile(file)
                          setPreviewModel(true)
                        }}
                        key={index}
                      >
                        <div className='flex w-[50%] items-center justify-start gap-2 '>
                          <div>{getFileIcon(file.file)}</div>
                          <div className='flex items-center justify-between gap-2'>
                            <div className='flex flex-col'>
                              <span className='whitespace-nowrap'>
                                {file.file.name}
                              </span>
                              <div className='flex items-center justify-start gap-1'>
                                <span className='text-black/50'>
                                  {bytestoKb(file.file.size)}
                                </span>
                                <span className='h-[0.25vw] w-[0.25vw] rounded-full bg-black/50'></span>
                                <div className='flex items-center justify-center gap-1'>
                                  <span>
                                    <Completed />
                                  </span>
                                  <span>Completed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex w-[50%] items-center justify-end'>
                          <div>
                            <span
                              className='flex cursor-pointer items-center justify-center'
                              onClick={(e: any) => removeFile(index, e)}
                            >
                              <RiDeleteBinLine
                                fill='red'
                                opacity={0.7}
                                size={15}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
  }
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div>
        <div
          className='flex w-full items-center justify-center px-1 py-0'
          {...getRootProps()}
        >
          {viewType=='modal'?
          <div className={`flex w-[95%] justify-start ${className}`}>
            <Button
              pin='round-round'
              // width='max'
              view='outlined-info'
              size='l'
              startContent={
                <span className='flex h-full items-center justify-center'>
                  <Icon className='flex items-center justify-center bg-transparent px-[0.15vw] py-[0.25vh]' size={20} data='FaCloudUploadAlt' />
                </span>
              }
              onClick={e => {
                setOpen(true)
                e.stopPropagation()
              }}
            >
              Upload
            </Button>
          </div>:null
          }
        </div>
         {viewType=='modal'?<Modal
          open={open}
          title={              <div className='flex items-center justify-between px-2 py-2'>
                <div className='flex items-center justify-center gap-2'>
                  <TbFileUpload size={20} color='black' />
                  <div className='flex flex-col gap-0'>
                    <div className='text-sm font-semibold'>Upload Document</div>
                    <div className='text-xs font-semibold opacity-45'>
                      Select and upload the required documents
                    </div>
                  </div>
                </div>
              </div>}
          onClose={() => {
            setOpen(false)
            // e.stopPropagation()
          }}>
          {viewTypeUI()}
          </Modal>:  viewTypeUI() }

        {preview && (
          <Modal
            open={previewModel}
            onClose={() => {
              setPreviewModel(false)
              // e.stopPropagation()
            }}
            // contentOverflow='visible'
          >
            <Viewer
              file={currentFile?.file as File}
              url={currentFile?.url as string}
              closeFn={setPreviewModel}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}


export default DocumentUploader;

const getFileIcon = (file: File | string) => {
  let fileType = ''

  if (typeof file === 'string') {
    fileType = file.split('.').pop()?.toLowerCase() || ''
  } else {
    fileType = file.name.split('.').pop()?.toLowerCase() || ''
  }

  switch (fileType) {
    case 'pdf':
      return <FaFilePdf className='text-red-500' size={30} />
    case 'doc':
    case 'docx':
      return <FaFileWord className='text-blue-500' size={30} />
    case 'xls':
    case 'xlsx':
      return <FaFileExcel className='text-green-500' size={30} />
    case 'ppt':
    case 'pptx':
      return <FaFilePowerpoint className='text-orange-500' size={30} />
    case 'csv':
      return <FaFileCsv className='text-green-500' size={30} />
    case 'json':
      return <BsFiletypeJson className='text-violet-500' size={30} />
    case 'zip':
    case 'rar':
    case '7z':
      return <FaFileArchive className='text-orange-500' size={30} />
    case 'txt':
      return <FaFileAlt className='text-gray-500' size={30} />
    case 'html':
      return <FaHtml5 className='text-orange-500' size={30} />
    case 'css':
      return <FaCss3Alt className='text-blue-500' size={30} />
    case 'scss':
      return <FaSass className='text-pink-500' size={30} />
    case 'md':
      return <FaMarkdown className='text-black' size={30} />
    case 'env':
      return <FaFileCode className='text-green-500' size={30} />
    case 'js':
      return <IoLogoJavascript className='text-yellow-500' size={30} />
    case 'jsx':
      return <SiReact className='text-blue-500' size={30} />
    case 'ts':
      return <SiTypescript className='text-blue-500' size={30} />
    case 'tsx':
      return (
        <span className='flex items-center'>
          <SiReact className='text-blue-500' size={25} />
          <SiTypescript className='text-blue-500' size={15} />
        </span>
      )
    case 'png':
      return <BsFiletypePng className='text-green-500' size={30} />
    case 'jpg':
      return <BsFiletypeJpg className='text-teal-500' size={30} />
    case 'avif':
      return <BsImage className='text-cyan-400' size={30} />
    case 'jfif':
      return <BsImage className='text-lime-400' size={30} />
    default:
      return <FaFileAlt className='text-gray-500' size={30} />
  }
}

const bytestoKb = (units: number) => {
  let unit = units / 1024
  return `${unit.toFixed(2)} KB`
}

const Viewer = ({ file, url, closeFn }: any) => {
  const [sheetData, setSheetData] = useState<any[]>([])

  useEffect(() => {
    if (!file) return

    // Determine file type for Excel or CSV
    const isExcel =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      (file.name && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')))

    const isCSV =
      file.type === 'text/csv' || (file.name && file.name.endsWith('.csv'))

    if (!isExcel && !isCSV) {
      setSheetData([])
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return

      let workbook

      if (isCSV) {
        // Parse CSV
        workbook = XLSX.read(data, { type: 'binary', raw: false })
      } else {
        // Parse Excel
        workbook = XLSX.read(data, { type: 'binary' })
      }

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setSheetData(jsonSheet)
    }

    reader.readAsBinaryString(file)
  }, [file])

  return (
    <>
      {file && (
        <div
          key={file.name}
          className=' overflow-hidden rounded-md border p-2'
        >
            <p className='text-sm font-semibold'>{file.name}</p>
          {/* Image */}
          {file.type.includes('image') && (
            <div className='scrollbar-none flex h-full w-full items-center justify-center overflow-scroll'>
              <img
                src={url}
                alt={file.name}
                className='rounded-md object-cover'
              />
            </div>
          )}

          {/* PDF */}
          {file.type.includes('pdf') && (
            <iframe
              src={url}
              width='100%'
              height='345px'
              className='rounded-md border'
            ></iframe>
          )}

          {/* Text or JSON */}
          {(file.type.includes('text') || file.type.includes('json')) &&
            !(
              file.type === 'text/csv' || // Don't double render CSV here
              (file.name && file.name.endsWith('.csv'))
            ) && (
              <div className='flex h-[53vh] w-full items-center justify-center'>
                <DocViewer
                  url={url}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  viewer='url'
                  googleCheckInterval={500}
                  googleMaxChecks={5}
                  overrideLocalhost='null'
                  googleCheckContentLoaded={true}
                  queryParams='HL=NL'
                  viewerUrl=''
                />
              </div>
            )}

          {/* Excel or CSV preview */}
          {(file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel' ||
            file.type === 'text/csv' ||
            (file.name &&
              (file.name.endsWith('.xls') ||
                file.name.endsWith('.xlsx') ||
                file.name.endsWith('.csv'))) ) &&
            sheetData.length > 0 && (
              <div className='overflow-auto max-h-[53vh] border rounded-md p-2'>
                <table className='table-auto border-collapse border border-gray-300 w-full text-sm'>
                  <tbody>
                    {sheetData.map((row, i) => (
                      <tr key={i} className={i === 0 ? 'font-bold bg-gray-100' : ''}>
                        {row.map((cell: any, j: number) => (
                          <td
                            key={j}
                            className='border border-gray-300 px-2 py-1'
                          >
                            {cell ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* Unsupported */}
          {!file.type.includes('image') &&
            !file.type.includes('pdf') &&
            !file.type.includes('text') &&
            !(
              file.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
              file.type === 'application/vnd.ms-excel' ||
              file.type === 'text/csv' ||
              (file.name &&
                (file.name.endsWith('.xls') ||
                  file.name.endsWith('.xlsx') ||
                  file.name.endsWith('.csv')))
            ) && (
              <div className='flex h-[53vh] w-full items-center justify-center'>
                <div className='flex flex-col items-center gap-1 p-2'>
                  <BiHide
                    size={35}
                    color='red'
                    opacity={0.5}
                    strokeWidth={0.2}
                  />
                  <span className='text-xs text-gray-500'>
                    Preview not available
                  </span>
                  <a
                    href={url}
                    download={file.name}
                    className='text-sm text-blue-500 underline'
                  >
                    Download {file.name}
                  </a>
                </div>
              </div>
            )}
        </div>
      )}
    </>
  )
}

const Completed = () => {
  return (
    <svg
      width='17'
      height='16'
      viewBox='0 0 17 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M8.39421 1.33334C4.72087 1.33334 1.72754 4.32668 1.72754 8.00001C1.72754 11.6733 4.72087 14.6667 8.39421 14.6667C12.0675 14.6667 15.0609 11.6733 15.0609 8.00001C15.0609 4.32668 12.0675 1.33334 8.39421 1.33334ZM11.5809 6.46668L7.80087 10.2467C7.70754 10.34 7.58087 10.3933 7.44754 10.3933C7.31421 10.3933 7.18754 10.34 7.09421 10.2467L5.20754 8.36001C5.01421 8.16668 5.01421 7.84668 5.20754 7.65334C5.40087 7.46001 5.72087 7.46001 5.91421 7.65334L7.44754 9.18668L10.8742 5.76001C11.0675 5.56668 11.3875 5.56668 11.5809 5.76001C11.7742 5.95334 11.7742 6.26668 11.5809 6.46668Z'
        fill='#3EBF8F'
      />
    </svg>
  )
}
