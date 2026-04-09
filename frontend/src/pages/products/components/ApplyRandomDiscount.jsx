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

import { APPLY_RANDOM_DISCOUNT_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { setIsApplyRandomDiscountDialogOpen, useProductStore } from "../store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { formatDate, formatFullDateNoTime } from "@/utils/methods";

import { applyRandomDiscountSchema } from "@/utils/validation/product";
import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import { useTranslation } from "react-i18next";


// Get the date after today to initiliaze the end date with.
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const defaultFormFields = {

  num_products: "",
  discount_type: "amount",
  discount_value: "",
  discount_start_date: new Date(),
  discount_expiry_date: tomorrow,
};

// console.log("Today", today, "\n Tomorrow", tomorrow);

export default function ApplyRandomDiscount() {

  const { isApplyRandomDiscountDialogOpen,  } = useProductStore()

  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [selectedCategory, setSelectedCategory] = useState({
    filter_id: "",
    filter_name: "",
  
  });

  // Percentage promo-code type state.
  const [percentType, setPercentType] = useState(false);

  // Free shipping type state.
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const {t} = useTranslation() 

  const form = useForm({
    resolver: yupResolver(applyRandomDiscountSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Products");

  useEffect(() => {


    
    if (
      selectedCategory?.filter_id &&
      formFields?.discount_value &&
      formFields?.discount_start_date &&
      formFields?.discount_expiry_date &&
      formFields?.discount_type
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {

      // this is server error or other error that could happen
      setFormFields(defaultFormFields);
      form.reset();
    
  }, [isApplyRandomDiscountDialogOpen]);

  const onClose = () => {
    setIsApplyRandomDiscountDialogOpen(false);
    form.reset();

    setSelectedCategory({
      filter_id: "",
      filter_name: "",
    
    })


    setFormFields(defaultFormFields);

    // Reset percent type state.
    setPercentType(false);

    // Reset free shipping state.
    setIsFreeShipping(false);
  };

  const onSubmit = async () => {
    // Validate currency Change

    const isCategory= selectedCategory?.filter_id
    if (
      !isCategory ||
      !formFields.discount_value ||
      !formFields.discount_start_date ||
      !formFields.discount_expiry_date ||
      !formFields.discount_type 
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the required fields",
      });
    }

    const formData = new FormData();
    
    if (selectedCategory?.filter_id) {
      
      formData.append("category_id", selectedCategory?.filter_id);
    }

    if (formFields.num_products) {
      
      formData.append("num_products", formFields.num_products);
    }
    formData.append("discount_value", formFields.discount_value);
    formData.append("discount_type", formFields.discount_type);
    formData.append("discount_start_date", formatDate(formFields.discount_start_date));
    formData.append("discount_expiry_date", formatDate(formFields.discount_expiry_date));

    console.log(formData);
    
    mutate({
      url: APPLY_RANDOM_DISCOUNT_URL,
      
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Dialog
      open={isApplyRandomDiscountDialogOpen}
      onOpenChange={setIsApplyRandomDiscountDialogOpen}
    >
      <DialogContent className=" w-[90%] sm:max-w-[700px]">
        <ScrollArea className=" h-fit max-w-[99%] pr-4 w-full ">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>
              {t("Random Discount")}
            </DialogTitle>
            <DialogDescription>
              {t("Apply Random Discount. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >


              <div className="flex flex-col justify-start items-start gap-2 w-full ">

                <div className="flex flex-col justify-start items-start gap-2 w-full leading-none font-medium text-sm">
                  <p className="px-1 w-full"><span className="text-red-500 text-xl">*</span>{t("Category")}</p>
                  <CategoryAutocomplete
                    formFields={selectedCategory}
                    setFormFields={setSelectedCategory}
                    categoryId={selectedCategory.filter_id}
                    isFetchCategory={false}
                  />
                 
                </div>
               
              </div>


               <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1 pb-2">
                    <FormLabel> <span className="text-red-500 text-xl">*</span> {t("Discount Type")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            discount_type: value,
                          });
                        }}
                        autoComplete="discount_type"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="amount" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                          {t("Amount")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="percentage" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                          {t("Percentage")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
 
              <div className="flex justify-between items-start space-x-4 w-full px-1">

                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel><span className="text-red-500 text-xl">*</span> {t("Discount")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            min={0}
                            max={2147483647}
                            type="number"
                            step={0.0001}
                            placeholder={t("Discount value")}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                discount_value: e.target.value,
                              });
                            }}
                            autoComplete="discount_value"
                          />
                          {formFields.discount_type === 'percentage' && (
                            <span className="absolute top-[.6rem] right-3 p-1 bg-white">
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
                      <FormField
                  control={form.control}
                  name="num_products"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel> {t("Number of products")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            min={0}
                            max={2147483647}
                            type="number"
       
                            placeholder={t("Number of products")}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                num_products: e.target.value,
                              });
                            }}
                            autoComplete="num_products"
                          />
                          
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-start space-x-4 w-full px-1 ">
                <FormField
                  control={form.control}
                  name="discount_start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="py-1"><span className="text-red-500 text-xl">*</span> {t("Start Date")} </FormLabel>
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
                                formatFullDateNoTime(field.value)
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
                                discount_start_date: value,
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
                  name="discount_expiry_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full ">
                      <FormLabel className="py-1"><span className="text-red-500 text-xl">*</span> {t("End Date")}</FormLabel>
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
                                formatFullDateNoTime(field.value)
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
                                discount_expiry_date: value,
                              });
                            }}
                            disabled={(date) =>
                              date < new Date(formFields.discount_expiry_date)
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
  );
}
