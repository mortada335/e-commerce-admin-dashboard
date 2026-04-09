import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useEffect, useState } from "react";

import usePost from "@/hooks/usePost";


import { ScrollArea } from "@/components/ui/scroll-area";

import { setIsBulkGiftCardDialogOpen, useGiftCardsStore } from "../store";
import { bulkGiftCardSchema,  } from "@/utils/validation/gift-card";



import { toast } from "sonner";

import { ADMIN_BULK_GIFT_CARDS_URL, } from "@/utils/constants/urls";
import { useTranslation } from "react-i18next";



const defaultFormFields = {
  count: "",
  amount_iqd: "",
};

export default function BulkGiftCardDialog() {
  const { isBulkGiftCardDialogOpen } = useGiftCardsStore();

  const [formFields, setFormFields] = useState(defaultFormFields);
  const {t} =useTranslation()


  const form = useForm({
    resolver: yupResolver(bulkGiftCardSchema),
    defaultValues: defaultFormFields,
  });

  const [isSubmit, setIsSubmit] = useState(false);


  const onFinish = () => {
    setFormFields(defaultFormFields);
    form.reset();
    setIsBulkGiftCardDialogOpen(false);
  };
  const {
    mutate: postMutate,

    isPending: isPostAction,
  } = usePost({
    queryKey: "gift-cards",
    onSuccess: onFinish,
  });


  useEffect(() => {
    if (
      formFields.count &&
    
      formFields.amount_iqd
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields,]);



  const onClose = () => {
    setIsBulkGiftCardDialogOpen(false);
    form.reset();
    setFormFields(defaultFormFields);
  };

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  const onSubmit = async () => {
    // Validate currency Change
    if (
      !formFields.count ||
      !formFields.amount_iqd 
 
    ) {
      return toast("Please fill all the fields");
    }

    const formData = {
      count: formFields.count,
      amount_iqd: formFields.amount_iqd,

    };
    

      postMutate({
        endpoint: ADMIN_BULK_GIFT_CARDS_URL,
        body: formData,
       
      });
    
  };

  return (
    <Dialog open={isBulkGiftCardDialogOpen} onOpenChange={setIsBulkGiftCardDialogOpen}>
      <DialogContent className="max-w-[95%] sm:max-w-[80%] md:w-[600px] max-h-[90vh] ">
        <ScrollArea className=" h-[300px] pr-4 w-full ">
          <DialogHeader className={"mb-4 rtl:items-end"}>
            <DialogTitle>
           {t("Bulk create gift card")}
            </DialogTitle>
            <DialogDescription>
              {t("Bulk create gift card")} {t("here")}. {t("Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">

              <FormField
  control={form.control}
  name="count"
  render={({ field }) => (
    <FormItem className="w-full px-0 pt-0">
      <FormLabel>
        {" "}
        {t("Count")}
        <span className="text-red-500 text-lg">*</span>
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder={t("Entry count")}
          value={field.value}
          onChange={(e) => {
            field.onChange(e.target.value);

            setFormFields({
              ...formFields,
              count: e.target.value,
            });
          }}
    
          className=""
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>
              <FormField
  control={form.control}
  name="amount_iqd"
  render={({ field }) => (
    <FormItem className="w-full px-0 pt-0">
      <FormLabel>
        {" "}
        {t("Amount IQD")}
        <span className="text-red-500 text-lg">*</span>
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder={t("Entry card amount")}
          value={field.value}
          onChange={(e) => {
            field.onChange(e.target.value);

            setFormFields({
              ...formFields,
              amount_iqd: e.target.value,
            });
          }}
    
          className=""
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

                {/* <FormField
                  control={form.control}
                  name="start_date_at"
                  render={({ field }) => (
                    <FormItem className="w-full px-0 pt-0">
                      <FormLabel>
                        {" "}
                        {t("start_date_at")}
                        <span className="text-red-500 text-lg">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          date={formFields.start_date_at}
                          setDate={(value) => {
                            field.onChange(value);

                            setFormFields({
                              ...formFields,
                              start_date_at: value,
                            });
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
   


              <div className="flex flex-row rtl:flex-row-reverse justify-start items-center w-full py-2 gap-4">
                <Button
                  disabled={!isSubmit || isPostAction}
                  type="submit"
                >
                  {isPostAction  ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
