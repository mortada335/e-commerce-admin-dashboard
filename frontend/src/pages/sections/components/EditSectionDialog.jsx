import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { useEffect, useMemo, useState } from "react";
import { editSectionSchema } from "@/utils/validation/section";

import { HOME_SECTION_URL } from "@/utils/constants/urls";
import useUpdateMutation from "@/hooks/useUpdateMutation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import ProductStatusAutoComplete from "./ProductStatusAutoComplete";

import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import FileInput from "@/components/ui/custom-file-input";

const defaultFormFields = {
  titleEn: "",
  titleAr: "",
  sub_titleEn: "",
  sub_titleAr: "",
  filter_id: null,

  section_products_limit: 4,
  section_sub_categories_limit: 4,

  section_type: 1,
  section_background: null,
  section_backgroundUrl: null,
};

export function EditSectionDialog({ isDialogOpen, setIsDialogOpen, section }) {
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  const form = useForm({
    resolver: yupResolver(editSectionSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useUpdateMutation("Sections");

  useEffect(() => {
    if (
      formFields.titleEn &&
      formFields.titleAr &&
      formFields.section_type &&
      formFields.filter_id >= 0 &&
      formFields.section_products_limit > 0
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (section !== null && section !== undefined && isDialogOpen) {
      
      const en = section.section_title?.find((item) => item.language_id === 1);
      const ar = section.section_title?.find((item) => item.language_id === 2);
      form.setValue("titleEn", en.title);
      form.setValue("titleAr", ar.title);
      form.setValue("sub_titleEn", en.sub_title);
      form.setValue("sub_titleAr", ar.sub_title);

      form.setValue("section_type", section.type);
      form.setValue("section_background", section.section_background);
      // form.setValue(
      //   "section_products_limit",
      //   section.type === 5
      //     ? section.section_sub_categories_limit
      //     : section.section_products_limit
      // );

      form.setValue("section_products_limit", section.section_products_limit);
      form.setValue(
        "section_sub_category_limit",
        section.section_sub_categories_limit
      );

      setFormFields({
        titleEn: en.title,
        titleAr: ar.title,
        sub_titleEn: en.sub_title,
        sub_titleAr: ar.sub_title,
        filter_id: section.filter_id,
        section_products_limit: section?.section_products_limit,
        section_sub_categories_limit: section?.section_sub_categories_limit,
        section_type: section.type,

        section_backgroundUrl: section.section_background,
      });
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
    }
  }, [section,isDialogOpen]);

  const filteredSectionTypeOptions = useMemo(() => {
    const sectionTypeOptions = [
      { label: "PRODUCTS BY CATEGORY", value: 1 },
      { label: "PRODUCTS BY STATUS", value: 2 },

      { label: "SUB CATEGORIES", value: 4 },
      { label: "SUB CATEGORY AND PRODUCTS", value: 5 },
    ];

    return sectionTypeOptions.filter((item) =>
      item.label.toLowerCase().includes(search)
    );
  }, [search]);

  const onClose = () => {
    setIsDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
    form.setValue("section_type", 1);
  };

  const onSubmit = async () => {
    // Validate currency Change

    if (
      !formFields.titleEn ||
      !formFields.titleAr ||
      !formFields.section_type ||
      formFields.section_products_limit <= 0
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }
    // let sectionProductLimit;

    // if (
    //   formFields.section_type == 1 ||
    //   formFields.section_type == 4 ||
    //   formFields.section_type == 5
    // ) {
    //   if (formFields.section_type == 1) sectionProductLimit = 6;
    //   if (formFields.section_type == 4) sectionProductLimit = 4;
    //   if (formFields.section_type == 5) sectionProductLimit = 8;
    // } else if (formFields.section_type == 2) {
    //   sectionProductLimit = 6;
    // } else if (formFields.section_type == 3) {
    //   sectionProductLimit = 6;
    // }

    const title = [
      {
        title: formFields.titleEn,
        sub_title: formFields.sub_titleEn,
        language_id: 1,
      },
      {
        title: formFields.titleAr,
        sub_title: formFields.sub_titleAr,
        language_id: 2,
      },
    ];

    const formData = new FormData();

    formFields.section_background
      ? formData.append("section_background", formFields.section_background)
      : formData.append("section_background", "");
    formData.append("type", formFields.section_type);
    if (
      formFields.section_type === 1 ||
      formFields.section_type === 3 ||
      formFields.section_type === 4
    )
      formData.append(
        "section_products_limit",
        formFields.section_products_limit
      );

    if (formFields.section_type === 5) {
      formData.append(
        "section_products_limit",
        formFields.section_products_limit
      );
      if (formFields.section_sub_categories_limit) {
        formData.append(
          "section_sub_categories_limit",
          formFields.section_sub_categories_limit
        );
      } else {
        formData.append("section_sub_categories_limit", 4);
      }
    }

    formData.append("filter_id", formFields.filter_id);
    formData.append("title", JSON.stringify(title));

    mutate({
      url: HOME_SECTION_URL,
      id: section?.id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className="h-[500px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>{section?.id ? "Edit" : "Create"} Section</DialogTitle>
            <DialogDescription>
              {section?.id ? "Make changes to your" : "Create"} section here.
              Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <div className="flex justify-between items-center space-x-4 w-full">
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>Title in
                        english
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Section title in english"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              titleEn: e.target.value,
                            });
                          }}
                          autoComplete="titleEn"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>Title in
                        arabic
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Section title in arabic"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              titleAr: e.target.value,
                            });
                          }}
                          autoComplete="titleAr"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-center space-x-4 w-full">
                <FormField
                  control={form.control}
                  name="sub_titleEn"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 py-0">
                      <FormLabel>Sub title in english</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Section sub title in english"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              sub_titleEn: e.target.value,
                            });
                          }}
                          autoComplete="sub_titleEn"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sub_titleAr"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>Sub title in arabic</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Section sub title in arabic"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              sub_titleAr: e.target.value,
                            });
                          }}
                          autoComplete="sub_titleAr"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Order  */}
                {/* <FormField
                  control={form.control}
                  name="order_id"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>Order
                      </FormLabel>
                      <FormControl>
                        <Input
                          min={0}
                          type="number"
                          placeholder="this refer to the section order in home page, 5 means the 5th section"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              order_id: e.target.value,
                            });
                          }}
                          autoComplete="order_id"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Section products limit */}
                <FormField
                  control={form.control}
                  name="section_products_limit"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        <span className="text-red-500 text-xl">*</span>Products
                        Limit
                      </FormLabel>
                      <FormControl>
                        <Input
                          min={0}
                          type="number"
                          placeholder="Add number of products in the section"
                          value={Number(formFields.section_products_limit)}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              section_products_limit: e.target.value,
                            });
                          }}
                          autoComplete="section_products_limit"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sub category limit */}
                {formFields.section_type === 5 && (
                  <FormField
                    control={form.control}
                    name="section_sub_categories_limit"
                    render={({ field }) => (
                      <FormItem className="w-full px-1">
                        <FormLabel>
                          <span className="text-red-500 text-xl">*</span>Sub
                          Category Limit
                        </FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            type="number"
                            placeholder="Add number of products in the section"
                            value={
                              formFields.section_sub_categories_limit || ""
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                section_sub_categories_limit: e.target.value,
                              });
                            }}
                            autoComplete="section_sub_categories_limit"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* image */}
              <div className="flex justify-between items-center w-full h-fit">
                <FormField
                  control={form.control}
                  name="section_background"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        {/* <Input
                          type="file"
                          placeholder="Select section background"
                          id="section_background"
                          onChange={(e) => handleImageChange(e, field)}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          autoComplete="section_background"
                        /> */}

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

                {/* {formFields.section_backgroundUrl && (
                  <img
                    src={formFields.section_backgroundUrl}
                    alt=""
                    className="w-40 h-20 object-cover rounded-sm border"
                  />
                )} */}
              </div>

              <div className="flex justify-between items-center space-x-4 w-full">
                <FormField
                  control={form.control}
                  name="section_type"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 ">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>Type
                      </FormLabel>
                      <FormControl>
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? filteredSectionTypeOptions?.find(
                                    (type) => type.value === field.value
                                  )?.label
                                : "Select type"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Input
                              onChange={(e) => setSearch(e.target.value)}
                              className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
                              placeholder="Search type..."
                            />
                            <Separator />

                            {filteredSectionTypeOptions.length ? (
                              filteredSectionTypeOptions?.map((type) => (
                                <Button
                                  variant="ghost"
                                  className="w-full rounded-none flex justify-between px-3"
                                  key={type.value}
                                  onClick={() => {
                                    form.setValue("section_type", type.value);
                                    if (type.value === section?.type) {
                                      setFormFields({
                                        ...formFields,
                                        filter_id: section?.type,
                                        section_type: type.value,
                                      });
                                    } else {
                                      if (type.value === 2) {
                                        setFormFields({
                                          ...formFields,
                                          filter_id: 0,
                                          section_type: type.value,
                                        });
                                      } else {
                                        setFormFields({
                                          ...formFields,
                                          filter_id: null,
                                          section_type: type.value,
                                        });
                                      }
                                    }
                                    setIsOpen(false);
                                  }}
                                >
                                  {type.label}
                                  <Check
                                    size={"16"}
                                    className={cn(
                                      "ml-2 ",
                                      type.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </Button>
                              ))
                            ) : (
                              <p className="w-full py-2  text-center text-sm font-medium">
                                No type found!!!
                              </p>
                            )}
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {formFields.section_type == 2 ? (
                <FormItem className="w-full px-1 ">
                  <FormLabel>
                    {" "}
                    <span className="text-red-500 text-xl">*</span>Status
                  </FormLabel>
                  <ProductStatusAutoComplete
                    formFields={formFields}
                    setFormFields={setFormFields}
                  />
                </FormItem>
              ) : (
                <FormItem className="w-full px-1 ">
                  <FormLabel>
                    {" "}
                    <span className="text-red-500 text-xl">*</span>Category
                  </FormLabel>
                  <CategoryAutocomplete
                    formFields={formFields}
                    setFormFields={setFormFields}
                    categoryId={formFields.filter_id}
                    isFetchCategory={section?.filter_id >= 0 ? true : false}
                  />
                </FormItem>
              )}
              <div className="flex justify-end items-center w-full py-2 space-x-4">
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
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
