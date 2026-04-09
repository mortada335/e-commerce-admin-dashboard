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

import { BANNER_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea } from "@/components/ui/scroll-area"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import CategoryAutocomplete from "@/components/CategoryAutocomplete"

import { setIsBannerDialogOpen, useBannerStore } from "../store"
import ProductAutocomplete from "@/components/ProductAutocomplete"
import FileInput from "@/components/ui/custom-file-input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import Text from "@/components/layout/text"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {  formatDate, formatDateToISO,  } from "@/utils/methods"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { slideSchema } from "@/utils/validation/slide"
import { useTranslation } from "react-i18next"


const defaultFormFields = {
  englishTitle: "",
  arabicTitle: "",
  link: "",
  englishImage: null,
  arabicImage: null,
  banner_type: "product",
  filter_id: "",
  sort_order: 0,
  event_date:null,
  event_title:""

}

export default function BannerDialog() {
  const { isBannerDialogOpen, selectedBanner } = useBannerStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(slideSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Slides")

  useEffect(() => {
  
    if (
      formFields.englishTitle  &&
      formFields.englishImage  &&
      formFields.arabicTitle  &&
      formFields.arabicImage  &&
      formFields.link  &&
      formFields.sort_order >= 0 &&
      formFields.filter_id
    ) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedBanner !== null &&
      selectedBanner !== undefined &&
      isBannerDialogOpen
    ) {
      
      setFormFields({
        englishTitle: selectedBanner.englishTitle,
        englishImage: selectedBanner.englishImage,
        arabicTitle: selectedBanner.arabicTitle,
        arabicImage: selectedBanner.arabicImage,
        sort_order: selectedBanner.sort_order,
        link: selectedBanner.link ,
        event_date: selectedBanner.event_date ,
        event_title: selectedBanner.event_title ,
        
     
        banner_type: selectedBanner.banner_type,
        filter_id: selectedBanner.banner_type_id,
      })
      form.setValue("englishTitle", selectedBanner.title)
      form.setValue("englishImage", selectedBanner.image)
      form.setValue("arabicTitle", selectedBanner.arabicTitle)
      form.setValue("arabicImage", selectedBanner.arabicImage)
      form.setValue("sort_order", selectedBanner.sort_order)
      form.setValue(
        "link",
        selectedBanner.link 
      )
      
      form.setValue(
        "event_date",
        selectedBanner.event_date 
      )
      
      form.setValue(
        "event_title",
        selectedBanner.event_title 
      )
      
      form.setValue("banner_type", selectedBanner.banner_type)
      form.setValue("filter_id", selectedBanner.banner_type_id)
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
      form.reset()
    }
  }, [selectedBanner])

  

  const onClose = () => {
    setIsBannerDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.englishTitle ||!formFields.englishImage ||!formFields.arabicImage||!formFields.arabicTitle ||!formFields.link) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }
  

  
    const formData = new FormData(); // Create a new FormData object
    
  
   

const slideData = {
  link: formFields.link,
  banner_type: formFields.banner_type,
  banner_type_id: formFields.filter_id ,
  sort_order: formFields.sort_order,
  event_date: formatDateToISO(formFields.event_date), 
  event_title: formFields.event_title,
};

const titlesData = [
  { language: 1, title: formFields.englishTitle },
  { language: 2, title:  formFields.arabicTitle },
];


formData.append('slide', JSON.stringify(slideData));
formData.append('titles', JSON.stringify(titlesData));
if (formFields.englishImage instanceof File) {
  
  formData.append('image_1',  formFields.englishImage, 'image_1.jpg');
}
if (formFields.arabicImage instanceof File) {
  
  formData.append('image_2', formFields.arabicImage,'image_2.jpg');
}

  
    mutate({
      url: BANNER_URL,
      id: selectedBanner?.banner_image_id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    });
  }
  

  return (
    <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className=" h-[500px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner?.banner_image_id ? t("Edit") : t("Create")} {t("Slide")}
            </DialogTitle>
            <DialogDescription>
              {selectedBanner?.banner_image_id
                ? t("Make changes to your")
                : t("Create")}{" "}
              {t("Slide here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="englishTitle"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span> {t("English Title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Slide English title")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            englishTitle: e.target.value,
                          })
                        }}
                        autoComplete="englishTitle"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
                 {/* image */}
                
                <FormField
                  control={form.control}
                  name="englishImage"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        <span className="text-red-500 text-xl">*</span>{t("English Image")}
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
                name="arabicTitle"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span>{t("Arabic Title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Slide Arabic title")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            arabicTitle: e.target.value,
                          })
                        }}
                        autoComplete="arabicTitle"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
          
                <FormField
                  control={form.control}
                  name="arabicImage"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        <span className="text-red-500 text-xl">*</span>{t("Arabic Image")}
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
                      <span className="text-red-500 text-xl">*</span>{t("Order")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder={t("this refer to the slide order in slides page, 5 means the 5th slide")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setFormFields({
                            ...formFields,
                            sort_order: e.target.value,
                          })
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
                name="banner_type"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span>{t("Filter by...")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)

                          setFormFields({
                            ...formFields,
                            banner_type: value,
                            filter_id: null,
                            filter_name: null,
                          })
                        }}
                        autoComplete="banner_type"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
         
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="product" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("product")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="category" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("category")}
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
                    <span className="text-red-500 text-xl">*</span>{t("Category")}
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
              ) : (
                <FormItem className="w-full px-1 ">
                  <FormLabel>
                    <span className="text-red-500 text-xl">*</span>{t("Product")}
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
                name="link"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span>{t("Link")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Slide link")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            link: e.target.value,
                          })
                        }}
                        autoComplete="link"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event_title"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                     {t("Event Title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Slide Event Title")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            event_title: e.target.value,
                          })
                        }}
                        autoComplete="event_title"
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
                    <FormLabel>
                      {t("Event Date")}
                    </FormLabel>
                    <FormControl>
                    <Popover>
                <PopoverTrigger asChild>
                  <div className="flex flex-col justify-start items-start space-y-2 w-full">
                 
                    <Card className="flex justify-between items-center space-y-0 space-x-0 pr-4 w-full">
                      <Button
                      type="button"
                        variant={"ghost"}
                        className={cn(
                          " w-fit text-left font-normal rounded-none flex justify-start items-center ",
                          !formFields.event_date &&
                            "text-muted-foreground w-[180px]"
                        )}
                      >
                        {formFields.event_date ? (
                          formatDate(formFields.event_date)
                        ) : (
                          <>{t("Pick Event Date")}</>
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
                                  field.onChange(null)
                                  setFormFields({
                                    ...formFields,
                                    event_date: null,
                                  })
                                }}
                              >
                                <X className=" h-4 w-4 opacity-50" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <Text text={t("Clear")} />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <CalendarIcon className="  h-4 w-4 opacity-50" />
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
                      })
                      field.onChange(value)
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                 
                </PopoverContent>
              </Popover>

                    </FormControl>

                    <FormMessage />
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
  )
}
