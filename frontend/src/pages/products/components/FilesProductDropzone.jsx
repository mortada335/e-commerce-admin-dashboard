import Text from "@/components/layout/text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"

const FilesProductDropzone = ({
  className,
  files,
  setFiles = [],
  isPreview = true,
  uploadFunction = () => {},
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ])

      uploadFunction()
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  })

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name))
  }

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

      {/* Accepted files */}
      {isPreview && files?.length ? (
        <ul className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-full w-full  gap-4">
          {files.map((file, index) => (
            <li
              key={file.name}
              className="relative flex flex-col justify-center items-center  w-full h-full rounded-md  border px-2 py-2 space-y-2"
            >
              <img
                src={file.preview}
                alt={file.name}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview)
                }}
                className="h-20 w-full rounded-sm  object-cover  "
              />
              <Text className={"truncate w-full"} text={file.name} />

              <Button
                type="button"
                size="icon"
                className="  w-5 h-5 rounded-full flex justify-center items-center   text-xs  absolute top-0 right-2 "
              >
                {index + 1}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="   flex justify-center items-center  w-full text-xs"
                onClick={() => removeFile(file.name)}
              >
                Remove File
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <Button variant="ghost" size="icon">
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
      )}
    </div>
  )
}

export default FilesProductDropzone
