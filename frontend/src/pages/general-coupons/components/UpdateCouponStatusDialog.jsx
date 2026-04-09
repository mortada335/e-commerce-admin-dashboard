import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2, Percent } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { GENERAL_COUPONS_URL, PRODUCTS_URL } from "@/utils/constants/urls";


import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { setIsChangeStatusDialogOpen, useGeneralCouponStore } from "../store";
import { updateCouponStatusSchema } from "@/utils/validation/general-coupon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addHours,  isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {  formatDateToISO, formatFullDate, formatFullDateNoTime } from "@/utils/methods";
import { Switch } from "@/components/ui/switch";
import PromoCodesCustomerIdAutoComplete from "@/components/PromoCodesCustomerIdAutoComplete";
import TimePicker from "@/components/ui/time-picker";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import usePatch from "@/hooks/usePatch";
import { useTranslation } from "react-i18next";

// Get the date after today to initiliaze the end date with.
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const defaultFormFields = {

  status: "enabled",

  date_start: new Date(),
  date_end: tomorrow,
};

// console.log("Today", today, "\n Tomorrow", tomorrow);

export default function UpdateCouponStatus({queryKey='GeneralCoupons'}) {
  const { isChangeStatusDialogOpen, selectedGeneralCoupon } =
    useGeneralCouponStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {t} = useTranslation()


  const form = useForm({
    resolver: yupResolver(updateCouponStatusSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

    // Date status state.
    const [dateStatus, setDateStatus] = useState({
      isSubmit: false,
      isValid: false,
    });
  

      const onClose = () => {
    setIsChangeStatusDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);


       // Reset date status.
       setDateStatus({
        isSubmit: false,
        isValid: false,
      });
  };

  const {
    mutate,

    isPending: isAction,
  } = usePatch({
    queryKey: queryKey,
      onSuccess: onClose,
  });


    // Effect for tracking validity of dates.
    useEffect(() => {
      const startDate = new Date(formFields.date_start);
      const endDate = new Date(formFields.date_end);
  
      // Check if endDate is before (earlier than) startDate + 1 hour
      if (isBefore(endDate, addHours(startDate, 1))) {
        setDateStatus((prevStatus) => ({
          ...prevStatus,
          isValid: false,
        }));
      } else {
        setDateStatus((prevStatus) => ({
          ...prevStatus,
          isValid: true,
        }));
      }
    }, [formFields.date_start, formFields.date_end]);
  

  useEffect(() => {
    if (
dateStatus.isValid
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [dateStatus]);

  useEffect(() => {
    if (
      selectedGeneralCoupon !== null &&
      selectedGeneralCoupon !== undefined &&
      isChangeStatusDialogOpen
    ) {
      setFormFields({

        status: selectedGeneralCoupon?.status === 1 ? "enabled" : "disable",
        date_start: selectedGeneralCoupon?.date_start 
        ? new Date(selectedGeneralCoupon?.date_start )
        :'',
        date_end: selectedGeneralCoupon?.date_end 
        ? new Date(selectedGeneralCoupon?.date_end )
        : '',

      });

      form.setValue("date_start", selectedGeneralCoupon?.date_start 
        ? new Date(selectedGeneralCoupon?.date_start )
        : '');
      form.setValue("date_end", selectedGeneralCoupon?.date_end 
        ? new Date(selectedGeneralCoupon?.date_end )
        :'');

      form.setValue(
        "status",
        selectedGeneralCoupon?.status === 1 ? "enabled" : "disable"
      );
    
    } else {
      // this is server error or other error that could happen
      form.reset();

    setFormFields(defaultFormFields);



       // Reset date status.
       setDateStatus({
        isSubmit: false,
        isValid: false,
      });
    }
  }, [selectedGeneralCoupon, isChangeStatusDialogOpen]);



  const onSubmit = async () => {
    setDateStatus((prevState) => ({
      ...prevState,
      isSubmit: true,
    }));

    if (!dateStatus.isValid) return;


    // Validate currency Change
    if (

      !dateStatus.isValid
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the required fields",
      });
    }

    const payload = {

      date_start:formatDateToISO(formFields.date_start),
      date_end:formatDateToISO(formFields.date_end),
      status: formFields.status === "enabled" ? 1 : 0,
    }



 mutate({
        endpoint: GENERAL_COUPONS_URL,
        id: selectedGeneralCoupon?.id,

        body: payload,
      
      });


 
  };

  return (
    <Dialog
      open={isChangeStatusDialogOpen}
      onOpenChange={setIsChangeStatusDialogOpen}
    >
      <DialogContent className="w-[95%] sm:max-w-[700px]  px-4">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className="  h-[400px] pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {t("Update")} {selectedGeneralCoupon?.code|| t('Promo Codes')} {t("Status")} 
            </DialogTitle>
            <DialogDescription>
              {t("Update")} {selectedGeneralCoupon?.code|| t('Promo Codes')} {t("Status here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >



              <div className="flex flex-col justify-between items-start gap-4 w-full px-1 pt-2">
                <FormField
                  control={form.control}
                  name="date_start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="py-1">{t("Start Date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatFullDate(field.value)
                              ) : (
                                <span>{t("Pick a date")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              field.onChange(value);
                              setFormFields({
                                ...formFields,
                                date_start: value,
                              });
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                          <TimePicker
                              selectedTime={formFields.date_start}
                              onSelectTime={(value) => {
                                field.onChange(value);
                                setFormFields({
                                  ...formFields,
                                  date_start: value,
                                });
                              }}
                            />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_end"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full ">
                      <FormLabel className={cn('py-1',
                          !dateStatus.isValid &&
                            dateStatus.isSubmit &&
                            "text-[#ef4444]"
                        )}>{t("End Date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatFullDate(field.value)
                              ) : (
                                <span>{t("Pick a date")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              field.onChange(value);
                              setFormFields({
                                ...formFields,
                                date_end: value,
                              });
                            }}
                            disabled={(date) => {
                              const startDate = new Date(
                                formFields.date_start
                              );
                              startDate.setDate(startDate.getDate() - 1);

                              return date <= startDate;
                            }}
                            initialFocus
                          />
                          <TimePicker
                              selectedTime={formFields.date_end}
                              onSelectTime={(value) => {
                                field.onChange(value);
                                setFormFields({
                                  ...formFields,
                                  date_end: value,
                                });
                              }}
                            />
                        </PopoverContent>
                      </Popover>
                      
                      {!dateStatus.isValid && dateStatus.isSubmit && (
                        <p className="text-[#ef4444] text-sm font-medium">
                          {t("End date must be at least one hour after the start date.")}
                        </p>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1 pb-2">
                    <FormLabel>{t("Status")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            status: value,
                          });
                        }}
                        autoComplete="status"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="enabled" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Enabled")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="disable" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Disable")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-start items-center w-full py-2 gap-4">
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center gap-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
          <ScrollBar orientation="horizontal" />
      </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
