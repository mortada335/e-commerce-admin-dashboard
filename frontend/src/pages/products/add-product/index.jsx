import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
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

import { PRODUCTS_URL, PRODUCT_ATTRIBUTES_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScrollArea } from "@/components/ui/scroll-area";

import { productSchema } from "@/utils/validation/product";
import { setIsProductDialogOpen, useProductStore } from "../store";

import { cn } from "@/lib/utils";

import ProductStatusAutoComplete from "@/pages/sections/components/ProductStatusAutoComplete";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  customFormatDate,
  formatDateToISO,
  isNumber,
  isValidDate,
} from "@/utils/methods";

import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import HeaderText from "@/components/layout/header-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Section from "@/components/layout/Section";
import FilesDropzone from "@/components/ui/FilesDropzone";

import { axiosPrivate } from "@/api/axios";
import AttributesList from "../components/AttributesList";
import Text from "@/components/layout/text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import CanSection from "@/components/CanSection";
import CustomDatePicker from "@/components/ui/custom-date-picker";
import { useTranslation } from "react-i18next";


const currentDate=new Date()

const default_discount_expiry_date = new Date(
  currentDate.setFullYear(currentDate.getFullYear() + 100)
);

const defaultFormFields = {
  product_info: {
    nameEnglish: "",
    nameArabic: "",
    arabicDescription: "",
    englishDescription: "",

    model: "",
  },
  media: [],

  pricing_quantity: {
    price: 0,
    discount_price: 0,
    available_quantity: 0,
    discount_start_date: customFormatDate(new Date()),
    discount_expiry_date: customFormatDate(default_discount_expiry_date),
    points: "",
  },
  dimensions: {
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
  },

  other: {
    categories: [],
    mainCategories: [],
    subCategories: [],
    status: "",
    attributes: [],
  },
};

