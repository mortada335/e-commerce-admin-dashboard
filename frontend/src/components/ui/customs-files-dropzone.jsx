import { cn } from "@/lib/utils";
import { File, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Text from "@/components/layout/text";
import { Button } from "./button";
import { toast } from "sonner";

import { Card } from "./card";

import { Separator } from "./separator";
import { ImageTypes, VideoTypes } from "@/utils/methods";

const FilesDropzone = ({
  className,
  loading = false,
  disabled = false,
  canPreview = false,
  value = [],
  onChange = () => {},
  maxSize=1024 * 1024 * 50, // Maximum file size limit set to 3 MB
  accept ={
    "image/*": [],
    "video/*": [],
    // "image/jpg": [],
    // "application/pdf": [],
    // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
    // "text/csv": [], // .csv
    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    //   [], // .docx
    // "application/msword": [], // .doc
  }
}) => {
 
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections?.length) {
        fileRejections.map(({ file, errors }) => {
          const message = `${file.path} - ${file.size} bytes : ${errors?.at(0)?.message}`
          return toast(message || "Failed!!!")  
        });
      }

      if (acceptedFiles?.length) {
        // Map the acceptedFiles to add sort_order and image properties
        const newFiles = acceptedFiles.map((file, index) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        // Update the files state with newFiles
        onChange(newFiles);
      }
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept,
    maxSize: maxSize,
    onDrop,
  });
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => value?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [value]);


  const handleDeleteFile = (index) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };
  return (
    <div className="flex flex-col justify-start items-start gap-4 w-full h-fit">

    <div
      disabled={disabled}
      {...getRootProps({
        className: cn(
          " py-2 px-2 rounded-md  border-2 border-dashed w-full border-slate-200 dark:border-slate-800",
          className
        ),
      })}
    >
      <input disabled={disabled} {...getInputProps()} />

      <div
        disabled={disabled}
        className="flex flex-col items-center justify-center gap-2 "
      >
        <Button disabled={disabled} type="button" variant="ghost">
          {loading ? (
            <p className="flex justify-center items-center space-x-2">
              <span>{"Please wait"}</span>
            </p>
          ) : (
            <p className="flex flex-col md:flex-row justify-start items-center gap-2 w-full">
              <Upload size={20} className="text-muted-foreground" />
              {isDragActive ? (
                <Text
                  className={"capitalize"}
                  text={"Drop the files here ..."}
                />
              ) : (
                <Text
                  className={"capitalize !text-xs md:text-sm"}
                  text={"Drag & drop files here, or click to select files"}
                />
              )}
            </p>
          )}
        </Button>
      </div>
    </div>
    {
      canPreview&&
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full h-fit gap-4">
                                {!!value?.length &&
                                  value?.map((attachment, index) => (
                                    <Card
                                      key={attachment?.preview + index}
                                      className="relative h-fit flex flex-col justify-start items-center py-2 gap-2"
                                    >
                                    {/* Delete image button. */}
     
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1 right-1 w-8 h-8 group z-10 px-0 py-0"
          onClick={() => handleDeleteFile(index)}
        >
          <Trash2
            size={14}
            color="red"
            className="group-hover:scale-110 transition"
          />
        </Button>
      
                                      {ImageTypes?.includes(attachment?.file?.type) ? (
                                        <img
                                          src={attachment?.preview}
                                          alt={attachment?.file?.name}
                                          className=" w-full min-h-[50%] lg:min-h-[75%] max-h-fit object-cover group-hover:scale-110 transition"
                                        />
                                      ) : VideoTypes?.includes(attachment?.file?.type) ? (
                                        <video src={attachment?.preview} controls className="w-full max-w-md rounded-md" />
                                      ) : (
                                        <File size={50}/>
                                      )}
              
                                      <Separator />
                                      <div className="flex flex-col gap-2 justify-start items-center w-full text-sm px-4 py-2">
                                        {attachment?.file?.name} 
                                      </div>
                                    </Card>
                                  ))}
                              </div>
    }
    </div>
  );
};

export default FilesDropzone;
