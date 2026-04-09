import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Loader2,  } from "lucide-react";
import { useForm } from "react-hook-form";


import { useEffect, useState } from "react";

import {BULK_PRICE_UPDATE_URL, } from "@/utils/constants/urls";

import { ScrollArea } from "@/components/ui/scroll-area";


import { setIsProductsBulkPriceUpdateDialogOpen, useProductStore } from "../store";


import * as XLSX from 'xlsx';

import { Label } from "@/components/ui/label";
import FilesDropzone from "@/components/ui/customs-files-dropzone";
import usePost from "@/hooks/usePost";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumberWithCurrency } from "@/utils/methods";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";



const defaultFormFields = {

  files: null,
};



export default function ProductsBulkPriceUpdate() {

  const { isProductsBulkPriceUpdateDialogOpen,  } = useProductStore()

  const [formFields, setFormFields] = useState(defaultFormFields);
  const {t} = useTranslation()
  const [productModels, setProductModels] = useState([]);

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false, // Convert dates to strings using cell format
        });

        
        
  
        if (jsonData.length === 0) {
          toast(`File "${file.name}" is empty or has no readable data.`);
          hasInvalidFile = true;
          continue;
        }

     
        
  
        if (!("model" in jsonData[0])) {
          toast(`File "${file.name}" does not contain a 'model' column.`);
          hasInvalidFile = true;
          continue;
        }
  
        const isValidDecimal = (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0;
        };
        
        const isValidDate = (val) => {
          return !isNaN(Date.parse(val));
        };
        
        const validRows = jsonData.filter((row, index) => {
          const rowNum = index + 2; // Excel rows are 1-based, headers are row 1
          const model = row.model?.toString().trim();
          const price = row.price;
          const discounted_price = row.discounted_price;
          const discount_start_date = row.discount_start_date;
          const discount_expiry_date = row.discount_expiry_date;
        
          let isValid = true;
        
          if (!model) {
            toast(`Row ${rowNum} Invalid: Missing 'model'.`);
            isValid = false;
          }
        
          if (!price && !discounted_price) {
            toast(`Row ${rowNum} Invalid: Either 'price' or 'discounted_price' must be provided.`);
            isValid = false;
          }
        
          if (price && !isValidDecimal(price)) {
            toast(`Row ${rowNum} Invalid: 'price' must be a valid number > 0.`);
            isValid = false;
          }
        
          if (discounted_price !== undefined && discounted_price !== null) {
            const discounted = parseFloat(discounted_price);
          
            if (isNaN(discounted) || discounted < 0) {
              toast(`Row ${rowNum} Invalid: 'discounted_price' must be a valid number >= 0.`);
              isValid = false;
            }
          
            if (discounted > 0) {
              if (!discount_start_date || !discount_expiry_date) {
                toast(`Row ${rowNum} Invalid: Both discount_start_date and discount_expiry_date are required if discounted_price is greater than 0.`);
                isValid = false;
              } else {
                if (!isValidDate(discount_start_date)) {
                  toast(`Row ${rowNum} Invalid: discount_start_date is not a valid date.`);
                  isValid = false;
                }
                if (!isValidDate(discount_expiry_date)) {
                  toast(`Row ${rowNum} Invalid: discount_expiry_date is not a valid date.`);
                  isValid = false;
                }
              }
            }
          }
        
          return isValid;
        });
        
        
        
        if (validRows.length > 0) {
          allModels = allModels.concat(validRows);
        }
      } catch (error) {
        toast(`Error reading file "${file.name}": ${error}`);
        hasInvalidFile = true;
      }
    }
  
    const uniqueModels = Array.from(
      new Map(allModels.map((item) => [item.model, item])).values()
    );
    
    
    setProductModels(uniqueModels);
  
    if (hasInvalidFile) {
      toast("Some files were invalid or did not contain a 'model' column.");
    }
  
    if (uniqueModels.length === 0 && !hasInvalidFile) {

      toast("No valid data found in the uploaded files.");
    }
  };
  

  const form = useForm({
    
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onClose = () => {
    setIsProductsBulkPriceUpdateDialogOpen(false);
    form.reset();

  

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
      return toast("Please fill all the required fields");
    }

    
    const payload = {
      product_updates: productModels.map((modelObj) => ({
        model: modelObj.model,
        price: modelObj.price,
        discounted_price: modelObj.discounted_price,
        discount_start_date: modelObj.discount_start_date,
        discount_expiry_date: modelObj.discount_expiry_date,
      })),
    };


    


          postMutate({
            endpoint: BULK_PRICE_UPDATE_URL,
            body: payload,
            
          });

  };

  return (
    <Dialog
      open={isProductsBulkPriceUpdateDialogOpen}
      onOpenChange={setIsProductsBulkPriceUpdateDialogOpen}
    >
      <DialogContent className=" w-[90%] overflow-hidden md:max-w-[700px] lg:max-w-[800px] max-h-[90vh] ">
        <ScrollArea className=" h-[700px] max-w-[99%] pr-4 w-full ">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>
             {t("Price Update")}
            </DialogTitle>
            <DialogDescription>
              {t("Change products price here. Click save when you are done.")}
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
    {productModels.length > 0 && (
  <ScrollArea className=" h-[300px] w-full overflow-x-auto mt-4">
  <Table containerClassName="" className="w-full min-h-fit h-fit max-h-fit">
          <TableHeader className=" ">
            <TableRow className="divide-x-2 ">
              <TableHead className="w-fit !font-normal uppercase h-8">
                <span className="text-xs"># </span>
              </TableHead>
              <TableHead className="w-[150px] !font-normal uppercase  h-8">
                <span className="text-xs">{t("Model")} </span>
              </TableHead>
              <TableHead className="w-[100px] !font-normal uppercase  h-8">
                <span className="text-xs">{t("Price")}</span>
              </TableHead>
              <TableHead className="w-[150px] !font-normal uppercase  h-8">
                <span className="text-xs">{t("Discounted Price")}</span>
              </TableHead>
              <TableHead className=" w-[100px] !font-normal uppercase  h-8">
                <span className="text-xs">{t("Start Date")}</span>
              </TableHead>
              <TableHead className="w-[100px] !font-normal uppercase  h-8">
                <span className="text-xs">{t("End Date")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
     <TableBody className="min-h-fit h-fit max-h-fit">
                 {productModels?.length &&
                  productModels?.map((product, index) => (
                     <TableRow key={index} className="">
                       <TableCell className=" py-2">
                         {" "}
                         <span className="text-xs ">{index + 1}</span>
                       </TableCell>
                       <TableCell className=" py-2">
                  
                         <span className="text-xs ">{product?.model}</span>
                         
                         
                       
                       </TableCell>
     
                  
                       <TableCell className="py-2">
                         <span className="text-xs ">
                           {formatNumberWithCurrency(String(product?.price), "IQD")}
                         </span>
                       </TableCell>
                       <TableCell className="py-2">
                         {" "}
                         <span className="text-xs ">

                           {product?.discounted_price&&formatNumberWithCurrency(String(product?.discounted_price), "IQD")}
                         </span>
                       </TableCell>
                       <TableCell className="py-2">
                         {" "}
                         <span className="text-xs ">
                         {product.discount_start_date}
                         </span>
                       </TableCell>
                       <TableCell className="py-2">
                         {" "}
                         <span className="text-xs ">
                         {product.discount_expiry_date}
                         </span>
                       </TableCell>
                     </TableRow>
                   ))}
               </TableBody>
    </Table>
  </ScrollArea>
)}



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
