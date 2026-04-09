import { cn } from "@/lib/utils"
import { Loader2, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Text from "../layout/text"
import { Button } from "./button"
import { useToast } from "./use-toast"

import usePost from "@/hooks/usePost"

const VideoDropzone = ({
  className,
  containerClassName,
  setFile=()=>{},
  file,
}) => {

  const { toast } = useToast();


  const onDrop = (acceptedFiles, fileRejections) => {
    if (fileRejections?.length) {
      fileRejections.forEach(({ file, errors }) => {
        toast({
          title: `${file.path} - ${file.size} bytes`,
          description: `${errors?.at(0)?.message}`,
        });
      });
    }

    if (acceptedFiles?.length) {
      // Revoke previous object URL before setting a new one
      if (file?.video) {
        URL.revokeObjectURL(file.video);
      }

      const selectedFile = acceptedFiles[0]; // Only take the first file
      setFile({
        file: selectedFile,
        video: URL.createObjectURL(selectedFile),
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] },
    maxSize: 1024 * 1024 * 50, // 50MB max size
    onDrop,
  });

  useEffect(() => {
    return () => {
      if (file?.video) {
        URL.revokeObjectURL(file.video);
      }
    };
  }, [file]);


  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-4 w-full h-full border-2 border-dashed border-neutral-200 py-8 px-4 rounded-md",
        containerClassName
      )}
    >
      <div {...getRootProps({ className: cn("w-full", className) })}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <Button type="button" variant="ghost" size="icon">
            <Upload size={20} className="text-muted-foreground" />
          </Button>
          {isDragActive ? (
            <Text className={"capitalize"} text={"Drop the file here ..."} />
          ) : (
            <Text
              className={"capitalize"}
              text={"Drag & drop a file here, or click to select"}
            />
          )}
        </div>
      </div>
       {file?.video && (
              <div className="flex flex-col items-center gap-4">
                <video src={file.video} controls className="w-full max-w-md rounded-md" />
                
              </div>
            )}
      
    </div>
  );
};

export default VideoDropzone;
