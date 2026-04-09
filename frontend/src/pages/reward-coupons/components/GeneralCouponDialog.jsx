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

import { GENERAL_COUPONS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { setIsGeneralCouponDialogOpen,  useRewardCouponStore } from "../store";
import { generalCouponSchema } from "@/utils/validation/general-coupon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/utils/methods";
import { Switch } from "@/components/ui/switch";
import PromoCodesCustomerIdAutoComplete from "@/components/PromoCodesCustomerIdAutoComplete";
import { useTranslation } from "react-i18next";

// Get the date after today to initiliaze the end date with.
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const defaultFormFields = {
  for_customer_id: "",
  code: "",
  name: "",
  status: "enabled",
  discount: "",
  uses_customer: "",
  uses_total: "",
  type: 0,
  total_max: "",
  total_min: "",
  date_start: new Date(),
  date_end: tomorrow,
};

// console.log("Today", today, "\n Tomorrow", tomorrow);

export default function GeneralCoupon() {
  const { isGeneralCouponDialogOpen, selectedGeneralCoupon } =
  useRewardCouponStore();
  const { toast } = useToast();
  const {t} = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields);

  // Percentage promo-code type state.
  const [percentType, setPercentType] = useState(false);

  // Free shipping type state.
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  const form = useForm({
    resolver: yupResolver(generalCouponSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("GeneralCoupons");

  useEffect(() => {
    if (
      formFields.name &&
      formFields.code
      // formFields.discount &&
      // formFields.date_start &&
      // formFields.date_end &&
      // formFields.status &&
      // formFields.uses_total &&
      // formFields.uses_customer &&
      // formFields.for_customer_id &&
      // formFields.total_max &&
      // formFields.total_min
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedGeneralCoupon !== null &&
      selectedGeneralCoupon !== undefined &&
      isGeneralCouponDialogOpen
    ) {
      setFormFields({
        name: selectedGeneralCoupon.name,
        code: selectedGeneralCoupon.code,
        discount: Number(selectedGeneralCoupon.discount)?.toFixed(1),
        total_max: selectedGeneralCoupon.total_max || 0,
        total_min: selectedGeneralCoupon.total_min || 0,
        status: selectedGeneralCoupon.status === 1 ? "enabled" : "disable",
        date_start: selectedGeneralCoupon.date_start,
        date_end: selectedGeneralCoupon.date_end,
        for_customer_id: selectedGeneralCoupon.for_customer_id,

        uses_customer: selectedGeneralCoupon.uses_customer,
        uses_total: selectedGeneralCoupon.uses_total,
      });

      // Check the percent, and fee shipping state when the type is 'X'.
      if (selectedGeneralCoupon.type === "X") {
        setPercentType(true);
        setIsFreeShipping(true);
      }
      // Check the free shipping only when the type is 'D'.
      else if (selectedGeneralCoupon.type === "D") {
        setIsFreeShipping(true);
      }
      // Check the percentage type when the type is 'P'.
      else if (selectedGeneralCoupon.type === "P") {
        setPercentType(true);
      }

      form.setValue("name", selectedGeneralCoupon.name);
      form.setValue("code", selectedGeneralCoupon.code);
      form.setValue(
        "discount",
        Number(selectedGeneralCoupon.discount)?.toFixed(1)
      );
      form.setValue("total_max", selectedGeneralCoupon.total_max);
      form.setValue("total_min", selectedGeneralCoupon.total_min);
      form.setValue("date_start", selectedGeneralCoupon.date_start);
      form.setValue("date_end", selectedGeneralCoupon.date_end);
      form.setValue("for_customer_id", selectedGeneralCoupon.for_customer_id);
      form.setValue(
        "status",
        selectedGeneralCoupon.status === 1 ? "enabled" : "disable"
      );
      form.setValue("type", selectedGeneralCoupon.type === "D" ? true : false);
      form.setValue("uses_customer", selectedGeneralCoupon.uses_customer);
      form.setValue("uses_total", selectedGeneralCoupon.uses_total);
    } else {
      // this is server error or other error that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedGeneralCoupon]);

  const onClose = () => {
    setIsGeneralCouponDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);

    // Reset percent type state.
    setPercentType(false);

    // Reset free shipping state.
    setIsFreeShipping(false);
  };



  const onSubmit = async () => {
    // Validate currency Change
    if (
      !formFields.name ||
      !formFields.code ||
      !formFields.date_start ||
      !formFields.date_end ||
      !formFields.status
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the required fields",
      });
    }

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("code", formFields.code);

    formData.append("discount", formFields.discount || 0);

    // Both types, free and precentage.
    if (percentType && isFreeShipping) formData.append("type", "X");
    // Free shipping type.
    else if (!percentType && isFreeShipping) formData.append("type", "D");
    // Percentage type.
    else if (!isFreeShipping && percentType) formData.append("type", "P");
    // No type.
    else formData.append("type", 0);

    formData.append("status", formFields.status === "enabled" ? 1 : 0);
    formData.append("total_max", formFields.total_max);
    formData.append("total_min", formFields.total_min);
    if (formFields.for_customer_id)
      formData.append("for_customer_id", formFields.for_customer_id);
    formData.append("uses_total", formFields.uses_total || 0);
    formData.append("uses_customer", formFields.uses_customer || 0);
    formData.append("date_start", formatDate(formFields.date_start));
    formData.append("date_end", formatDate(formFields.date_end));
    mutate({
      url: GENERAL_COUPONS_URL,
      id: selectedGeneralCoupon?.id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Dialog
      open={isGeneralCouponDialogOpen}
      onOpenChange={setIsGeneralCouponDialogOpen}
    >
           <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[500px] sm:h-[600px] pr-4 w-full ">
       
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedGeneralCoupon?.id ? t("Edit") : t("Create")} {t("Promo Codes")}
            </DialogTitle>
            <DialogDescription>
              {selectedGeneralCoupon?.id ? "Make changes to your" : t("Create")}{" "}
              {t("Promo Codes here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <div className="flex justify-center items-end space-x-4 w-full px-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Promo Codes name")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              name: e.target.value,
                            });
                          }}
                          autoComplete="name"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="for_customer_id"
                  render={({ field }) => (
                    <FormItem className="w-full  pt-0">
                      <FormLabel>Customer ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Promo Codes for Customer"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              for_customer_id: e.target.value,
                            });
                          }}
                          autoComplete="for_customer_id"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <div className="w-full leading-none font-medium text-sm">
                  <span>{t("Customer ID")}</span>
                  <PromoCodesCustomerIdAutoComplete
                    formFields={formFields}
                    setFormFields={setFormFields}
                    className="text-muted-foreground mt-3"
                  />
                </div>
              </div>
              <div className="flex justify-between items-start space-x-4 w-full px-1">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="w-full pt-0">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Code")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Promo Codes code")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              code: e.target.value,
                            });
                          }}
                          autoComplete="code"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="uses_customer"
                  render={({ field }) => (
                    <FormItem className="w-full  pt-0">
                      <FormLabel>{t("Customer uses")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("Customer uses")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              uses_customer: e.target.value,
                            });
                          }}
                          autoComplete="uses_customer"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-start space-x-4 w-full px-1">
                <FormField
                  control={form.control}
                  name="uses_total"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel>{t("Total Uses")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={2147483647}
                          placeholder={t("Promo Codes Total Uses")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              uses_total: e.target.value,
                            });
                          }}
                          autoComplete="uses_total"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel>{t("Discount")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            min={0}
                            max={2147483647}
                            type="number"
                            step={0.01}
                            placeholder={t("Promo Codes discount")}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                discount: e.target.value,
                              });
                            }}
                            autoComplete="coupon"
                          />
                          {percentType && (
                            <span className="absolute top-[.6rem] right-3 p-1 bg-white">
                              {/* Small devices */}
                              <Percent className="md:hidden" size={10} />
                              {/* Larger devices */}
                              <Percent className="hidden sm:block" size={14} />
                            </span>
                          )}
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-start space-x-4 w-full px-1">
                <FormField
                  control={form.control}
                  name="total_min"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel>{t("Total Min")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={2147483647}
                          placeholder={t("Promo Codes Minimum Total Cost")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              total_min: e.target.value,
                            });
                          }}
                          autoComplete="total_min"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_max"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel>{t("Total Max")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={2147483647}
                          placeholder={t("Promo Codes Maximum Total Cost")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              total_max: e.target.value,
                            });
                          }}
                          autoComplete="total_max"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-start space-x-4 w-full px-1 pt-2">
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
                                format(field.value, "PPP")
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
                      <FormLabel className="py-1">{t("End Date")}</FormLabel>
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
                                format(field.value, "PPP")
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
                            disabled={(date) =>
                              date < new Date(formFields.date_end)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-end w-full pt-2 pb-4">
                {/* PERCENTAGE TYPE */}
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-start gap-4 md:gap-12 w-full  rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-1">
                          {/* Small devices */}
                          <Percent className="md:hidden" size={10} />
                          {/* Larger devices */}
                          <Percent className="hidden sm:block" size={14} />
                          {t("Percentage Type")}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={percentType}
                          onCheckedChange={(value) => {
                            field.onChange(value);

                            setPercentType((prev) => !prev);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* FREE SHIPPING */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-start gap-12 w-full rounded-lg md:ml-[9.5rem]">
                      <div className="space-y-0.5">
                        <FormLabel>{t("Free Shipping")}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={isFreeShipping}
                          onCheckedChange={(value) => {
                            field.onChange(value);

                            setIsFreeShipping((prev) => !prev);
                          }}
                        />
                      </FormControl>
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
                        className="flex rtl:flex-row-reverse space-x-1"
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

              <div className="flex justify-start items-center w-full py-2 space-x-4">
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
