import { cn } from "@/lib/utils"
import { Loader2, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"


import { PRODUCT_VIDEO_ADMIN_URL } from "@/utils/constants/urls"
import usePost from "@/hooks/usePost"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Text from "@/components/layout/text"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { isNumber } from "@/utils/methods"

const ProductVideoDropzone = ({
  className,
  containerClassName,
  itemId,
  queryKey = "Product",
}) => {
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const { mutate, isPending: isAction } = usePost({
    queryKey: queryKey,
  });

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
        sort_order:1
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

  const onUpload = () => {
    if (!file || !file?.file || !isNumber(file?.sort_order)) return;
   
   
    mutate({
      endpoint: PRODUCT_VIDEO_ADMIN_URL,
      body: {
        product_id: itemId,
        video: file.file, // Send the actual file
        sort_order: file.sort_order, // Send the actual file
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

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
          <div className="w-full px-1">
                                   
                               
                                                  <Input
                                                    type="text"
                                                    placeholder="Sort Order"
                                                    className={!isNumber(file?.sort_order)&&'!ring-red-500'}
                                                    value={file.sort_order}
                                                    onChange={(e) => {
                                                      if(isNumber(e.target.value) || !e.target.value){

                                                      setFile({
                                                        ...file,
                                                        sort_order: e.target.value,
                                                      });
                                                      }
                                                    }}
                                                    
                                                  />

                                              </div>
          <Button
            disabled={isAction ||!isNumber(file?.sort_order) || !file?.file }
            size="sm"
            className="flex justify-start items-center space-x-2"
            onClick={onUpload}
          >
            {isAction ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> <span>Please Wait</span>
              </>
            ) : (
              <>
                <Upload size={16} /> <span>Upload Video</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductVideoDropzone;
