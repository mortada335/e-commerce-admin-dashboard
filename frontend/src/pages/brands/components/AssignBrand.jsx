import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Loader2 } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"


import { ASSIGN_BRAND_URL } from "@/utils/constants/urls"


import { ScrollArea } from "@/components/ui/scroll-area"


import CategoryAutocomplete from "@/components/CategoryAutocomplete"
import BrandAutocomplete from "@/components/BrandAutocomplete"
import { Label } from "@/components/ui/label"
import { axiosPrivate } from "@/api/axios"
import Can from "@/components/Can"


export default function AssignBrand({ isDialogOpen, setIsDialogOpen }) {
  const { toast } = useToast()

  const [categoryFormFields, setCategoryFormFields] = useState({
    filter_id: null,
    filter_name: null,
  });
  const [brandFormFields, setBrandFormFields] = useState({
    filter_id: null,
    filter_name: null,
  });

  const [isSubmit, setIsSubmit] = useState(false)
  const [isAction, setIsAction] = useState(false)


  useEffect(() => {
    if (
      categoryFormFields.filter_id &&
   
      brandFormFields.filter_id 
    ) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [brandFormFields,categoryFormFields])


  const onClose = () => {
    setIsDialogOpen(false)
   
    setCategoryFormFields({
      filter_id: null,
      filter_name: null,
    })
    setBrandFormFields({
      filter_id: null,
      filter_name: null,
    })
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (
      !brandFormFields.filter_id ||
      !categoryFormFields.filter_id 
    ) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    

    const formData = {
   
      category_id:categoryFormFields.filter_id,
      manufacturer_id: brandFormFields.filter_id,
    }

   

    try {
      setIsAction(true)
        const response = await axiosPrivate.post(
          `${ASSIGN_BRAND_URL}`,

          formData,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201 || response.status === 202 ||response.status === 200) {
          toast({
            title: "Success",
            description: "Product assignment started",
          });

        
          onClose();
        }

        return response;
      
    } catch (error) {
      // Handle the error
      // console.log(error)
      setIsAction(false)
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
    }finally{
      setIsAction(false)
    }
  }

  return (
    <Can permissions={["app_api.change_ocmanufacturer"]}>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className="h-[300px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>Link Brand</DialogTitle>
            <DialogDescription>
            Link brand to category. Click
              save when you are done.
            </DialogDescription>
          </DialogHeader>

         
            <div className="space-y-2 mt-4">
            <div className="w-full px-1 ">
                  <Label>Category</Label>
                  <CategoryAutocomplete
                  formFields={categoryFormFields}
                  setFormFields={setCategoryFormFields}
                 
                />
                </div>

                <div className="w-full px-1 mt-2">
                  <Label>Brand</Label>
                 
                  <BrandAutocomplete
                    formFields={brandFormFields}
                    setFormFields={setBrandFormFields}
                 
                  />
                </div>

              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSubmit} disabled={!isSubmit || isAction} >
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
            </div>
         
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </Can>
  )
}
