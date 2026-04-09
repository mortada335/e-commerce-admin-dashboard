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

import { HOME_VIDEO_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import { homeVideoSchema } from "@/utils/validation/home-video";
import { setIsHomeVideoDialogOpen, useHomeVideoStore } from "../store";
import ProductAutocomplete from "@/components/ProductAutocomplete";
import FileInput from "@/components/ui/custom-file-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate, formatDateToISO, formatFullDate } from "@/utils/methods";
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
import VideoDropzone from "@/components/ui/video-dropzone";
import usePUT from "@/hooks/usePut";
import usePost from "@/hooks/usePost";
import usePatch from "@/hooks/usePatch";
import { useTranslation } from "react-i18next";

const endDatePlus = new Date();
endDatePlus.setDate(endDatePlus.getDate() + 1);
const defaultFormFields = {
  title: "",
  image: null,
  banner_type: null,
  filter_id: "",
  start_date: new Date(),
  end_date: endDatePlus,

};

export default function HomeVideoDialog() {
  const { isHomeVideoDialogOpen, selectedHomeVideo } = useHomeVideoStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {t} = useTranslation()

  // Date status state.
  const [dateStatus, setDateStatus] = useState({
    isSubmit: false,
    isValid: false,
  });

  const form = useForm({
    resolver: yupResolver(homeVideoSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onClose = () => {
    setIsHomeVideoDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
 
    // Reset date status.
    setDateStatus({
      isSubmit: false,
      isValid: false,
    });
  };

  const {
    mutate: postMutate,

    isPending: isPostAction,
  } = usePost({
    queryKey: "HomeVideos",
    onSuccess: onClose,
  });
  const {
    mutate: patchMutate,

    isPending: isPatchAction,
  } = usePatch({
    queryKey: "HomeVideos",
    onSuccess: onClose,
  });

  // Effect for tracking validity of dates.
  useEffect(() => {
    const startDate = new Date(formFields.start_date);
    const endDate = new Date(formFields.end_date);

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
  }, [formFields.start_date, formFields.end_date]);

  useEffect(() => {
    if (
      formFields.title &&
      formFields.video?.video 
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedHomeVideo !== null &&
      selectedHomeVideo !== undefined &&
      isHomeVideoDialogOpen
    ) {
      setFormFields({
        title: selectedHomeVideo.title || "",
        video:  { video:selectedHomeVideo.video } || null,

        banner_type: selectedHomeVideo.banner_type || "product",
        filter_id: selectedHomeVideo.banner_id || "",
        start_date: selectedHomeVideo.start_date
          ? new Date(selectedHomeVideo.start_date)
          : new Date(),
        end_date: selectedHomeVideo.end_date
          ? new Date(selectedHomeVideo.end_date)
          : new Date(),
      });
      form.setValue("title", selectedHomeVideo.title || "");
      form.setValue("video", { video:selectedHomeVideo.video }|| null);

   


      form.setValue("banner_type", selectedHomeVideo.banner_type || "product");
      form.setValue("filter_id", selectedHomeVideo.banner_id || "");
      form.setValue(
        "start_date",
        selectedHomeVideo.start_date
          ? new Date(selectedHomeVideo.start_date)
          : new Date()
      );
      form.setValue(
        "end_date",
        selectedHomeVideo.end_date
          ? new Date(selectedHomeVideo.end_date)
          : new Date()
      );
    } else {
      // this is server error or other error that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedHomeVideo, isHomeVideoDialogOpen, form]);


  const onSubmit = async () => {
    setDateStatus((prevState) => ({
      ...prevState,
      isSubmit: true,
    }));

    if (!dateStatus.isValid) return;

    if (!formFields.title || !formFields.video?.video) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = new FormData(); // Create a new FormData object
    if (formFields.banner_type) {
      
      formData.append("banner_type", formFields.banner_type);
      formData.append("banner_id", formFields.filter_id);
    }
    formData.append("start_date", formatDateToISO(formFields.start_date));
    formData.append(
      "end_date",
      formatDateToISO(formFields.end_date)
    );
    formData.append("title", formFields.title);


    if (formFields.video?.file instanceof File) {
      formData.append("video", formFields.video?.file);
    }


    if (selectedHomeVideo?.id) {
      patchMutate({
        endpoint: HOME_VIDEO_URL,
        id: selectedHomeVideo?.id,
         headers: {
        "Content-Type": "multipart/form-data",
      },
        body: formData,
      });
    } else {
      postMutate({
        endpoint: HOME_VIDEO_URL,
        body: formData,
        headers: {
        "Content-Type": "multipart/form-data",
      },
      });
    }
  };

  return (
    <Can permissions={["app_api.view_shorthomepagevideo"]}>
      <Dialog open={isHomeVideoDialogOpen} onOpenChange={setIsHomeVideoDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">
          <ScrollArea className=" h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-fit pr-4 w-full ">
            <DialogHeader className={"rtl:items-end"}>
              <DialogTitle>
                {selectedHomeVideo?.id ? t("Edit") : t("Create")} {t("Video")}
              </DialogTitle>
              <DialogDescription>
                {selectedHomeVideo?.id
                  ? t("Make changes to your")
                  : t("Create")}{" "}
                {t("Video here. Click save when you are done.")}
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
                        <span className="text-red-500 text-xl">*</span>{t("Title")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Enter video title")}
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
                {/* video */}

                <FormField
                  control={form.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        <span className="text-red-500 text-xl">*</span>{t("Video")}
                      </FormLabel>
                      <FormControl>
                      <VideoDropzone 

                        file={formFields.video}
                        setFile={(value)=>{
                          field.onChange(value);
                          setFormFields({
                              ...formFields,
                              video: value,
                            });
                        }}
                      />
                        
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

              

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>{t("Start Date")}</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex flex-col justify-start items-start space-y-2 w-full">
                              <Card
                                className={cn(
                                  "flex justify-between items-center space-y-0 space-x-0 w-full",
                                  formFields.start_date ? "pr-0" : "!pr-4"
                                )}
                              >
                                <Button
                                  type="button"
                                  variant={"ghost"}
                                  className={cn(
                                    " w-fit text-left font-normal rounded-none flex justify-start items-center cursor-pointer",
                                    !formFields.start_date &&
                                      "text-muted-foreground w-[180px]"
                                  )}
                                >
                                  {formFields.start_date &&
                                  formFields.start_date !== null ? (
                                    formatFullDate(formFields?.start_date)
                                  ) : (
                                    <>{t("Pick Start Date")}</>
                                  )}
                                </Button>
                                {formFields.start_date ? (
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
                                              start_date: "",
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
                              selected={formFields.start_date}
                              onSelect={(value) => {
                                setFormFields({
                                  ...formFields,
                                  start_date: value,
                                });
                                field.onChange(value);
                              }}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                            <TimePicker
                              selectedTime={formFields.start_date}
                              onSelectTime={(value) => {
                                setFormFields({
                                  ...formFields,
                                  start_date: value,
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel
                        className={cn(
                          !dateStatus.isValid &&
                            dateStatus.isSubmit &&
                            "text-[#ef4444]"
                        )}
                      >
                        {t("End Date")}
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex flex-col justify-start items-start space-y-2 w-full">
                              <Card
                                className={cn(
                                  "flex justify-between items-center space-y-0 space-x-0 w-full",
                                  formFields.end_date ? "pr-0" : "!pr-4"
                                )}
                              >
                                <Button
                                  type="button"
                                  variant={"ghost"}
                                  className={cn(
                                    " w-fit text-left font-normal rounded-none flex justify-start items-center ",
                                    !formFields.end_date &&
                                      "text-muted-foreground w-[180px]"
                                  )}
                                >
                                  {" "}
                                  {formFields.end_date &&
                                  formFields.end_date !== null ? (
                                    formatFullDate(
                                      formFields?.end_date || ""
                                    )
                                  ) : (
                                    <>{t("Pick End Date")}</>
                                  )}
                                </Button>
                                {formFields.end_date ? (
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
                                              end_date: "",
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
                              selected={formFields.end_date}
                              onSelect={(date) => {
                                field.onChange(date);
                                setFormFields({
                                  ...formFields,
                                  end_date: date,
                                });
                              }}
                              disabled={(date) => {
                                const startDate = new Date(
                                  formFields.start_date
                                );
                                startDate.setDate(startDate.getDate() - 1);

                                return date <= startDate;
                              }}
                              initialFocus
                            />
                            <TimePicker
                              selectedTime={formFields.end_date}
                              onSelectTime={(value) => {
                                setFormFields({
                                  ...formFields,
                                  end_date: value,
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
                         {t("Filter By")}
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
                     
                          defaultValue={field.value}
                          className="flex rtl:flex-row-reverse space-x-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={null} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("None")}
                            </FormLabel>
                   
                          </FormItem>
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
                      categoryId={selectedHomeVideo?.banner_id}
                      isFetchCategory={
                        selectedHomeVideo?.banner_id >= 0 ? true : false
                      }
                    />
                  </FormItem>
                ) : formFields.banner_type === "product"&& (
                  <FormItem className="w-full px-1 ">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span>{t("Product")}
                    </FormLabel>
                    <ProductAutocomplete
                      formFields={formFields}
                      setFormFields={setFormFields}
                      productId={selectedHomeVideo?.banner_id}
                      isFetchProduct={
                        selectedHomeVideo?.banner_id >= 0 ? true : false
                      }
                    />
                  </FormItem>
                )}


                <div className="flex justify-start items-center w-full py-2 space-x-4">
                  <Button disabled={!isSubmit || isPostAction || isPatchAction} type="submit">
                    {isPostAction || isPatchAction ? (
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
