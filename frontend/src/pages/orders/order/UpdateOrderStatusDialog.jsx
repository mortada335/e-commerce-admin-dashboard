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
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { ORDERS_URL } from "@/utils/constants/urls";

import { ScrollArea } from "@/components/ui/scroll-area";

import { statusSchema } from "@/utils/validation/order";
import { setIsUpdateOrderStatusDialogOpen, useOrderStore } from "../store";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertStatusIdToString,
  convertStringToStatusId,
  handleError,
} from "@/utils/methods";
import { useQueryClient } from "@tanstack/react-query";
import CanSection from "@/components/CanSection";
import { axiosPrivate } from "@/api/axios";
import Can from "@/components/Can";
import { string } from "yup";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  status: "1",
  comment: "",
  customer_notified: "true",
};

export default function UpdateOrderStatusDialog() {
  const { isUpdateOrderStatusDialogOpen, orderDetails } = useOrderStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {t} =useTranslation()

  const form = useForm({
    resolver: yupResolver(statusSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isAction, setIsAction] = useState(false);

  // Initialize query client.
  const queryClient = useQueryClient();


  useEffect(() => {
    if (formFields.status) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      orderDetails !== null &&
      orderDetails !== undefined &&
      isUpdateOrderStatusDialogOpen
    ) {
      setFormFields({
        comment: orderDetails.comment || "",
        status: convertStatusIdToString(orderDetails.order_status_id),
      });

      form.setValue("comment", "");
      form.setValue(
        "status",
        convertStatusIdToString(orderDetails.order_status_id)
      );
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [orderDetails]);

  const onClose = () => {
    setIsUpdateOrderStatusDialogOpen(false);
    form.setValue(
      "comment",
      ""
    );
    form.setValue(
      "status",
      convertStatusIdToString(orderDetails.order_status_id)
    );

    setFormFields({
      status: orderDetails.order_status_id,
      comment: "",
    });
  };

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.status) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const arrayOfUserNotifiedOrNot =
      orderDetails?.customer_notified_id &&
      orderDetails?.customer_notified_id != ""
        ? JSON.parse(orderDetails?.customer_notified_id)
        : "";

    if (arrayOfUserNotifiedOrNot?.length) {
      arrayOfUserNotifiedOrNot.unshift(0);
    }

    let formData = {};

  

    formData = Object.fromEntries(
      Object.entries({
      
        comment: formFields.comment ? formFields.comment : null,
        customer_notified: formFields.customer_notified,
        order_status_id: convertStringToStatusId(formFields.status),
        // eslint-disable-next-line no-unused-vars
      }).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    try {
      setIsAction(true)

        const response = await axiosPrivate.patch(
          `${ORDERS_URL}${ orderDetails?.order_id}/`,

          formData,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 201 || response.status === 200) {
          toast({
            title: "Success",
            description: "Updated successfully",
          })
          onClose(response.data)
        }

      

      
    } catch (error) {
      // Handle the error
      // console.log(error)
      setIsAction(false)
      handleError(error)
     
    }finally{
      setIsAction(false)
      queryClient.invalidateQueries({ queryKey: ['Order'] })
    }

  
  };

  return (
    <Can permissions={["app_api.change_ocorder"]}>
      <Dialog
        open={isUpdateOrderStatusDialogOpen}
        onOpenChange={setIsUpdateOrderStatusDialogOpen}
      >
        <DialogContent className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]">
          <ScrollArea className=" h-[400px] pr-4 w-full ">
            <DialogHeader className="rtl:items-end">
              <DialogTitle className="tracking-wide">{t("Update Order")}</DialogTitle>
              <DialogDescription>
                {t("Make changes to order here. Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <Form {...form} className="h-full bg-black">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 pt-4"
              >
              
              <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("Status")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            status: value,
                          });
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select Status")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"Pending"}>{t("Pending")}</SelectItem>
                          <SelectItem value={"Completed"}>{t("Completed")}</SelectItem>
                          <SelectItem value={"Cancelled Order"}>
                            {t("Cancelled Order")}
                          </SelectItem>
                          <SelectItem value={"Refunded"}>{t("Refunded")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                      

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel className="capitalize">{t("comment")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Comment")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              comment: e.target.value,
                            });
                          }}
                          autoComplete="comment"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                control={form.control}
                name="customer_notified"
                render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between gap-4 rounded-lg border p-4  shadow-sm rtl:flex-row-reverse rtl:text-right">
                    <div className="space-y-0.5">
                      <FormLabel>{t("Do Notify")}</FormLabel>
                      <FormDescription>
                        {
                          t("Indicates whether the customer should receive notifications.")
                        }
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Select
                        value={field.value?.toString()} // Ensure string value
                        onValueChange={(value) => {
                          const booleanValue = value === "true";
                          field.onChange(booleanValue);
                          setFormFields({
                            ...formFields,
                            customer_notified: booleanValue,
                          });
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t("Select an option")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">{t('Yes')}</SelectItem>
                          <SelectItem value="false">{t('No')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />


                <div className="flex justify-end items-center w-full py-2 space-x-4">
                  <Button variant="secondary" onClick={onClose}>
                    {t("Cancel")}
                  </Button>
                  <Button disabled={!isSubmit || isAction} type="submit">
                    {isAction ? (
                      <p className="flex justify-center items-center space-x-2">
                        <Loader2 className=" h-5 w-5 animate-spin" />
                        <span>{t("Please wait")}</span>
                      </p>
                    ) : (
                      <span>{t("Save")}</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
