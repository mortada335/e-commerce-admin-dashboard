import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
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

import { BRAND_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { brandSchema } from "@/utils/validation/brand"
import { setIsBrandDialogOpen, useBrandStore } from "../store"
import FileInput from "@/components/ui/custom-file-input"

const defaultFormFields = {
  name: "",

  image: null,
  enabled: "enabled",

  sort_order: 0,
  imageUrl: null,
}

export default function BrandDialog() {
  const { isBrandDialogOpen, selectedBrand } = useBrandStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)

  const form = useForm({
    resolver: yupResolver(brandSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Brands")

  useEffect(() => {
    if (formFields.name) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedBrand !== null &&
      selectedBrand !== undefined &&
      isBrandDialogOpen
    ) {
      setFormFields({
        name: selectedBrand.name,
        sort_order: selectedBrand.sort_order,
        enabled: selectedBrand.enabled ? "enabled" : "disable",

        imageUrl: selectedBrand.image,
      })
      form.setValue("name", selectedBrand.name)
      form.setValue("sort_order", selectedBrand.sort_order)
      form.setValue("enabled", selectedBrand.enabled ? "enabled" : "disable")
      form.setValue("image", selectedBrand.image)
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
    }
  }, [selectedBrand])



  const onClose = () => {
    setIsBrandDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.name) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    const formData = new FormData()
    formData.append("name", formFields.name)
    formData.append("sort_order", formFields.sort_order)
    if (formFields.image instanceof File)
      formData.append("image", formFields.image)
    formData.append("enabled", formFields.enabled === "enabled" ? true : false)

    mutate({
      url: BRAND_URL,
      id: selectedBrand?.manufacturer_id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    })
  }

  return (
    <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[500px] sm:h-[600px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>
              {selectedBrand?.manufacturer_id ? "Edit" : "Create"} Brand
            </DialogTitle>
            <DialogDescription>
              {selectedBrand?.manufacturer_id
                ? "Make changes to your"
                : "Create"}{" "}
              Brand here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Brand name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            name: e.target.value,
                          })
                        }}
                        autoComplete="name"
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
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="this refer to the Brand order in Brands page, 5 means the 5th Brand"
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
              {/* image */}
              <div className="flex justify-between items-center w-full h-fit">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>Image</FormLabel>
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

              </div>

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)

                          setFormFields({
                            ...formFields,
                            enabled: value,
                          })
                        }}
                        autoComplete="enabled"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="enabled" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            Enabled
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="disable" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            Disable
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
                      <span>Please wait</span>
                    </p>
                  ) : (
                    <span>Save</span>
                  )}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
