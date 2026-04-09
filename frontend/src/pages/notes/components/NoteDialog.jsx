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

import { NOTES_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { noteSchema } from "@/utils/validation/note"
import { setIsNoteDialogOpen, useNoteStore } from "../store"

import CategoryAutocomplete from "@/components/CategoryAutocomplete"
import ColorPicker from "@/components/ui/color-picker"
import FileInput from "@/components/ui/custom-file-input"

const defaultFormFields = {
  title: "",
  type: "",
  bgColor: "#7F77F1",
  color: "#6985FF",

  icon: null,
  status: "enabled",
  language: "english",
  filter_id: null,
  filter_name: "",
  iconUrl: null,
}

export default function NoteDialog() {
  const { isNoteDialogOpen, selectedNote } = useNoteStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)

  const form = useForm({
    resolver: yupResolver(noteSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Notes")

  useEffect(() => {
    if (formFields.title && formFields.icon && formFields.filter_id) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedNote !== null &&
      selectedNote !== undefined &&
      isNoteDialogOpen
    ) {
      setFormFields({
        title: selectedNote.title,
        type: selectedNote.type,
        bgColor: selectedNote.bgColor,
        color: selectedNote.color,

        status: selectedNote.status === 1 ? "enabled" : "disable",
        language: selectedNote.language === 2 ? "arabic" : "english",

        icon: selectedNote.icon,
        filter_id: selectedNote.category_id,
        filter_name: selectedNote.category_name,
      })
      form.setValue("title", selectedNote.title)
      form.setValue("type", selectedNote.type)
      form.setValue("status", selectedNote.status === 1 ? "enabled" : "disable")
      form.setValue(
        "language",
        selectedNote.language === 2 ? "arabic" : "english"
      )
      form.setValue("icon", selectedNote.icon)
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
      form.reset()
    }
  }, [selectedNote])


  const onClose = () => {
    setIsNoteDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.title || !formFields.icon || !formFields.filter_id) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    const formData = new FormData()
    if (formFields.icon instanceof File) {
      formData.append("important_notes_icon", formFields.icon)
    }
    formData.append("important_notes_title", formFields.title)
    formData.append("important_notes_type", formFields.type)
    formData.append("language_id", formFields.language === "arabic" ? 2 : 1)
    formData.append(
      "important_notes_status",
      formFields.status === "enabled" ? 1 : 0
    )
    formData.append("important_notes_bkcolor", formFields.bgColor)
    formData.append("important_notes_title_color", formFields.color)
    formData.append("category_id", formFields.filter_id)
    formData.append("category_name", formFields.filter_name)

    mutate({
      url: NOTES_URL,
      id: selectedNote?.id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    })
  }

  return (
    <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[500px] sm:h-[600px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>
              {selectedNote?.id ? "Edit" : "Create"} Note
            </DialogTitle>
            <DialogDescription>
              {selectedNote?.id ? "Make changes to your" : "Create"} Note here.
              Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">
                      {" "}
                      <span className="text-red-500 text-xl">*</span>title
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Note title"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            title: e.target.value,
                          })
                        }}
                        autoComplete="title"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">type</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Note type"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            type: e.target.value,
                          })
                        }}
                        autoComplete="type"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bgColor"
                render={({ field }) => (
                  <FormItem className=" flex flex-col w-full px-1 pt-2">
                    <FormLabel className="capitalize">bgColor</FormLabel>
                    <FormControl>
                      
                      <ColorPicker
                        value={formFields.bgColor}
                        handleColorClick={(color) => {
                          field.onChange(color)

                          setFormFields({
                            ...formFields,
                            bgColor: color,
                          })
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className=" flex flex-col w-full px-1 pt-2">
                    <FormLabel className="capitalize">color</FormLabel>
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
              />

              {/* image */}
              <div className="flex justify-between items-center w-full h-fit">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>Icon
                      </FormLabel>
                      <FormControl>
                        {/* <Input
                          type="file"
                          placeholder="Select Note icon"
                          id="icon"
                          onChange={(e) => handleImageChange(e, field)}
                          autoComplete="icon"
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

                {formFields.iconUrl && (
                  <img
                    src={formFields.iconUrl}
                    alt=""
                    className="w-40 h-20 object-cover rounded-sm border"
                  />
                )}
              </div>
              <FormItem className="w-full px-1 ">
                <FormLabel>
                  {" "}
                  <span className="text-red-500 text-xl">*</span>Category
                </FormLabel>
                <CategoryAutocomplete
                  formFields={formFields}
                  setFormFields={setFormFields}
                  categoryId={selectedNote?.category_id}
                  isFetchCategory={formFields?.filter_id >= 0 ? true : false}
                />
              </FormItem>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)

                          setFormFields({
                            ...formFields,
                            status: value,
                          })
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
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)

                          setFormFields({
                            ...formFields,
                            language: value,
                          })
                        }}
                        autoComplete="language"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="english" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            english
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="arabic" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            arabic
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end items-center w-full py-2 space-x-4">
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
