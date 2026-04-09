import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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

import { CATEGORIES_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { categorySchema } from "@/utils/validation/category";
import { setIsCategoryDialogOpen, useCategoryStore } from "../store";

import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import { giveMeDefaultFile } from "@/utils/methods";
import ColorPicker from "@/components/ui/color-picker";
import FileInput from "@/components/ui/custom-file-input";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  // color: "#7F77F1",

  status: "enabled",
  imageUrl: null,
  nameArabic: "",
  nameEnglish: "",
  descriptionArabic: "",
  descriptionEnglish: "",
  filter_id: null,
  filter_name: "",

  transparency: "",
  image: null,
  sort_order: 0,
};

export default function CategoryDialog() {
  const { isCategoryDialogOpen, selectedCategory } = useCategoryStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [categoryFormFields, setCategoryFormFields] = useState([]);
  const form = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const {t} = useTranslation()

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Categories");

  useEffect(() => {
    if (formFields.image || selectedCategory?.image) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedCategory !== null &&
      selectedCategory !== undefined &&
      isCategoryDialogOpen
    ) {
      setFormFields({
        nameEnglish: selectedCategory.nameEnglish,
        nameArabic: selectedCategory.nameArabic,
        descriptionEnglish: selectedCategory.descriptionEnglish,
        descriptionArabic: selectedCategory.descriptionArabic,
        transparency: selectedCategory.transparency,
        sort_order: selectedCategory.sortOrder,
        status: selectedCategory.status === 1 ? "enabled" : "disable",
        imageUrl: selectedCategory.image,
        filter_id: selectedCategory.parent_id,
      });
      setCategoryFormFields(
        selectedCategory.parents?.map((parent) => {
          return { ...parent, description: { ...parent?.name } };
        }) || []
      );
      form.setValue("nameEnglish", selectedCategory.nameEnglish);
      form.setValue("nameArabic", selectedCategory.nameArabic);
      form.setValue("descriptionEnglish", selectedCategory.descriptionEnglish);
      form.setValue("descriptionArabic", selectedCategory.descriptionArabic);
      form.setValue("sort_order", selectedCategory.sortOrder);

      form.setValue("transparency", selectedCategory.transparency);
      form.setValue(
        "status",
        selectedCategory.status === 1 ? "enabled" : "disable"
      );

      form.setValue("image", selectedCategory.image);
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      setCategoryFormFields([]);
      form.reset();
    }
  }, [selectedCategory]);

  const onClose = () => {
    setIsCategoryDialogOpen(false);
    form.reset();
    setCategoryFormFields([]);
    setFormFields(defaultFormFields);
  };
  const categoryFilters = [
    {
      key: "parent_id",
      value: 0,
    },
  ];

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.image && !selectedCategory?.image) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const description = [
      {
        name: formFields.nameEnglish,
        description: formFields.descriptionEnglish,
        language_id: 1,
      },
      {
        name: formFields.nameArabic,
        description: formFields.descriptionArabic,
        language_id: 2,
      },
    ];

    const formData = new FormData();
    if (formFields.image instanceof File)
      formData.append("image", formFields.image);
    else if (
      selectedCategory?.id === null &&
      selectedCategory?.id === undefined
    ) {
      const defaultImageFile = await giveMeDefaultFile();
      formData.append("image", defaultImageFile);
    }
    if (formFields.transparency) {
      formData.append("category_transparency", formFields.transparency);
    }
    // formData.append("category_color", formFields.color)
    formData.append("description", JSON.stringify(description));
    formData.append("sort_order", formFields.sort_order);
    formData.append("status", formFields.status === "enabled" ? 1 : 0);
    if (categoryFormFields?.length) {
      formData.append(
        "parent_ids",
        JSON.stringify(
          categoryFormFields?.map((item) => Number(item?.category_id))
        )
      );
    } else {
      formData.append("parent_ids", JSON.stringify([]));
    }
    mutate({
      url: CATEGORIES_URL,
      id: selectedCategory?.id,
      headers: { "Content-Type": "multipart/form-data" },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Can permissions={["app_api.change_occategory"]}>
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
          <ScrollArea className=" w-[99%] md:w-full border-none">
            <ScrollArea className=" h-[500px] sm:h-[600px] pr-4 w-full ">
              <DialogHeader className="rtl:items-end">
                <DialogTitle>
                  {selectedCategory?.id ? t("Edit") : t("Create")} {t("Category")}
                </DialogTitle>
                <DialogDescription>
                  {selectedCategory?.id ? t("Make changes to your") : t("Create")}{" "}
                  {t("Category here. Click save when you are done.")}
                </DialogDescription>
              </DialogHeader>

              <Form {...form} className="h-full bg-black">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2 "
                >
                  <div className="flex justify-between items-start w-full px-1 space-x-4">
                    <FormField
                      control={form.control}
                      name="nameEnglish"
                      render={({ field }) => (
                        <FormItem className="w-full  pt-0">
                          <FormLabel className="capitalize">
                            {" "}
                            {t("English Name")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t("Category Name in English")}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setFormFields({
                                  ...formFields,
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
                      name="nameArabic"
                      render={({ field }) => (
                        <FormItem className="w-full  pt-0">
                          <FormLabel className="capitalize">
                            {" "}
                            {t("Arabic Name")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t("Category Name In Arabic")}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setFormFields({
                                  ...formFields,
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
                  </div>
                  <div className="flex justify-between items-start w-full px-1 space-x-4">
                    <FormField
                      control={form.control}
                      name="descriptionEnglish"
                      render={({ field }) => (
                        <FormItem className="w-full  pt-0">
                          <FormLabel className="capitalize">
                            {" "}
                            {t("English Description")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t("Category description in English")}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setFormFields({
                                  ...formFields,
                                  descriptionEnglish: e.target.value,
                                });
                              }}
                              autoComplete="descriptionEnglish"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="descriptionArabic"
                      render={({ field }) => (
                        <FormItem className="w-full  pt-0">
                          <FormLabel className="capitalize">
                            {" "}
                            {t("Arabic Description")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t("Category Description In Arabic")}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);

                                setFormFields({
                                  ...formFields,
                                  descriptionArabic: e.target.value,
                                });
                              }}
                              autoComplete="descriptionArabic"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-start w-full px-1 space-x-4">
                    <FormField
                      control={form.control}
                      name="sort_order"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>{t("Order")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder={t("this refer to the Category order in Categories page, 5 means the 5th Category")}
                              value={field.value}
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
                      name="transparency"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>{t("Transparency")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder={t("Transparency (%)")}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setFormFields({
                                  ...formFields,
                                  transparency: e.target.value,
                                });
                              }}
                              autoComplete="transparency"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className=" flex flex-col w-full px-1 pt-2">
                    <FormLabel className="capitalize">
                      {" "}
                      color<span className="text-red-500 text-xl">*</span> 
                    </FormLabel>
                    <FormControl>
                     
                      <ColorPicker
                        value={formFields.color}
                        handleColorClick={(color) => {
                          field.onChange(color)

                          setFormFields({
                            ...formFields,
                            color: color,
                          })
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

                  {/* image */}
                  <div className="flex justify-between items-center w-full h-fit">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="w-full px-1">
                          <FormLabel className="capitalize">
                            {t("image")}{" "}
                            <span className="text-red-500 text-xl">*</span>{" "}
                          </FormLabel>
                          <FormControl>
                            {/* <Input
                          type="file"
                          placeholder="Select Category image"
                          id="image"
                          onChange={(e) => handleImageChange(e, field)}
                          autoComplete="image"
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
                  </div>
                  <FormItem className="w-full px-1 ">
                    <FormLabel>{t("Parents Categories")}</FormLabel>
                    {/* <CategoryAutocomplete
                  formFields={formFields}
                  setFormFields={setFormFields}
                  categoryId={selectedCategory?.category_id}
                  isFetchCategory={formFields?.filter_id >= 0 ? true : false}
                /> */}

                    <CategoryMultiSelect
                      className="py-1 px-1 border rounded-md "
                      selectedCategories={categoryFormFields}
                      setSelectedCategories={setCategoryFormFields}
                    />

                    {/* <CustomsMultiCombobox
              
           
                endpoint={CATEGORIES_URL}
                itemKey={"category_id"}
                setItems={setCategoryFormFields}
                items={categoryFormFields}
                itemTitle="name"
            
                searchQueryKey="name"
                queryKey="categories"
                className="border rounded-md px-1"
                placeholder={"Select Parents Categories"}
              >
                {(item) => (
    <>
    
      {item?.description?.[0]?.name && item.description[0].name}
    </>
  )}
              </CustomsMultiCombobox> */}
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3 px-1">
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
