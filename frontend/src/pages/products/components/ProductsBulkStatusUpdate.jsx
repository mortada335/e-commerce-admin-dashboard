import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {  Loader2, } from "lucide-react";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import {  BULK_STATUS_UPDATE_URL } from "@/utils/constants/urls";


import { ScrollArea } from "@/components/ui/scroll-area";


import { setIsProductsBulkStatusUpdateDialogOpen, useProductStore } from "../store";


import * as XLSX from 'xlsx';
import ProductStatusAutoComplete from "@/pages/sections/components/ProductStatusAutoComplete";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FilesDropzone from "@/components/ui/customs-files-dropzone";
import usePost from "@/hooks/usePost";
import { useTranslation } from "react-i18next";



const defaultFormFields = {

  files: null,
};


export default function ProductsBulkStatusUpdate() {

  const { isProductsBulkStatusUpdateDialogOpen,  } = useProductStore()

  const {t} = useTranslation()
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [productModels, setProductModels] = useState([]);
  // Product status - [enabled or disabled] state.
  const [enabledFormField, setEnabledFormField] = useState("disabled");
  const [statusFormFields, setStatusFormFields] = useState({
    filter_id: -1,
    filter_name: null,
  });
  const handleFileUpload = async (droppedFiles) => {
    if (!Array.isArray(droppedFiles) || droppedFiles.length === 0) {
      setProductModels([]);
      return;
    }
  
    let allModels = [];
    let hasInvalidFile = false;
  
    for (const item of droppedFiles) {
      const file = item.file;
      if (!file) continue;
  
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        if (jsonData.length === 0) {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: `File "${file.name}" is empty or has no readable data.`,
          });
          hasInvalidFile = true;
          continue;
        }
  
        if (!("model" in jsonData[0])) {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: `File "${file.name}" does not contain a 'model' column.`,
          });
          hasInvalidFile = true;
          continue;
        }
  
        const models = jsonData.map((row) => row.model).filter(Boolean);
        allModels = allModels.concat(models);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: `Error reading file "${file.name}": ${error}`,
        });
        hasInvalidFile = true;
      }
    }
  
    const uniqueModels = Array.from(new Set(allModels));
    setProductModels(uniqueModels);
  
    if (hasInvalidFile) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Some files were invalid or did not contain a 'model' column.",
      });
    }
  
    if (uniqueModels.length === 0 && !hasInvalidFile) {

      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "No models found in the uploaded files.",
      });
    }
  };
  

  const form = useForm({
    
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onClose = () => {
    setIsProductsBulkStatusUpdateDialogOpen(false);
    form.reset();

  
    setEnabledFormField('disabled')
    setStatusFormFields({
      filter_id: -1,
    filter_name: null,
    })
    setFormFields(defaultFormFields);
    setProductModels([]);

   
  };

  const {
    mutate: postMutate,

    isPending: isPostAction,
  } = usePost({
    queryKey: "Products",
    onSuccess: onClose,
  });

  useEffect(() => {


    
    if (
      
      productModels?.length
    
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [productModels]);




  const onSubmit = async () => {

    if (

      !productModels?.length
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the required fields",
      });
    }

    
    const payload = {
      product_models: productModels,
  
      enabled:  enabledFormField === "enabled" ? true : false,     // also from a form
      // sort_order: 5,
      qty: 0,
      // qty_lt: 0,
      // qty_lte: 0,
      // qty_gt: null,
      // qty_gte: null,
    };

    if (statusFormFields.filter_id>=0) {
      payload.status = statusFormFields.filter_id ? statusFormFields.filter_id : 0
    }


          postMutate({
            endpoint: BULK_STATUS_UPDATE_URL,
            body: payload,
            
          });
    
    // mutate({
    //   url: BULK_STATUS_UPDATE_URL,
      
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   onFinish: onClose,
    //   formData:payload,
    // });
  };

  return (
    <Dialog
      open={isProductsBulkStatusUpdateDialogOpen}
      onOpenChange={setIsProductsBulkStatusUpdateDialogOpen}
    >
      <DialogContent className=" w-[90%] sm:max-w-[700px]">
        <ScrollArea className=" h-fit max-w-[99%] pr-4 w-full ">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>
             {t("Status Update")}
            </DialogTitle>
            <DialogDescription>
              {t("Change products status here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>


 <div className="flex flex-col w-full justify-start rtl:items-end items-start gap-2 mt-4">
      <Label htmlFor="products_model">{t("Products Model")}</Label>
      <FilesDropzone
                                loading={isPostAction }
                                disabled={isPostAction }
                                canPreview={true}
                                value={formFields.files}
                                onChange={(value) => {
                                  handleFileUpload(value)

                          setFormFields({
                            ...formFields,
                            files:value,
                          });
                        }}
                                accept={
                                  {

     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
  
    
  }
                                }
                               
                              />
      {/* <Input id="products_model" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
    </div>



       
                    

                <div className="flex flex-col w-full rtl:items-end justify-start items-start gap-2 mt-4">
                  <Label>{t("Status")}</Label>
                  <Select
                    className="w-full"
                    value={enabledFormField}
                    onValueChange={(value) => setEnabledFormField(value)}
                  >
                    <SelectTrigger className="text-muted-foreground">
                      <SelectValue
                        className="text-muted-foreground"
                        placeholder={t("Select status")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("Status")}</SelectLabel>
                        <SelectItem value="enabled">{t("Enabled")}</SelectItem>
                        <SelectItem value="disabled">{t("Disabled")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>



<div className="flex flex-col w-full justify-start rtl:items-end items-start gap-2 mt-4">
                  <Label>{t("Label")}</Label>
                  <ProductStatusAutoComplete
                    formFields={statusFormFields}
                    setFormFields={setStatusFormFields}
                  />
                </div>





              <div className="flex justify-end items-center w-full py-2 space-x-4 mt-4">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
                <Button disabled={!isSubmit || isPostAction} onClick={onSubmit}>
                  {isPostAction ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
              </div>

        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
