import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Loader2, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

import { PRODUCTS_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area"

import { productSchema } from "@/utils/validation/product"
import { setIsProductDialogOpen, useProductStore } from "../store"

import { cn } from "@/lib/utils"


import ProductStatusAutoComplete from "@/pages/sections/components/ProductStatusAutoComplete"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { formatDateToISO } from "@/utils/methods"

import CategoryMultiSelect from "@/components/CategoryMultiSelect"



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
    discount_start_date: null,
    discount_expiry_date: null,
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
}

export default function ProductDialog() {
  const { isProductDialogOpen, selectedProduct } = useProductStore()
  const { toast } = useToast()
  const form = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      ...defaultFormFields.product_info,
      ...defaultFormFields.media,
      ...defaultFormFields.pricing_quantity,
      ...defaultFormFields.dimensions,
      ...defaultFormFields.other,
    },
  })
  const [currentStep, setCurrentStep] = useState("product_info")
  const [isProductInfo, setIsProductInfo] = useState(false)

  const [isPricingQuantity, setIsPricingQuantity] = useState(false)
  const [isDimensions, setIsDimensions] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Products")

  const [categoryFormFields, setCategoryFormFields] = useState([])

  const [statusFormFields, setStatusFormFields] = useState({
    filter_id: null,
    filter_name: null,
  })


  const [productInfoFields, setProductInfoFields] = useState(
    defaultFormFields.product_info
  )
  const [mediaFields, setMediaFields] = useState(defaultFormFields.media)
  const [pricingQuantityFields, setPricingQuantityFields] = useState(
    defaultFormFields.pricing_quantity
  )
  const [dimensionsFields, setDimensionsFields] = useState(
    defaultFormFields.dimensions
  )

  useEffect(() => {
    if (
      productInfoFields.nameEnglish &&
      productInfoFields.model &&
      productInfoFields.englishDescription &&
      productInfoFields.arabicDescription &&
      productInfoFields.nameArabic
    ) {
      setIsProductInfo(true)
    } else {
      setIsProductInfo(false)
    }
  }, [productInfoFields])
  useEffect(() => {
    if (
      pricingQuantityFields.available_quantity >= 0 &&
      pricingQuantityFields.price >= 1
    ) {
      setIsPricingQuantity(true)
    } else {
      setIsPricingQuantity(false)
    }
  }, [pricingQuantityFields])
  useEffect(() => {
    if (
      dimensionsFields.weight >= 0 &&
      dimensionsFields.height >= 0 &&
      dimensionsFields.width >= 0 &&
      dimensionsFields.length >= 0
    ) {
      setIsDimensions(true)
    } else {
      setIsDimensions(false)
    }
  }, [dimensionsFields])
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    Object.entries(form.formState.errors).forEach(([key, value]) => {
      if (value.message) {
        return toast({
          variant: "destructive",
          title: "Failed!!!",
          description: value.message,
        })
      } else {
        return
      }
    })
  }, [form.formState.errors])

  const onClose = () => {
    form.reset()
    setCurrentStep("product_info")
    setProductInfoFields(defaultFormFields.product_info)
    setPricingQuantityFields(defaultFormFields.pricing_quantity)
    setDimensionsFields(defaultFormFields.dimensions)
    setIsProductDialogOpen(false)
  }

  const removeFile = (sort_order) => {
    setMediaFields((files) =>
      files.filter((file) => file.sort_order !== sort_order)
    )
  }

  const handleChangeImageOrder = (e, index) => {
    const { value } = e.target
    setMediaFields((prevMediaFields) => {
      const updatedFields = prevMediaFields.map((field, i) => {
        if (i === index) {
          return {
            ...field,
            sort_order: value,
          }
        }
        return field
      })
      return updatedFields
    })
  }

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
      })
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
    ]

    const formData = new FormData()
    formData.append("model", productInfoFields.model)
    formData.append(
      "available_quantity",
      Number(pricingQuantityFields.available_quantity)
    )

    formData.append("description", JSON.stringify(description))
    formData.append("price", Number(pricingQuantityFields.price))
    formData.append("weight", Number(dimensionsFields.weight))
    formData.append("length", Number(dimensionsFields.length))
    formData.append("width", Number(dimensionsFields.width))
    formData.append("height", Number(dimensionsFields.height))
    formData.append(
      "status",
      statusFormFields.filter_id ? statusFormFields.filter_id : 0
    )

    let images = []

    if (mediaFields?.length > 0)
      mediaFields.forEach((item) => {
        if (item.file) {
          images.push(item.file)
        }
      })

    if (images?.at(0) instanceof File) {
      formData.append("images", images?.at(0))
    }

    formData.append(
      "categories",
      JSON.stringify(categoryFormFields?.map((item) => item?.category_id))
    )
    // formData.append("categories", data.categories);

    if (pricingQuantityFields?.discount_price)
      formData.append(
        "discounted_price",
        Number(pricingQuantityFields.discount_price)
      )
    if (pricingQuantityFields.discount_start_date) {
      formData.append(
        "discount_start_date",
        formatDateToISO(pricingQuantityFields.discount_start_date || "")
      )
    }
    if (pricingQuantityFields.discount_expiry_date) {
      formData.append(
        "discount_expiry_date",
        formatDateToISO(pricingQuantityFields.discount_expiry_date || "")
      )
    }
    formData.append("points", Number(pricingQuantityFields.points))

 

   
    mutate({
      url: PRODUCTS_URL,

      headers: {
        "Content-Type": "multipart/form-data",
      },
      isAddProduct: true,
      onFinish: onClose,
      formData,
    })
  }

  return (
    <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
      <DialogContent className="sm:max-w-[800px] ">
        <ScrollArea className=" h-[600px] pr-4 w-full flex flex-col justify-start items-center space-y-4 pb-6">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.productData?.id ? "Edit" : "Create"} Product
            </DialogTitle>
            <DialogDescription>
              {selectedProduct?.productData?.id
                ? "Make changes to your"
                : "Create"}{" "}
              Product here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full  ">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 pt-4 flex flex-col justify-between h-full items-center"
            >
              <Tabs
                value={currentStep}
                onValueChange={setCurrentStep}
                defaultValue="product_info"
                className="w-full h-full "
              >
                <TabsList className="w-full">
                  <TabsTrigger className="w-full" value="product_info">
                    Product Info
                  </TabsTrigger>
                  {/* <TabsTrigger
                    disabled={!isProductInfo}
                    className="w-full"
                    value="media"
                  >
                    Media
                  </TabsTrigger> */}
                  <TabsTrigger
               
                    className="w-full"
                    value="pricing_quantity"
                  >
                    Pricing Quantity
                  </TabsTrigger>
                  {/* <TabsTrigger
                   
                    className="w-full"
                    value="dimensions"
                  >
                    Dimensions
                  </TabsTrigger> */}
                  <TabsTrigger
                   
                    className="w-full"
                    value="other"
                  >
                    Other
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
                          <span className="text-red-500 text-xl">*</span>Model
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Product Model"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)

                              setProductInfoFields({
                                ...productInfoFields,
                                model: e.target.value,
                              })
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
                          <span className="text-red-500 text-xl">*</span> Name
                          Arabic
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Product Name In Arabic"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              setProductInfoFields({
                                ...productInfoFields,
                                nameArabic: e.target.value,
                              })
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
                          <span className="text-red-500 text-xl">*</span>{" "}
                          Arabic Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product Arabic Description"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)

                              setProductInfoFields({
                                ...productInfoFields,
                                arabicDescription: e.target.value,
                              })
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
                          <span className="text-red-500 text-xl">*</span> Name
                          English
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Product Name in English"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)

                              setProductInfoFields({
                                ...productInfoFields,
                                nameEnglish: e.target.value,
                              })
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
                          <span className="text-red-500 text-xl">*</span>{" "}
                          English Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product English Description"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)

                              setProductInfoFields({
                                ...productInfoFields,
                                englishDescription: e.target.value,
                              })
                            }}
                            autoComplete="englishDescription"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  
                  <div className="flex justify-end items-center w-full py-2 space-x-4">
                    <Button variant="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      disabled={!isProductInfo}
                      type="button"
                      onClick={() => {
                        setCurrentStep("pricing_quantity")
                      }}
                    >
                      <span>Next</span>
                    </Button>
                  </div>
                </TabsContent>
                {/* image */}
                {/* <TabsContent className="h-full " value="media">
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem className="w-full px-1">
                        <FormControl>
                          <div className="flex flex-col justify-start items-center w-full h-full space-y-4">
                            <FilesDropzone
                              className={"w-full"}
                              files={mediaFields}
                              setFiles={setMediaFields}
                              currentFiles={mediaFields}
                            />
                            {!!mediaFields.length && (
                              <ScrollArea className=" border rounded-md h-[300px] px-4 w-full flex flex-col justify-start items-center space-y-4 pb-6">
                                <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full w-full py-2 px-2  gap-4">
                                  {mediaFields
                                    ?.sort(
                                      (a, b) => a.sort_order > b.sort_order
                                    )
                                    .map((file, index) => (
                                      <li
                                        key={file.name}
                                        className="relative flex flex-col justify-center items-center  w-full h-fit rounded-md  border px-2 py-2 space-y-2"
                                      >
                                        <img
                                          src={file.image}
                                          alt={file.name}
                                          onLoad={() => {
                                            URL.revokeObjectURL(file.preview)
                                          }}
                                          className="h-20 w-full rounded-sm  object-cover  "
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          className="   flex justify-center items-center  w-5 h-5 rounded-full text-xs absolute top-0 right-1"
                                          onClick={() =>
                                            removeFile(file.sort_order)
                                          }
                                        >
                                          <X size={16} />
                                        </Button>
                                        <Input
                                          className="h-8"
                                          placeholder="Index"
                                          value={
                                            mediaFields?.at(index).sort_order
                                          }
                                          onChange={(e) =>
                                            handleChangeImageOrder(e, index)
                                          }
                                        />
                                      </li>
                                    ))}
                                </div>
                              </ScrollArea>
                            )}
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between items-center w-full  space-x-4 px-1">
                    {!!mediaFields?.length && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="   flex justify-center items-center  w-fit text-xs"
                        onClick={() => setMediaFields([])}
                      >
                        Remove All Files
                      </Button>
                    )}

                    <div className="flex justify-end items-center w-full py-2 space-x-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCurrentStep("product_info")
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setCurrentStep("pricing_quantity")
                        }}
                      >
                        {mediaFields?.length ? (
                          <span>Next</span>
                        ) : (
                          <span>Skip</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent> */}
                <TabsContent className="h-[380px]" value="pricing_quantity">
                  <div className="flex justify-between items-start space-x-4 w-full px-1 pt-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            {" "}
                            <span className="text-red-500 text-xl">*</span>Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Product Price"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                setPricingQuantityFields({
                                  ...pricingQuantityFields,
                                  price: e.target.value,
                                })
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
                            Quantity
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Available Quantity"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                setPricingQuantityFields({
                                  ...pricingQuantityFields,
                                  available_quantity: e.target.value,
                                })
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
                          <FormLabel>Discount Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Discount Price"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                setPricingQuantityFields({
                                  ...pricingQuantityFields,
                                  discount_price: e.target.value,
                                })
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
                            Discount Start Date
                          </FormLabel>
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
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  field.onChange(value)
                                  setPricingQuantityFields({
                                    ...pricingQuantityFields,
                                    discount_start_date: value,
                                  })
                                }}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
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
                          <FormLabel className="py-1">
                            Discount Expiry Date
                          </FormLabel>
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
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  field.onChange(value)
                                  setPricingQuantityFields({
                                    ...pricingQuantityFields,
                                    discount_expiry_date: value,
                                  })
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
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end items-center w-full py-2 space-x-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCurrentStep("pricing_quantity")
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={!isPricingQuantity}
                      type="button"
                      onClick={() => {
                        setCurrentStep("other")
                      }}
                    >
                      <span>Next</span>
                    </Button>
                  </div>
                </TabsContent>
                {/* <TabsContent className="h-[380px]" value="dimensions">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="w-full px-1  pt-2">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Weight
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Product Weight"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              setDimensionsFields({
                                ...dimensionsFields,
                                weight: e.target.value,
                              })
                            }}
                            autoComplete="weight"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="w-full px-1  pt-2">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Height
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Product Height"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              setDimensionsFields({
                                ...dimensionsFields,
                                height: e.target.value,
                              })
                            }}
                            autoComplete="height"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem className="w-full px-1  pt-2">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Width
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Product Width"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              setDimensionsFields({
                                ...dimensionsFields,
                                width: e.target.value,
                              })
                            }}
                            autoComplete="width"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-2">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Length
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Product Length"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              setDimensionsFields({
                                ...dimensionsFields,
                                length: e.target.value,
                              })
                            }}
                            autoComplete="length"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end items-center w-full py-2 space-x-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCurrentStep("pricing_quantity")
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={!isDimensions}
                      type="button"
                      onClick={() => {
                        setCurrentStep("other")
                      }}
                    >
                      <span>Next</span>
                    </Button>
                  </div>
                </TabsContent> */}
                <TabsContent className="h-[380px]" value="other">
                  <FormItem className="w-full px-1 ">
                    <FormLabel>Category</FormLabel>
                    <CategoryMultiSelect
                      selectedCategories={categoryFormFields}
                      setSelectedCategories={setCategoryFormFields}
                    />
                  </FormItem>

                 

                  <FormItem className="w-full px-1 ">
                    <FormLabel>Status</FormLabel>
                    <ProductStatusAutoComplete
                      formFields={statusFormFields}
                      setFormFields={setStatusFormFields}
                    />
                  </FormItem>
                 
                  <div className="flex justify-end items-center w-full py-2 space-x-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCurrentStep("dimensions")
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={
                        !isProductInfo ||
                    
                        
                        !isPricingQuantity ||
                        isAction
                      }
                      type="submit"
                    >
                      {isAction ? (
                        <p className="flex justify-center items-center space-x-2">
                          <Loader2 className=" h-5 w-5 animate-spin" />
                          <span>Please wait</span>
                        </p>
                      ) : (
                        <span>Save</span>
                      )}
                    </Button>
                  </div>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
