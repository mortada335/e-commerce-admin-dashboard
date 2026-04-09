import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import useMutation from "@/hooks/useMutation";

import { useState } from "react";

import FilesDropzone from "@/components/ui/FilesDropzone";
import { setIsAddImageDialog, useProductStore } from "../../store";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import { useTranslation } from "react-i18next";

function AddImageDialog({ product }) {
  const { toast } = useToast();
  const {t}= useTranslation()
  const { isAddImageDialog } = useProductStore();
  const [mediaFields, setMediaFields] = useState([]);
  const {
    mutate,

    isPending: isAction,
  } = useMutation("Product");

  const onClose = () => {
    setIsAddImageDialog(false);
  };

  const uploadImageFunction = async () => {
    if (!mediaFields.length) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }
    const formData = new FormData();
    formData.append("product_id", product?.data?.product_id);
    formData.append(
      "sort_id",
      JSON.stringify(mediaFields.map((image) => image.sort_order))
    );

    // Loop through mediaFields and append files to FormData
    mediaFields.forEach((item, index) => {
      if (item.file) {
        formData.append(`images[${index}]`, item.file);
      }
    });

    mutate({
      url: "product_images/",

      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: () => {
        setMediaFields([]);
        onClose();
      },
      formData,
    });
  };

  const removeFile = (sort_order) => {
    setMediaFields((files) =>
      files.filter((file) => file.sort_order !== sort_order)
    );
  };

  const handleChangeImageOrder = (e, index) => {
    const { value } = e.target;
    setMediaFields((prevMediaFields) => {
      const updatedFields = prevMediaFields.map((field, i) => {
        if (i === index) {
          return {
            ...field,
            sort_order: value,
          };
        }
        return field;
      });
      return updatedFields;
    });
  };

  return (
    <Dialog
      open={isAddImageDialog}
      onOpenChange={setIsAddImageDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%] flex flex-col justify-between items-end pt-10">
        <FilesDropzone
          className={"w-full"}
          currentFiles={product?.data?.images || []}
          files={mediaFields}
          setFiles={setMediaFields}
        />
        {!!mediaFields.length && (
          <ScrollArea className=" border rounded-md h-[410px] px-4 w-full flex flex-col justify-start items-center space-y-4 pb-6">
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  h-full w-full py-2 px-2  gap-4">
              {mediaFields
                ?.sort((a, b) => a.sort_order > b.sort_order)
                .map((file, index) => (
                  <li
                    key={index}
                    className="relative flex flex-col justify-center items-center  w-full min-h-full max-h-fit rounded-md  border px-2 py-2 space-y-2"
                  >
                    <img
                      src={file.image}
                      alt={file.name}
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                      className="h-20 w-full rounded-sm  object-contain  "
                    />
                    {/* <Text className={"truncate w-full"} text={file.name} /> */}

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="   flex justify-center items-center  w-5 h-5 rounded-full text-xs absolute top-0 right-1"
                      onClick={() => removeFile(file.sort_order)}
                    >
                      {/* Remove File */}
                      <X size={16} />
                    </Button>
                    
                    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">

        <Text className={" w-[99%] truncate !break-all"} text={file?.file?.name} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
        <Text className={"w-full"} text={file?.file?.name} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
                    <Input
                      className="h-8"
                      placeholder="Index"
                      value={mediaFields?.at(index).sort_order}
                      onChange={(e) => handleChangeImageOrder(e, index)}
                    />
                  </li>
                ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="flex items-center justify-start w-full rtl:flex-row-reverse flex-row gap-2 space-x-2">
          <Button
            disabled={!mediaFields.length || isAction}
            onClick={uploadImageFunction}
            type="button"
            className="w-fit"
          >
            {isAction ? (
              <p className="flex justify-center items-center space-x-2 w-fit">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>{t("Please wait")}</span>
              </p>
            ) : (
              <span>{t("Save")}</span>
            )}
          </Button>
          <Button variant="destructive" onClick={onClose} className="w-20">
            {t("Cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddImageDialog;
