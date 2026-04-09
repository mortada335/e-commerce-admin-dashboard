import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { BULK_ASSIGN_CATEGORIES_URL } from "@/utils/constants/urls";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setIsProductsBulkAssignCategoriesDialogOpen, useProductStore } from "../store";
import * as XLSX from 'xlsx';
import { Label } from "@/components/ui/label";
import FilesDropzone from "@/components/ui/customs-files-dropzone";
import usePost from "@/hooks/usePost";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  files: null,
};

export default function ProductsBulkAssignCategories() {
  const { isProductsBulkAssignCategoriesDialogOpen } = useProductStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [productCategories, setProductCategories] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const {t} = useTranslation()

  const form = useForm({ defaultValues: defaultFormFields });

  const onClose = () => {
    setIsProductsBulkAssignCategoriesDialogOpen(false);
    form.reset();
    setFormFields(defaultFormFields);
    setProductCategories([]);
  };

  const {
    mutate: postMutate,
    isPending: isPostAction,
  } = usePost({
    queryKey: "Products",
    onSuccess: onClose,
  });

  const handleFileUpload = async (droppedFiles) => {
    if (!Array.isArray(droppedFiles) || droppedFiles.length === 0) {
      setProductCategories([]);
      return;
    }

    let allProductCategories = [];
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
            title: "Failed!",
            description: `File "${file.name}" is empty.`,
          });
          hasInvalidFile = true;
          continue;
        }

        if (!("model" in jsonData[0]) || !("category_ids" in jsonData[0])) {
          toast({
            variant: "destructive",
            title: "Failed!",
            description: `File "${file.name}" must have 'model' and 'category_ids' columns.`,
          });
          hasInvalidFile = true;
          continue;
        }

        jsonData.forEach(row => {
          if (row.model) {
            let categoryIds = [];

            if (row.category_ids) {
              if (typeof row.category_ids === 'string') {
                categoryIds = row.category_ids
                  .split(",")
                  .map(id => parseInt(id))
                  .filter(Boolean);
              } else if (typeof row.category_ids === 'number') {
                categoryIds = [row.category_ids];
              } else if (Array.isArray(row.category_ids)) {
                categoryIds = row.category_ids.map(id => parseInt(id)).filter(Boolean);
              }
            }

            if (categoryIds.length > 0) {
              allProductCategories.push({
                model: String(row.model).trim(),
                category_ids: Array.from(new Set(categoryIds)),
              });
            }
          }
        });

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: `Error reading "${file.name}": ${error.message}`,
        });
        hasInvalidFile = true;
      }
    }

    setProductCategories(allProductCategories);

    if (!hasInvalidFile && allProductCategories.length === 0) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "No valid product categories found in uploaded files.",
      });
    }
  };

  useEffect(() => {
    setIsSubmit(productCategories.length > 0);
  }, [productCategories]);

  const onSubmit = async () => {
    if (!productCategories.length) {
      return toast({
        variant: "destructive",
        title: "Failed!",
        description: "You must upload valid models with category IDs.",
      });
    }

    const payload = {
      product_categories: productCategories,
    };

    // console.log("Submitting payload:", payload);

    postMutate({
      endpoint: BULK_ASSIGN_CATEGORIES_URL,
      body: payload,
    });
  };

  return (
    <Dialog
      open={isProductsBulkAssignCategoriesDialogOpen}
      onOpenChange={setIsProductsBulkAssignCategoriesDialogOpen}
    >
      <DialogContent className="w-[90%] sm:max-w-[700px]">
        <ScrollArea className="h-[450px] max-w-[99%] pr-4 w-full">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>{t("Products Bulk Category Update")}</DialogTitle>
            <DialogDescription>
              {t("Upload product models and category IDs using an Excel sheet.")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <div>
              <Label>{t("Products File (.xlsx)")}</Label>
              <FilesDropzone
                loading={isPostAction}
                disabled={isPostAction}
                canPreview
                value={formFields.files}
                onChange={(value) => {
                  handleFileUpload(value);
                  setFormFields({ ...formFields, files: value });
                }}
                accept={{
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
                }}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="secondary" onClick={onClose}>{t("Cancel")}</Button>
            <Button disabled={!isSubmit || isPostAction} onClick={onSubmit}>
              {isPostAction ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("Please wait")}</span>
                </span>
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
