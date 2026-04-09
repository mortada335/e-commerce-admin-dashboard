import FilesDropzone from '@/components/ui/FilesDropzone'
import { Button } from '@/components/ui/button'
import { Card, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { Loader2, X } from 'lucide-react'
import  { useState } from 'react'

const ImagesTab = ({setCurrentStep,product}) => {
    const { toast } = useToast()
 
    const [mediaFields, setMediaFields] = useState([])
    const {
      mutate,
  
      isPending: isAction,
    } = useMutation("Product")
  

  
    const uploadImageFunction = async () => {
      if (!mediaFields.length) {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Please fill all the fields",
        })
      }
      const formData = new FormData()
      formData.append("product_id", product?.data?.product_id)
      formData.append(
        "sort_id",
        JSON.stringify(mediaFields.map((image) => image.sort_order))
      )
  
      // Loop through mediaFields and append files to FormData
      mediaFields.forEach((item, index) => {
        if (item.file) {
          formData.append(`images[${index}]`, item.file)
        }
      })
  
      mutate({
        url: "product_images/",
  
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onFinish: () => {
          setMediaFields([])
      
        },
        formData,
      })
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
  return (
    <Card className="w-full flex flex-col justify-between items-end pt-10 px-8 gap-4">
    <FilesDropzone
      className={"w-full"}
      currentFiles={product?.data?.images || []}
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
                    URL.revokeObjectURL(file.preview)
                  }}
                  className="h-20 w-full rounded-sm  object-cover  "
                />
                {/* <Text className={"truncate w-full"} text={file.name} /> */}

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
                  onChange={(e) => handleChangeImageOrder(e, index)}
                />
              </li>
            ))}
        </div>
      </div>
    )}

    <CardFooter className="gap-4">
      <Button type="button" variant="destructive"  onClick={() => {
                        setCurrentStep("other")
                      }}>
        Cancel
      </Button>
      <Button
        disabled={!mediaFields.length || isAction || !product?.data?.product_id}
        onClick={uploadImageFunction}
        type="button"
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
    </CardFooter>
  </Card>
  )
}

export default ImagesTab