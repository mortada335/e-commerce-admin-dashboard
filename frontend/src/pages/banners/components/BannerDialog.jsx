import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2, X } from "lucide-react";
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

import {
  BANNER_URL,
  PRODUCTS_URL,
  WAREHOUSES_URL,
} from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import { bannerSchema } from "@/utils/validation/banner";
import { setIsBannerDialogOpen, useBannerStore } from "../store";
import ProductAutocomplete from "@/components/ProductAutocomplete";
import FileInput from "@/components/ui/custom-file-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDateToISO, formatFullDate } from "@/utils/methods";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import { Calendar } from "@/components/ui/calendar";
import Can from "@/components/Can";
import TimePicker from "@/components/ui/time-picker";
import { addHours, isBefore } from "date-fns";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { useTranslation } from "react-i18next";

const currentDate = new Date();

const default_expiry_date = new Date(
  currentDate.setFullYear(currentDate.getFullYear() + 100)
);
const defaultFormFields = {
  title: "",
  image: null,
  banner_type: "product",
  filter_id: "",
  sort_order: 0,
  event_date: new Date(),
  event_date_end: default_expiry_date,
  language_id: "english",
};

export default function BannerDialog() {
  const { isBannerDialogOpen, selectedBanner } = useBannerStore();
  const { toast } = useToast();
  const {t} = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [products, setProducts] = useState([]);
  const [warehouse, setWarehouse] = useState([]);

  // Date status state.
  const [dateStatus, setDateStatus] = useState({
    isSubmit: false,
    isValid: false,
  });

  const form = useForm({
    resolver: yupResolver(bannerSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Banners");

  // Effect for tracking validity of dates.
  useEffect(() => {
    const startDate = new Date(formFields.event_date);
    const endDate = new Date(formFields.event_date_end);

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
  }, [formFields.event_date, formFields.event_date_end]);

  useEffect(() => {
    if (
      formFields.title &&
      formFields.image &&
      formFields.sort_order >= 0 &&
      (formFields.banner_type === "products"
        ? !!products?.length
        : !!formFields.filter_id)
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields, products]);

  useEffect(() => {
    if (
      selectedBanner !== null &&
      selectedBanner !== undefined &&
      isBannerDialogOpen
    ) {
      setFormFields({
        title: selectedBanner.title || "",
        image: selectedBanner.image || null,

        sort_order: selectedBanner.sort_order || 0,
        language_id:
          selectedBanner.language_id === 1 ? "english" : "arabic" || "english",

        banner_type: selectedBanner.banner_type || "product",
        filter_id: selectedBanner.banner_type_id || "",
        event_date: selectedBanner.event_date
          ? new Date(selectedBanner.event_date)
          : new Date(),
        event_date_end: selectedBanner.event_date_end
          ? new Date(selectedBanner.event_date_end)
          : new Date(),
      });
      form.setValue("title", selectedBanner.title || "");
      form.setValue("image", selectedBanner.image || null);

      form.setValue("sort_order", selectedBanner.sort_order || 0);
      form.setValue(
        "language_id",
        selectedBanner.language_id === 1 ? "english" : "arabic" || "english"
      );

      form.setValue("banner_type", selectedBanner.banner_type || "product");
      form.setValue("filter_id", selectedBanner.banner_type_id || "");
      form.setValue(
        "event_date",
        selectedBanner.event_date
          ? new Date(selectedBanner.event_date)
          : new Date()
      );
      form.setValue(
        "event_date_end",
        selectedBanner.event_date_end
          ? new Date(selectedBanner.event_date_end)
          : new Date()
      );
      setProducts(selectedBanner?.products_detail || []);
    } else {
      // this is server error or other error that could happen
      setFormFields(defaultFormFields);
      setProducts([]);
      form.reset();
    }
  }, [selectedBanner, isBannerDialogOpen, form]);

  const onClose = () => {
    setIsBannerDialogOpen(false);
    form.reset();
    setProducts([]);
    setFormFields(defaultFormFields);
    form.setValue("language_id", "english");
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

    if (!formFields.title || !formFields.image) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    // const formData = new FormData(); // Create a new FormData object

    const payload = {
      banner_type: formFields.banner_type,
      sort_order: formFields.sort_order,
      title: formFields.title,

      products: [],

      banner_type_id: null,
      image: null,
      event_date: formatDateToISO(formFields.event_date),
      event_date_end: formatDateToISO(formFields.event_date_end),
      language_id: formFields.language_id === "arabic" ? 2 : 1 || 1,
    };

    // formData.append("banner_type", formFields.banner_type);
    if (formFields.banner_type === "products") {
      payload.products = products?.map((product) => product?.product_id) || [];
    } else {
      payload.banner_type_id = formFields.filter_id;
    }
    // formData.append("sort_order", formFields.sort_order);
    // formData.append("event_date", formatDateToISO(formFields.event_date));
    // formData.append(
    //   "event_date_end",
    //   formatDateToISO(formFields.event_date_end)
    // );
    // formData.append("title", formFields.title);
    // formData.append(
    //   "language_id",
    //   formFields.language_id === "arabic" ? 2 : 1 || 1
    // );

    if (formFields.image instanceof File) {
      payload.image = formFields.image;
    }
    // if (formFields.image instanceof File) {
    //   formData.append("image", formFields.image);
    // }

    mutate({
      url: BANNER_URL,
      id: selectedBanner?.banner_image_id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData: payload,
    });
  };

  return (
    <Can permissions={["app_api.view_ocbannerimage"]}>
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">
          <ScrollArea className=" h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-fit pr-4 w-full ">
            <DialogHeader className={"rtl:items-end"}>
              <DialogTitle>
                {selectedBanner?.banner_image_id ? t("Edit") : t("Create")} {t("Banner")}
              </DialogTitle>
              <DialogDescription>
                {selectedBanner?.banner_image_id
                  ? t("Make changes to your")
                  : t("Create")}{" "}
                {t("Banner here. Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <Form {...form} className="h-full bg-black">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 mt-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>
                        {t("Title")}
                        <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Banner title")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                              setFormFields({
                                ...formFields,
                                title: e.target.value,
                              });
                            }}
                            autoComplete="title"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* image */}

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {t("Image")}
                        <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <FileInput
                          field={field}
                          setFormFields={setFormFields}
                          formFields={formFields}
                        />
                      </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {t("Order")}
                        <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("this refer to the banner order in banners page, 5 means the 5th banner")}
                          value={field.value}
                          min={0}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              sort_order: e.target.value,
                            });
                          }}
                          autoComplete="sort_order"
                        />
                      </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>{t("Event Start Date")}</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex flex-col justify-start items-start space-y-2 w-full">
                              <Card
                                className={cn(
                                  "flex justify-between items-center space-y-0 space-x-0 w-full",
                                  formFields.event_date ? "pr-0" : "!pr-4"
                                )}
                              >
                                <Button
                                  type="button"
                                  variant={"ghost"}
                                  className={cn(
                                    " w-fit text-left font-normal rounded-none flex justify-start items-center cursor-pointer",
                                    !formFields.event_date &&
                                      "text-muted-foreground w-[180px]"
                                  )}
                                >
                                  {formFields.event_date &&
                                  formFields.event_date !== null ? (
                                    formatFullDate(formFields?.event_date)
                                  ) : (
                                    <>{t("Pick Start Date")}</>
                                  )}
                                </Button>
                                {formFields.event_date ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {" "}
                                        <Button
                                          variant={"ghost"}
                                          size="icon"
                                          className="rounded-none"
                                          onClick={() => {
                                            field.onChange("");
                                            setFormFields({
                                              ...formFields,
                                              event_date: "",
                                            });
                                          }}
                                        >
                                          <X size={18} className="opacity-50" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <Text text={t("Clear")} />
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <CalendarIcon
                                    size={18}
                                    className="opacity-50 cursor-pointer"
                                  />
                                )}
                              </Card>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formFields.event_date}
                              onSelect={(value) => {
                                setFormFields({
                                  ...formFields,
                                  event_date: value,
                                });
                                field.onChange(value);
                              }}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                            <TimePicker
                              selectedTime={formFields.event_date}
                              onSelectTime={(value) => {
                                setFormFields({
                                  ...formFields,
                                  event_date: value,
                                });
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="event_date_end"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel
                        className={cn(
                          !dateStatus.isValid &&
                            dateStatus.isSubmit &&
                            "text-[#ef4444]"
                        )}
                      >
                        {t("Event End Date")}
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex flex-col justify-start items-start space-y-2 w-full">
                              <Card
                                className={cn(
                                  "flex justify-between items-center space-y-0 space-x-0 w-full",
                                  formFields.event_date_end ? "pr-0" : "!pr-4"
                                )}
                              >
                                <Button
                                  type="button"
                                  variant={"ghost"}
                                  className={cn(
                                    " w-fit text-left font-normal rounded-none flex justify-start items-center ",
                                    !formFields.event_date_end &&
                                      "text-muted-foreground w-[180px]"
                                  )}
                                >
                                  {" "}
                                  {formFields.event_date_end &&
                                  formFields.event_date_end !== null ? (
                                    formatFullDate(
                                      formFields?.event_date_end || ""
                                    )
                                  ) : (
                                    <>{t("Pick End Date")}</>
                                  )}
                                </Button>
                                {formFields.event_date_end ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {" "}
                                        <Button
                                          variant={"ghost"}
                                          size="icon"
                                          className="rounded-none"
                                          onClick={() => {
                                            field.onChange("");
                                            setFormFields({
                                              ...formFields,
                                              event_date_end: "",
                                            });
                                          }}
                                        >
                                          <X size={18} className="opacity-50" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <Text text={t("Clear")} />
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <CalendarIcon
                                    size={18}
                                    className="  h-4 w-4 opacity-50"
                                  />
                                )}
                              </Card>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formFields.event_date_end}
                              onSelect={(date) => {
                                field.onChange(date);
                                setFormFields({
                                  ...formFields,
                                  event_date_end: date,
                                });
                              }}
                              disabled={(date) => {
                                const startDate = new Date(
                                  formFields.event_date
                                );
                                startDate.setDate(startDate.getDate() - 1);

                                  return date <= startDate;
                                }}
                                initialFocus
                              />

                              <TimePicker
                                selectedTime={formFields.event_date_end}
                                onSelectTime={(time) => {
                                  setFormFields({
                                    ...formFields,
                                    event_date_end: time,
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>

                      {!dateStatus.isValid && dateStatus.isSubmit && (
                        <p className="text-[#ef4444] text-sm font-medium">
                          {t("End date must be at least one hour after the start date.")}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banner_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3 px-1">
                      <FormLabel>
                        {t("Filter by")}
                        <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);

                            setFormFields({
                              ...formFields,
                              banner_type: value,
                              filter_id: null,
                              filter_name: null,
                            });
                          }}
                          autoComplete="banner_type"
                          defaultValue={field.value}
                          className="flex rtl:flex-row-reverse space-x-1"
                        >
                   
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="product" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("Product")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="category" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("Category")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="products" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("Products")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                { formFields.banner_type === "category" ? (
                  <FormItem className="w-full px-1 ">
                    <FormLabel>
                      {t("Category")}
                      <span className="text-red-500 text-xl">*</span>
                    </FormLabel>
                    <CategoryAutocomplete
                      formFields={formFields}
                      setFormFields={setFormFields}
                      categoryId={selectedBanner?.banner_type_id}
                      isFetchCategory={
                        selectedBanner?.banner_type_id >= 0 ? true : false
                      }
                    />
                  </FormItem>
                ) : 
                 formFields.banner_type === "products" ? (
                                                           <FormItem className="w-full px-1 ">
                                
                                              <FormLabel>{t("Products")}</FormLabel>
                                      <span className="text-red-500 text-xl">*</span>
                                
                                    
                                                             <CustomsMultiCombobox
                                                                          
                                                                       
                                                                            endpoint={PRODUCTS_URL}
                                                                            itemKey={"product_id"}
                                                                            setItems={setProducts}
                                                                            items={products}
                                                                    
                                                                            itemTitle="model"
                                                                            searchQueryKey="model"
                                                                            sortBy="-date_added"
                                                                            queryKey="products"
                                                                            className="border rounded-md px-1"
                                                                            placeholder={t("Select Products")}
                                                                          />
                                                           
                                              </FormItem>
                ) : 
                (
                  <FormItem className="w-full px-1 ">
                    <FormLabel>
                      {t("Product")}
                      <span className="text-red-500 text-xl">*</span>
                    </FormLabel>
                    <ProductAutocomplete
                      formFields={formFields}
                      setFormFields={setFormFields}
                      productId={selectedBanner?.banner_type_id}
                      isFetchProduct={
                        selectedBanner?.banner_type_id >= 0 ? true : false
                      }
                    />
                  </FormItem>
                )}

                <FormField
                  control={form.control}
                  name="language_id"
                  render={({ field }) => (
                    <FormItem className="space-y-3 px-1">
                      <FormLabel>{t("Language")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);

                            setFormFields({
                              ...formFields,
                              language_id: value,
                            });
                          }}
                          autoComplete="language_id"
                          defaultValue={field.value}
                          className="flex space-x-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="english" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("English")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="arabic" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("Arabic")}
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
    </Can>
  );
}