export default function ProductDialog() {
  const { isProductDialogOpen, selectedProduct } = useProductStore();
  const navigate = useNavigate();
  const {t} = useTranslation()
  const { toast } = useToast();
  const form = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      ...defaultFormFields.product_info,
      ...defaultFormFields.media,
      ...defaultFormFields.pricing_quantity,
      ...defaultFormFields.dimensions,
      ...defaultFormFields.other,
    },
  });
  const [currentStep, setCurrentStep] = useState("product_info");
  const [isProductInfo, setIsProductInfo] = useState(false);
  const [isPostAttributes, setIsPostAttributes] = useState(false);
  const [isValidAttributes, setIsValidAttributes] = useState(false);
  const [isPostImages, setIsPostImages] = useState(false);
  const [newProductInfo, setNewProductInfo] = useState({ data: {} });

  const [isPricingQuantity, setIsPricingQuantity] = useState(false);
  const [isDimensions, setIsDimensions] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Products");

  const [categoryFormFields, setCategoryFormFields] = useState([]);

  const [statusFormFields, setStatusFormFields] = useState({
    filter_id: 4,
    filter_name: "NONE",
  });

  // Product status - [enabled or disabled] state.
  const [enabledFormField, setEnabledFormField] = useState("enabled");
  const [isNewProductFormField, setIsNewProductFormField] = useState(true);

  const [productInfoFields, setProductInfoFields] = useState(
    defaultFormFields.product_info
  );
  const [mediaFields, setMediaFields] = useState(defaultFormFields.media);
  const [pricingQuantityFields, setPricingQuantityFields] = useState(
    defaultFormFields.pricing_quantity
  );
  const [dimensionsFields, setDimensionsFields] = useState(
    defaultFormFields.dimensions
  );

  useEffect(() => {
    if (
      productInfoFields.nameEnglish &&
      productInfoFields.model &&
      productInfoFields.englishDescription &&
      productInfoFields.arabicDescription &&
      productInfoFields.nameArabic
    ) {
      setIsProductInfo(true);
    } else {
      setIsProductInfo(false);
    }
  }, [productInfoFields]);
  useEffect(() => {
    if (
      pricingQuantityFields.available_quantity >= 0 &&
      isNumber(pricingQuantityFields.available_quantity) &&
      isNumber(pricingQuantityFields.price) &&
      isValidDate(pricingQuantityFields.discount_start_date) &&
      isValidDate(pricingQuantityFields.discount_expiry_date) &&
      pricingQuantityFields.price >= 1
    ) {
      setIsPricingQuantity(true);
    } else {
      setIsPricingQuantity(false);
    }
  }, [pricingQuantityFields]);
  useEffect(() => {
    if (
      dimensionsFields.weight >= 0 &&
      dimensionsFields.height >= 0 &&
      dimensionsFields.width >= 0 &&
      dimensionsFields.length >= 0
    ) {
      setIsDimensions(true);
    } else {
      setIsDimensions(false);
    }
  }, [dimensionsFields]);
  useEffect(() => {
    if (
      pricingQuantityFields.discount_expiry_date &&
      pricingQuantityFields.discount_start_date &&
      pricingQuantityFields.discount_price
    ) {
      setStatusFormFields({
        filter_id: 3,
        filter_name: "DISCOUNT",
      });
    } else {
      setStatusFormFields({
        filter_id: 4,
        filter_name: "NONE",
      });
    }
  }, [pricingQuantityFields]);
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    Object.entries(form.formState.errors).forEach(([key, value]) => {
      if (value.message) {
        return toast({
          variant: "destructive",
          title: "Failed!!!",
          description: value.message,
        });
      } else {
        return;
      }
    });
  }, [form.formState.errors]);

  const onClose = () => {
    // form.reset()
    setCurrentStep("attributes");
    setProductInfoFields(defaultFormFields.product_info);
    setPricingQuantityFields(defaultFormFields.pricing_quantity);
    setMediaFields([]);
    // setDimensionsFields(defaultFormFields.dimensions)
  };

  const onSubmit = async () => {
    // Validate currency Change

    if (
      !pricingQuantityFields.price ||
      !productInfoFields.nameArabic ||
      !productInfoFields.nameEnglish ||
      !productInfoFields.arabicDescription ||
      !productInfoFields.englishDescription ||
      !productInfoFields.model
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const description = [
      {
        name: productInfoFields.nameEnglish,
        description: productInfoFields.englishDescription,
        language_id: 1,
      },
      {
        name: productInfoFields.nameArabic,
        description: productInfoFields.arabicDescription,
        language_id: 2,
      },
    ];

    const formData = new FormData();
    formData.append("model", productInfoFields.model);
    formData.append(
      "available_quantity",
      Number(pricingQuantityFields.available_quantity)
    );
    // if (categoryFormFields.filter_id)

    formData.append("description", JSON.stringify(description));
    formData.append("price", Number(pricingQuantityFields.price));
    formData.append("weight", Number(dimensionsFields.weight));
    formData.append("length", Number(dimensionsFields.length));
    formData.append("width", Number(dimensionsFields.width));
    formData.append("height", Number(dimensionsFields.height));
    formData.append(
      "status",
      statusFormFields.filter_id ? statusFormFields.filter_id : 0
    );
    formData.append("enabled", enabledFormField === "enabled" ? true : false);
    // console.log(isNewProductFormField);
    formData.append("new_product", isNewProductFormField);

    formData.append(
      "sort_id",
      JSON.stringify(mediaFields.map((image) => image.sort_order))
    );

    // Loop through mediaFields and append files to FormData
    mediaFields.forEach((item, index) => {
      if (item.file) {
        formData.append(`images[${index}]`, item.file);
      }
    });
    formData.append(
      "categories",
      JSON.stringify(categoryFormFields?.map((item) => item?.category_id))
    );
    formData.append(
      "attributes",
      JSON.stringify(
        attributesFormFields.map((attribute) => ({
          text: attribute.text,

          attribute_id: attribute.attributeId,
          language_id: 1,
        }))
      )
    );
    // formData.append("categories", data.categories);

    if (isNumber(pricingQuantityFields?.discount_price))
      formData.append(
        "discounted_price",
        Number(pricingQuantityFields.discount_price)
      );
    if (pricingQuantityFields.discount_start_date) {
      formData.append(
        "discount_start_date",
        formatDateToISO(pricingQuantityFields.discount_start_date || "")
      );
    }
    if (pricingQuantityFields.discount_expiry_date) {
      formData.append(
        "discount_expiry_date",
        formatDateToISO(pricingQuantityFields.discount_expiry_date || "")
      );
    }
    formData.append("points", Number(pricingQuantityFields.points));

    mutate({
      url: PRODUCTS_URL,

      headers: {
        "Content-Type": "multipart/form-data",
      },
      isAddProduct: true,
      setRes: (res) => {
        setNewProductInfo(res);
      },
      onFinish: onClose,
      formData,
    });
  };

  //attributes

  const [attributesFormFields, setAttributesFormFields] = useState([
    {
      productId: "",
      attributeId: "",
      attributeName: "",
      englishText: "",
      arabicText: "",
    },
  ]);

  useEffect(() => {
    attributesFormFields.every;
    const validAttributes = attributesFormFields.every(
      (attribute) =>
        attribute.arabicText && attribute.englishText && attribute.attributeId
    );

    if (validAttributes) {
      setIsValidAttributes(true);
    } else {
      setIsValidAttributes(false);
    }
  }, [attributesFormFields]);

  const onSaveAttributes = async () => {
    const validAttributes = attributesFormFields.filter(
      (attribute) =>
        attribute.englishText && attribute.arabicText && attribute.attributeId
    );

    if (!validAttributes.length) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    // const formData = attributesFormFields.map((attribute) => ({
    //   text: attribute.text,
    //   product_id: newProductInfo?.data?.product_id,
    //   attribute_id: attribute.attributeId,
    //   language_id: 1,
    // }));
    const formData = validAttributes.flatMap((attribute) => [
      {
        text: attribute.englishText,
        product_id: newProductInfo?.data?.product_id,
        attribute_id: attribute.attributeId,
        language_id: 1,
      },
      {
        text: attribute.arabicText,
        product_id: newProductInfo?.data?.product_id,
        attribute_id: attribute.attributeId,
        language_id: 2,
      },
    ]);

    try {
      setIsPostAttributes(true);

      const response = await axiosPrivate.post(
        `${PRODUCT_ATTRIBUTES_URL}`,

        formData,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Success",
          description: "Added successfully",
        });
        setAttributesFormFields([
          [
            {
              productId: "",
              attributeId: "",
              attributeName: "",
              englishText: "",
              arabicText: "",
            },
          ],
        ]);
      }
    } catch (error) {
      // Handle the error

      setIsPostAttributes(false);
      if (error?.response?.status && error?.response?.status !== 500) {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: error.response?.data?.error,
        });
      } else if (error.code === "ERR_NETWORK") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Network error, please try again",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "An unknown error occurred. Please try again later",
        });
      }
      return error;
    } finally {
      setIsPostAttributes(false);
    }
  };

  //images

  const removeFile = (sort_order) => {
    setMediaFields((files) =>
      files.filter((file) => file.sort_order !== sort_order)
    );
  };

  const handleChangeImageOrder = (e, index) => {
    const { value } = e.target;
    setMediaFields((prevMediaFields) => {
      const updatedFields = prevMediaFields.map((field, i) => {
        if (i === index) {
          return {
            ...field,
            sort_order: value,
          };
        }
        return field;
      });
      return updatedFields;
    });
  };

  const onDiscountExpiryDate = (value) => {
    setPricingQuantityFields({
      ...pricingQuantityFields,
      discount_expiry_date: value || "",
    });
  };

  const onDiscountStartDate = (value) => {
    setPricingQuantityFields({
      ...pricingQuantityFields,
      discount_start_date: value || "",
    });
  };

  return (
    <CanSection permissions={[ "app_api.add_ocproduct"]}>

    <Section className="space-y-6 h-fit items-start">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">{t("Home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/catalog/products">{t("Products")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("Add Product")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className=" h-fit pr-4 w-full flex flex-col justify-start items-start pb-6">
        <CardHeader>
          <CardTitle>{t("Create Product")}</CardTitle>
          <CardDescription>
            {t("Create Product here. Click save when you are done.")}
          </CardDescription>
        </CardHeader>

        <Form {...form} className="h-full  w-full">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 pt-4 flex flex-col justify-between h-full items-center w-full px-4"
          >
            <Tabs
              value={currentStep}
              onValueChange={setCurrentStep}
              defaultValue="product_info"
              className="w-full h-full "
            >
              <TabsList className="w-full h-fit grid-cols-2 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 ">
                <TabsTrigger
                  disabled={newProductInfo?.data?.product_id}
                  className="w-full"
                  value="product_info"
                >
                  {t("Product Info")}
                </TabsTrigger>

                <TabsTrigger
                  disabled={newProductInfo?.data?.product_id}
                  className="w-full"
                  value="pricing_quantity"
                >
                  {t("Pricing Quantity")}
                </TabsTrigger>

                <TabsTrigger
                  disabled={newProductInfo?.data?.product_id}
                  className="w-full"
                  value="media"
                >
                  {t("Media")}
                </TabsTrigger>
                <TabsTrigger
                  disabled={newProductInfo?.data?.product_id}
                  className="w-full"
                  value="other"
                >
                  {t("Other")}
                </TabsTrigger>
                <TabsTrigger className="w-full" value="attributes">
                  {t("Attributes")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="product_info">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-2">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Product Model")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Product Model")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                              setProductInfoFields({
                                ...productInfoFields,
                                model: e.target.value,
                              });
                            }}
                            autoComplete="model"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="nameArabic"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-2">
                      <FormLabel className="capitalize">
                        <span className="text-red-500 text-xl">*</span> {t("Name in Arabic")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Product Name In Arabic")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setProductInfoFields({
                              ...productInfoFields,
                              nameArabic: e.target.value,
                            });
                          }}
                          autoComplete="nameArabic"
                        />
                      </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="arabicDescription"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-2">
                      <FormLabel className="capitalize">
                        <span className="text-red-500 text-xl">*</span> {t("Arabic Description")} 
                        ({productInfoFields.arabicDescription?.length})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("Product Arabic Description")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                              setProductInfoFields({
                                ...productInfoFields,
                                arabicDescription: e.target.value,
                              });
                            }}
                            autoComplete="arabicDescription"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="nameEnglish"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">
                        <span className="text-red-500 text-xl">*</span> {t("Name in English")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Product Name in English")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                              setProductInfoFields({
                                ...productInfoFields,
                                nameEnglish: e.target.value,
                              });
                            }}
                            autoComplete="nameEnglish"
                          />
                        </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="englishDescription"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-2">
                      <FormLabel className="capitalize">
                        <span className="text-red-500 text-xl">*</span> {t("English Description")} 
                        ({productInfoFields.englishDescription?.length})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("Product English Description")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                              setProductInfoFields({
                                ...productInfoFields,
                                englishDescription: e.target.value,
                              });
                            }}
                            autoComplete="englishDescription"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className="flex justify-end items-center w-full py-4 space-x-4">
                  <Button
                    disabled={!isProductInfo}
                    type="button"
                    onClick={() => {
                      setCurrentStep("pricing_quantity");
                    }}
                  >
                    <span>{t("Next")}</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent className="min-h-fit h-[380px] max-h-fit" value="pricing_quantity">
                <div className="flex justify-between items-start space-x-4 w-full px-1 pt-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>{t("Price")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("Product Price")}
                            value={field.value}
                            className={!isNumber(pricingQuantityFields?.price)&&'!ring-red-500'}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setPricingQuantityFields({
                                ...pricingQuantityFields,
                                price: e.target.value,
                              });
                            }}
                            autoComplete="price"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="available_quantity"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>
                          {t("Quantity")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("Available Quantity")}
                            className={!isNumber(pricingQuantityFields?.available_quantity)&&'!ring-red-500'}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setPricingQuantityFields({
                                ...pricingQuantityFields,
                                available_quantity: e.target.value,
                              });
                            }}
                            autoComplete="quantity"
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
                    name="discount_price"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>{t("Discount Price")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("Discount Price")}
                            className={!isNumber(pricingQuantityFields?.discount_price)&&'!ring-red-500'}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setPricingQuantityFields({
                                ...pricingQuantityFields,
                                discount_price: e.target.value,
                              });
                            }}
                            autoComplete="discount_price"
                          />
                        </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem className="w-full ">
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Points"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                setPricingQuantityFields({
                                  ...pricingQuantityFields,
                                  points: e.target.value,
                                })
                              }}
                              autoComplete="points"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                </div>
                <div className="flex justify-between items-start space-x-4 w-full px-1 pt-4">
                  <FormField
                    control={form.control}
                    name="discount_start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel className="py-1">
                          {t("Discount Start Date")}
                        </FormLabel>
                        {/* <Popover>
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
                                  <span>Pick a date</span>
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
                                setPricingQuantityFields({
                                  ...pricingQuantityFields,
                                  discount_start_date: value,
                                });
                              }}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover> */}
                        <CustomDatePicker value={pricingQuantityFields.discount_start_date} onChange={onDiscountStartDate} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount_expiry_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full ">
                        <FormLabel className="py-1">
                          {t("Discount Expiry Date")}
                        </FormLabel>
                        {/* <Popover>
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
                                  <span>Pick a date</span>
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
                                setPricingQuantityFields({
                                  ...pricingQuantityFields,
                                  discount_expiry_date: value,
                                });
                              }}
                              disabled={(date) =>
                                date <
                                new Date(
                                  pricingQuantityFields.discount_start_date
                                )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover> */}
                          <CustomDatePicker
                            value={pricingQuantityFields.discount_expiry_date}
                            onChange={onDiscountExpiryDate}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-start space-x-4 w-full px-1 pt-4"></div>

                <div className="flex justify-end items-center w-full py-2 space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setCurrentStep("product_info");
                    }}
                  >
                    {t("Back")}
                  </Button>
                  <Button
                    disabled={!isPricingQuantity}
                    type="button"
                    onClick={() => {
                      setCurrentStep("media");
                    }}
                  >
                    <span>{t("Next")}</span>
                  </Button>
                </div>
              </TabsContent>
              {/* image */}
              <TabsContent value="media">
                <Card className="w-full flex flex-col justify-between items-end pt-10 px-8 gap-4">
                  <FilesDropzone
                    className={"w-full"}
                    currentFiles={newProductInfo?.data?.images || []}
                    files={mediaFields}
                    setFiles={setMediaFields}
                  />
                  {!!mediaFields.length && (
                    <div className=" border rounded-md h-fit px-4 w-full flex flex-col justify-start items-center space-y-4 pb-6">
                      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-full w-full py-2 px-2  gap-4">
                        {mediaFields
                          ?.sort((a, b) => a.sort_order > b.sort_order)
                          .map((file, index) => (
                            <li
                              key={index}
                              className="relative flex flex-col justify-center items-center  w-full h-fit rounded-md  border px-2 py-2 space-y-2"
                            >
                              <img
                                src={file.image}
                                alt={file.name}
                                onLoad={() => {
                                  URL.revokeObjectURL(file.preview);
                                }}
                                className="h-20 w-full rounded-sm  object-cover  "
                              />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Text
                                        className={"truncate w-[99%]"}
                                        text={file?.file?.name}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <Text
                                      className={"w-full"}
                                      text={file?.file?.name}
                                    />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="   flex justify-center items-center  w-5 h-5 rounded-full text-xs absolute top-0 right-1"
                                  onClick={() => removeFile(file.sort_order)}
                                >
                                  {/* Remove File */}
                                  <X size={16} />
                                </Button>
                                <Input
                                  className="h-8"
                                  placeholder="Index"
                                  value={mediaFields?.at(index).sort_order}
                                  onChange={(e) =>
                                    handleChangeImageOrder(e, index)
                                  }
                                />
                              </li>
                            ))}
                        </div>
                      </div>
                    )}

                  <CardFooter className="gap-4 px-0">
                    <Button
                      disabled={newProductInfo?.data?.product_id}
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setCurrentStep("pricing_quantity");
                      }}
                    >
                      {t("Back")}
                    </Button>
                    <Button
                      disabled={!mediaFields.length}
                      onClick={() => {
                        setCurrentStep("other");
                      }}
                      type="button"
                    >
                      {t("Next")} 
                    </Button>
                  </CardFooter>
                </Card>

                {/* <ImagesTab setCurrentStep={setCurrentStep} product={newProductInfo} /> */}
              </TabsContent>
              <TabsContent value="other">
                <FormItem className="w-full px-1 ">
                  <FormLabel>{t("Category")}</FormLabel>
                  <CategoryMultiSelect
                    selectedCategories={categoryFormFields}
                    setSelectedCategories={setCategoryFormFields}
                  />
                </FormItem>



                <FormItem className="w-full px-1 mt-2">
                  <FormLabel>{t("Label")}</FormLabel>
                  <ProductStatusAutoComplete
                    formFields={statusFormFields}
                    setFormFields={setStatusFormFields}
                  />
                </FormItem>
       
                    

                <FormItem className="w-full px-1 mt-2">
                  <FormLabel>{t("Status")}</FormLabel>
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
                </FormItem>
                <FormItem className="flex items-center rtl:flex-row-reverse justify-start gap-12 w-full py-4 px-2">
                      <div className="space-y-0.5">
                        <FormLabel>{t("New Product?")}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                        
                         
                          checked={isNewProductFormField}
                          onCheckedChange={(value) => {
                    

                            setIsNewProductFormField(value);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                

                <div className="flex justify-end items-center w-full py-2 space-x-4 mt-12">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setCurrentStep("media");
                    }}
                  >
                    {t("Back")}
                  </Button>
                  <Button
                    disabled={
                      !isProductInfo ||
                      !isPricingQuantity ||
                      isAction ||
                      !mediaFields.length
                    }
                    type="submit"
                  >
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
              </TabsContent>

              {/* Attributes */}
              <TabsContent className="h-full " value="attributes">
                <Card className="flex flex-col justify-start items-start w-full h-fit rounded-sm">
                  <CardHeader className="flex flex-row items-center rtl:flex-row-reverse w-full justify-between py-4">
                    <CardTitle>{t("Add Attributes")}</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <AttributesList
                      setAttributes={setAttributesFormFields}
                      attributes={
                        attributesFormFields?.length ? attributesFormFields : []
                      }
                    />
                  </CardContent>

                  <div className="flex justify-end items-center w-full py-4 px-4 gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setCurrentStep("media");
                      }}
                    >
                      {t("Back")}
                    </Button>
                    {attributesFormFields.length && isValidAttributes ? (
                      <Button
                        disabled={
                          !attributesFormFields.length ||
                          isPostAttributes ||
                          !newProductInfo?.data?.product_id ||
                          !isValidAttributes
                        }
                        onClick={onSaveAttributes}
                        type="button"
                      >
                        {isPostAttributes ? (
                          <p className="flex justify-center items-center space-x-2">
                            <Loader2 className=" h-5 w-5 animate-spin" />
                            <span>{t("Please wait")}</span>
                          </p>
                        ) : (
                          <span>{t("Save Attributes")}</span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={!newProductInfo?.data?.product_id}
                        onClick={() => {
                          if (newProductInfo?.data?.product_id) {
                            navigate(
                              `/catalog/products/details/${newProductInfo?.data?.product_id}`
                            );
                          } else {
                            navigate(`/catalog/products`);
                          }
                        }}
                      >
                        {t("Skip")}
                      </Button>
                    )}
                  </div>
                </Card>

                  {/* <AttributesTab setCurrentStep={setCurrentStep} product={newProductInfo} /> */}
                </TabsContent>
              </Tabs>

              {/* <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>Please wait</span>
                    </p>
                  ) : (
                    <span>Save</span>
                  )}
                </Button>
              </div> */}
            </form>
          </Form>
        </Card>
      </Section>
    </CanSection>
  );
}
