import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Text from "../layout/text"
import { Button } from "./button"
import { useToast } from "./use-toast"

const FilesDropzone = ({
  className,
  currentFiles = [],
  files = [],
  setFiles,
}) => {

  const { toast } = useToast()
  const onDrop = useCallback(
    (acceptedFiles,fileRejections) => {
     
   
      if (fileRejections?.length) {
        
        fileRejections.map(({ file, errors  }) => { 
          return ( toast({
            title: `${file.path} - ${file.size} bytes`,
            description: `${errors?.at(0)?.message}`,
          }))})
      }
        
      if (acceptedFiles?.length) {
        // Find the maximum sort_order value from existing files
        let maxSortOrder
        

        if (files?.length) {
          maxSortOrder = files?.reduce(
            (max, file) => (file.sort_order > max ? file.sort_order : max),
            0
          )
        } else {
          maxSortOrder = currentFiles?.reduce(
            (max, file) => (file.sort_order > max ? file.sort_order : max),
            0
          )
        }
       
    
        

        // Map the acceptedFiles to add sort_order and image properties
        const newFiles = acceptedFiles.map((file, index) => ({
          file,
          image: URL.createObjectURL(file),
          // Increment the sort_order based on the maximum value
          sort_order: maxSortOrder + index + 1,
        }))

        // Update the files state with newFiles
        setFiles((previousFiles) => [...previousFiles, ...newFiles])
      }
    },
    [files, setFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1024 * 3, // Maximum file size limit set to 3 MB
    onDrop,
  })

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  return (
    <div
      {...getRootProps({
        className: cn(
          " py-4 px-4 rounded-md  border-2 border-dashed  border-neutral-200",
          className
        ),
      })}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-4">
        <Button type="button" variant="ghost" size="icon">
          <Upload size={20} className="text-muted-foreground" />
        </Button>
        {isDragActive ? (
          <Text className={"capitalize"} text={"Drop the files here ..."} />
        ) : (
          <Text
            className={"capitalize"}
            text={"Drag & drop files here, or click to select files"}
          />
        )}
      </div>
    </div>
  )
}

export default FilesDropzone
