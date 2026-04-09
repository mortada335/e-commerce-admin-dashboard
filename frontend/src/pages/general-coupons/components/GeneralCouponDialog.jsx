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

import {  GENERAL_COUPONS_URL, PRODUCTS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { setIsGeneralCouponDialogOpen, useGeneralCouponStore } from "../store";
import { generalCouponSchema } from "@/utils/validation/general-coupon";
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
import CustomsCombobox from "@/components/ui/customs-combobox";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
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
    useGeneralCouponStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  // Percentage promo-code type state.
  const [percentType, setPercentType] = useState(false);

  // Free shipping type state.
  const [isProductType, setIsProductType] = useState(false);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [isFreeShippingOnFirstOrder, setIsFreeShippingOnFirstOrder] = useState(false);
  const [isPercentageOnFirstOrder, setIsPercentageOnFirstOrder] = useState(false);
  const [isProductTypeWithFreeShipping, setIsProductTypeWithFreeShipping] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
    const [categoryFormFields, setCategoryFormFields] = useState([]);
  
  const form = useForm({
    resolver: yupResolver(generalCouponSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

    // Date status state.
    const [dateStatus, setDateStatus] = useState({
      isSubmit: false,
      isValid: false,
    });
  

    const {t} = useTranslation()
  const {
    mutate,

    isPending: isAction,
  } = useMutation("GeneralCoupons");


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
      formFields?.name &&
      formFields?.code && ( isProductType ? formFields.discount   && (selectedProducts?.length||categoryFormFields?.length) : true )
      && ( isProductTypeWithFreeShipping ?(selectedProducts?.length||  categoryFormFields?.length)  : true )
      && ( isPercentageOnFirstOrder ?Number(formFields.discount||'0')  : true )
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
  }, [formFields,isProductType,selectedProducts,categoryFormFields,isProductTypeWithFreeShipping,isPercentageOnFirstOrder]);

  useEffect(() => {
    if (
      selectedGeneralCoupon !== null &&
      selectedGeneralCoupon !== undefined &&
      isGeneralCouponDialogOpen
    ) {
      setFormFields({
        name: selectedGeneralCoupon?.name || "",
        code: selectedGeneralCoupon?.code || "",
        discount: Number(selectedGeneralCoupon?.discount || "") === 0 
    ? 0 
    : Number(selectedGeneralCoupon?.discount || "").toFixed(4),
        total_max: selectedGeneralCoupon?.total_max || "",
        total_min: selectedGeneralCoupon?.total_min || "",
        status: selectedGeneralCoupon?.status === 1 ? "enabled" : "disable",
        date_start: selectedGeneralCoupon?.date_start 
        ? new Date(selectedGeneralCoupon?.date_start )
        : new Date(),
        date_end: selectedGeneralCoupon?.date_end 
        ? new Date(selectedGeneralCoupon?.date_end )
        : new Date(),
        for_customer_id: selectedGeneralCoupon?.for_customer_id,

        uses_customer: selectedGeneralCoupon?.uses_customer || "",
        uses_total: selectedGeneralCoupon?.uses_total || "",
      });

      // Check the percent, and fee shipping state when the type is 'X'.
      if (selectedGeneralCoupon?.type === "X") {
        setPercentType(true);
        setIsFreeShipping(true);
      }
      // Check the free shipping only when the type is 'D' or 'C'.
      else if (
        selectedGeneralCoupon?.type === "D" ||
        selectedGeneralCoupon?.type === "C"
      ) {
        setIsFreeShipping(true);
      }
      // Check the percentage type when the type is 'P'.
      else if (selectedGeneralCoupon?.type === "P") {
        setPercentType(true);
      }
      else if (selectedGeneralCoupon?.type === "A") {
        setPercentType(true);
        setIsProductType(true)
      
      }
      else if (selectedGeneralCoupon?.type === "B") {
        
        setPercentType(false);
        setIsProductType(true)
      }
      else if (selectedGeneralCoupon?.type === "Y") {

        setIsProductTypeWithFreeShipping(true)
      }
      else if (selectedGeneralCoupon?.type === "Z") {
        setIsFreeShippingOnFirstOrder(true);
      }
      else if (selectedGeneralCoupon?.type === "H") {
        setIsPercentageOnFirstOrder(true);
      }
      setSelectedProducts(selectedGeneralCoupon?.products_detail||[])
      setCategoryFormFields(selectedGeneralCoupon?.categories_detail||[])


      form.setValue("name", selectedGeneralCoupon?.name || "");
      form.setValue("code", selectedGeneralCoupon?.code || "");
      form.setValue(
        "discount",
        Number(selectedGeneralCoupon?.discount || "") === 0 
    ? 0 
    : Number(selectedGeneralCoupon?.discount || "").toFixed(4),
      );
      form.setValue("total_max", selectedGeneralCoupon?.total_max || "");
      form.setValue("total_min", selectedGeneralCoupon?.total_min || "");
      form.setValue("date_start", selectedGeneralCoupon?.date_start 
        ? new Date(selectedGeneralCoupon?.date_start )
        : new Date());
      form.setValue("date_end", selectedGeneralCoupon?.date_end 
        ? new Date(selectedGeneralCoupon?.date_end )
        : new Date());
      form.setValue("for_customer_id", selectedGeneralCoupon?.for_customer_id);
      form.setValue(
        "status",
        selectedGeneralCoupon?.status === 1 ? "enabled" : "disable"
      );
      form.setValue("type", selectedGeneralCoupon?.type === "D" ? true : false);
      form.setValue(
        "uses_customer",
        selectedGeneralCoupon?.uses_customer || ""
      );
      form.setValue("uses_total", selectedGeneralCoupon?.uses_total || "");
    } else {
      // this is server error or other error that could happen
      form.reset();

    setFormFields(defaultFormFields);

    // Reset percent type state.
    setPercentType(false);

    // Reset free shipping state.
    setIsFreeShipping(false);
    setIsProductType(false);
    setIsFreeShippingOnFirstOrder(false);
    setIsPercentageOnFirstOrder(false);
    setSelectedProducts([])
    setCategoryFormFields([])

    setPercentType(false)

       // Reset date status.
       setDateStatus({
        isSubmit: false,
        isValid: false,
      });
    }
  }, [selectedGeneralCoupon, isGeneralCouponDialogOpen]);

  const onClose = () => {
    setIsGeneralCouponDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);

    // Reset percent type state.
    setPercentType(false);

    // Reset free shipping state.
    setIsFreeShipping(false);
    setIsProductType(false);
    setIsFreeShippingOnFirstOrder(false);
    setIsPercentageOnFirstOrder(false);
    setIsProductTypeWithFreeShipping(false);
    setCategoryFormFields([])
    setSelectedProducts([])
 
    setPercentType(false)

       // Reset date status.
       setDateStatus({
        isSubmit: false,
        isValid: false,
      });
  };

  const onSubmit = async () => {
    setDateStatus((prevState) => ({
      ...prevState,
      isSubmit: true,
    }));

    if (!dateStatus.isValid) return;


    // Validate currency Change
    if (
      !isSubmit
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the required fields",
      });
    }

    const payload = {
      name:formFields.name,
      code:formFields.code,
      total_max:formFields.total_max,
      total_min:formFields.total_min,
      discount:formFields.discount || 0,
      uses_total:formFields.uses_total || 0,
      uses_customer:formFields.uses_customer || 0,
 
      categories:[],
      for_customer_id:0,
      type:0,
      date_start:formatDateToISO(formFields.date_start),
      date_end:formatDateToISO(formFields.date_end),
      status: formFields.status === "enabled" ? 1 : 0,
    }

     if (formFields.for_customer_id) {
      
       payload.for_customer_id=formFields.for_customer_id
     }
      
 


    // const formData = new FormData();
    // formData.append("name", formFields.name);
    // formData.append("code", formFields.code);
    // formData.append("type", 0);

    // formData.append("discount", formFields.discount || 0);
    

    // formData.append("status", formFields.status === "enabled" ? 1 : 0);
    // formData.append("total_max", formFields.total_max);
    // formData.append("total_min", formFields.total_min);
    // if (formFields.for_customer_id)
    //   formData.append("for_customer_id", formFields.for_customer_id);
    // formData.append("uses_total", formFields.uses_total || 0);
    // formData.append("uses_customer", formFields.uses_customer || 0);
    // formData.append("date_start", formatDateToISO(formFields.date_start));
    // formData.append("date_end", formatDateToISO(formFields.date_end));
    // if (!selectedProducts?.length) {
    //   formData.append("products[0]",null);
    // }
    
    if (isFreeShippingOnFirstOrder){
      payload.type="Z"
      payload.discount=0
      // formData.append("type", "Z");
      // formData.append("discount", 0);
    } 
    else if (isPercentageOnFirstOrder){
      payload.type="H"
      // formData.append("type", "H");
    } 
    else if (percentType && isFreeShipping){
      // formData.append("type", "X");
        payload.type="X"
    } 
    else if (percentType && isProductType){ 
      // formData.append("type", "A");
        payload.type="A"

      if (selectedProducts?.length) {

            // Loop through selectedProducts and append files to FormData
          //   selectedProducts.forEach((item, index) => {
          //    if (item.product_id) {
          //     if (item.product_id) {
          //       payload[`products[${index}]`]=item.product_id
               
          //   }
          //    }
          //  });
        // formData.append("products", selectedProducts?.map((product)=>product?.product_id)||[]);
        
        payload.products=selectedProducts?.map((product)=>product?.product_id)||[]
    
       
      }
            if (categoryFormFields?.length) {


                  payload.products=categoryFormFields?.map((item)=>Number(item?.category_id))||[]
      }

    
    
    }
    else if (!percentType && isProductType){ 
      // formData.append("type", "B");
        payload.type="B"

      if (selectedProducts?.length) {
        // formData.append("products", selectedProducts?.map((product)=>product?.product_id)||[]);
                   // Loop through selectedProducts and append files to FormData
                  //  selectedProducts.forEach((item, index) => {
                  //   if (item.product_id) {
                  //       payload[`products[${index}]`]=item.product_id
                       
                  //   }
                  // });

                  payload.products=selectedProducts?.map((product)=>product?.product_id)||[]
      }
            if (categoryFormFields?.length) {


                  payload.categories=categoryFormFields?.map((item)=>Number(item?.category_id))||[]
      }

    
    
    }
    else if (isProductTypeWithFreeShipping){ 
      // formData.append("type", "y");
        payload.type="Y"
             payload.discount=0
      if (selectedProducts?.length) {
        // formData.append("products", selectedProducts?.map((product)=>product?.product_id)||[]);
                   // Loop through selectedProducts and append files to FormData
                  //  selectedProducts.forEach((item, index) => {
                  //   if (item.product_id) {
                  //       payload[`products[${index}]`]=item.product_id
                       
                  //   }
                  // });

                  payload.products=selectedProducts?.map((product)=>product?.product_id)||[]
      }

      if (categoryFormFields?.length) {


                  payload.categories=categoryFormFields?.map((item)=>Number(item?.category_id))||[]
      }

    
    }
    // Free shipping type only.
    else if (
      (!percentType && isFreeShipping && formFields.discount === "0") ||
      (!percentType && isFreeShipping && formFields.discount === 0) ||
      (!percentType && isFreeShipping && formFields.discount === "")
    ){
      // formData.append("type", "D");
        payload.type="D"
    }
    // Percentage type only.
    else if (!isFreeShipping && percentType){
      // formData.append("type", "P");
        payload.type="P"
    } 
    // Free shipping and discount.
    else if (isFreeShipping && formFields.discount !== 0 && formFields.discount !== '0'){
      // formData.append("type", "C");
        payload.type="C"
    }



    
  
    mutate({
      url: GENERAL_COUPONS_URL,
      id: selectedGeneralCoupon?.id,
     
      onFinish: onClose,
      formData:payload,
    });
  };

  return (
    <Dialog
      open={isGeneralCouponDialogOpen}
      onOpenChange={setIsGeneralCouponDialogOpen}
    >
      <DialogContent className="w-[95%] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] px-4">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className="  h-[400px] md:h-[550px] lg:h-[650px] xl:h-[700px] 2xl:h-fit pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedGeneralCoupon?.id ? t("Edit") : t("Create")} {t("Promo Codes")}
            </DialogTitle>
            <DialogDescription>
              {selectedGeneralCoupon?.id ? t("Make changes to your") : t("Create")}{" "}
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
                        {t("Name")}
                        <span className="text-red-500 text-base">*</span>
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
                        {t("Code")}
                        <span className="text-red-500 text-base">*</span>
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
                  disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping}
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel> {t("Discount")}
                      {isProductType || isPercentageOnFirstOrder &&  <span className="text-red-500 text-base">*</span>}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping}
                            min={0}
                            max={2147483647}
                            type="number"
                            step={0.0001}
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
                          {percentType || isPercentageOnFirstOrder && (
                            <span className="absolute top-[.6rem] right-3 p-1 bg-white dark:bg-slate-900">
                              {/* Small devices */}
                              <Percent className="sm:hidden" size={10} />
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
              <div className="flex justify-between items-end flex-wrap w-full pt-2 pb-4 gap-4 ">
                {/* PERCENTAGE TYPE */}
                <div className="w-full sm:w-[40%]">
                  <FormField
                    control={form.control}
                    disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-start gap-4 w-full  rounded-lg">
                        <FormControl>
                          <Switch
                          disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping || isPercentageOnFirstOrder}
                            checked={percentType}
                            onCheckedChange={(value) => {
                              field.onChange(value);

                              setPercentType((prev) => !prev);
                            }}
                          />
                        </FormControl>
                        
                          <FormLabel className="flex items-center gap-1">
                            {/* Small devices */}
                            <Percent className="sm:hidden" size={10} />
                            {/* Larger devices */}
                            <Percent className="hidden sm:block" size={14} />
                            {t("Percentage Type")}
                          </FormLabel>
                       
                      </FormItem>
                    )}
                  />
                </div>

                {/* FREE SHIPPING */}
                <div className="w-full sm:w-[40%]">
                  <FormField
                    control={form.control}
                    disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping || isPercentageOnFirstOrder}
                    name="FREE_SHIPPING "
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-start gap-4 w-full rounded-lg ">
                        <FormControl>
                          <Switch
                            disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping}
                            checked={isFreeShipping}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                             
                              setIsFreeShipping((prev) => !prev);
                         
                            }}
                          />
                        </FormControl>
                        
                          <FormLabel>{t("Free Shipping")}</FormLabel>
                       
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-between items-end flex-wrap w-full pt-2 pb-4 gap-4 ">
                 {/* Product */}
                 {/* <div className="w-full sm:w-[40%]">
                  <FormField
                    control={form.control}
                    disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping || isPercentageOnFirstOrder}
                    name="PRODUCT"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-start gap-4 w-full rounded-lg ">
                        <FormControl>
                          <Switch
                            checked={isProductType}
                            disabled={isFreeShippingOnFirstOrder || isProductTypeWithFreeShipping || isPercentageOnFirstOrder }
                            onCheckedChange={(value) => {
                              field.onChange(value);
                             
                              setIsProductType((prev) => !prev);
                         
                            }}
                          />
                        </FormControl>
                        
                          <FormLabel>{t("Product Type")}</FormLabel>
                       
                      </FormItem>
                    )}
                  />
                </div> */}


              <div className="w-full sm:w-[40%]">

              <FormField
                    control={form.control}
                    name="product_with_free_delivery"
                    disabled={isFreeShippingOnFirstOrder }
                    render={({ field }) => (
                      <FormItem className="flex items-start justify-start gap-4  w-full  rounded-lg">
                        <FormControl>
                          <Switch
                            checked={isProductTypeWithFreeShipping}
                            disabled={isFreeShippingOnFirstOrder || isPercentageOnFirstOrder }
                            onCheckedChange={(value) => {
                              field.onChange(value);
                              setIsProductTypeWithFreeShipping((prev) => !prev);
                              setIsFreeShippingOnFirstOrder(false);
                              setIsPercentageOnFirstOrder(false);
                              setIsFreeShipping(false);
                              setPercentType(false);
                              setIsProductType(false);
                                 form.setValue("discount", 0);
                                 setFormFields({
                                ...formFields,
                                discount: 0,
                              });

                            }}
                          />
                        </FormControl>
          
                          <FormLabel >{t("Products with free delivery")}</FormLabel>
                    
                      </FormItem>
                    )}
                  />
              </div>
              </div>
                    <div className="flex justify-between items-end flex-wrap w-full pt-2 pb-4 gap-4 ">

                            <div className="w-full sm:w-[40%]">

              <FormField
                    control={form.control}
                    name="free_delivery_on_first_order"
                    render={({ field }) => (
                      <FormItem className="flex items-start justify-start gap-4  w-full  rounded-lg">
                        <FormControl>
                          <Switch
                            checked={isFreeShippingOnFirstOrder}
                            disabled={ isProductTypeWithFreeShipping || isPercentageOnFirstOrder}
                            onCheckedChange={(value) => {
                              field.onChange(value);

                              setIsFreeShippingOnFirstOrder((prev) => !prev);
                              setIsFreeShipping(false);
                              setPercentType(false);
                              setIsProductType(false);
                              setIsProductTypeWithFreeShipping(false);
                              setIsPercentageOnFirstOrder(false);
                               form.setValue("discount", 0);
                                 setFormFields({
                                ...formFields,
                                discount: 0,
                              });
                            }}
                          />
                        </FormControl>
          
                          <FormLabel >{t("Free Shipping on First Order")}</FormLabel>
                    
                      </FormItem>
                    )}
                  />
              </div>
                            <div className="w-full sm:w-[40%]">

              <FormField
                    control={form.control}
                    name="percentage_on_first_order"
                    render={({ field }) => (
                      <FormItem className="flex items-start justify-start gap-4  w-full  rounded-lg">
                        <FormControl>
                          <Switch
                            checked={isPercentageOnFirstOrder}
                            disabled={ isProductTypeWithFreeShipping}
                            onCheckedChange={(value) => {
                              field.onChange(value);

                              setIsPercentageOnFirstOrder((prev) => !prev);
                              setIsFreeShipping(false);
                              setPercentType(false);
                              setIsProductType(false);
                              setIsProductTypeWithFreeShipping(false);
                              setIsFreeShippingOnFirstOrder(false);
                             
                              
                            }}
                          />
                        </FormControl>
          
                          <FormLabel >{t("Percentage on First Order")}</FormLabel>
                    
                      </FormItem>
                    )}
                  />
              </div>
                    </div>
              {
                (isProductType || isProductTypeWithFreeShipping)&&
                                <>

                                              <FormItem className="w-full px-1 ">
              
                            <FormLabel>{t("Products")}</FormLabel>
              
              
                  
                                           <CustomsMultiCombobox
                                                        
                                                     
                                                          endpoint={PRODUCTS_URL}
                                                          itemKey={"product_id"}
                                                          setItems={setSelectedProducts}
                                                          items={selectedProducts}
                                                  
                                                          itemTitle="model"
                                                          searchQueryKey="model"
                                                          sortBy="-date_added"
                                                          queryKey="products"
                                                          className="border rounded-md px-1"
                                                          placeholder={t("Select Products")}
                                                        />
                                         
                            </FormItem>

                                         <FormItem className="w-full px-1 ">
                                           <FormLabel>{t("Categories")}</FormLabel>
                              
                           
                                                    <CategoryMultiSelect
                                                             className="py-1 px-1 border rounded-md "
                                                             selectedCategories={categoryFormFields}
                                                             setSelectedCategories={setCategoryFormFields}
                                                           />
                           
                            
                                                    
                                         </FormItem>
                </>
              
              }

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
