
import React from "react"
import { useState, useRef, cloneElement } from "react"
import { Download, ZoomIn, X } from "lucide-react"
import { Dialog, DialogContent, DialogClose } from "./dialog"
import { Button } from "./button"



export function ImagePreviewer({ children, className = "", downloadLink = null, altSrc }) {
  const [open, setOpen] = useState(false)
  const imageRef = useRef(null)


  // Clone the child element and add our ref and click handler
  const enhancedChild = cloneElement(children, {
    ref: imageRef,
    onClick: (e) => {
      e.stopPropagation()
      setOpen(true)

      // Call the original onClick if it exists
      if (children.props.onClick) {
        children.props.onClick(e)
      }
    },
    className: `cursor-zoom-in ${children.props.className || ""}`,
  })

  return (
    <>
      <div className={`group relative overflow-hidden ${className}`}>
        {enhancedChild}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <ZoomIn className="text-white w-8 h-8" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
          <div className="relative">
            <DialogClose className="absolute right-2 top-2 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>

            <div className="p-1">
              <div className="relative overflow-hidden rounded-md">
                {altSrc && (
                  <img
                    src={altSrc || "/placeholder.svg"}
                    alt={altSrc}
                    className="object-contain max-h-[70vh] w-auto mx-auto"
                  />
                )}
              </div>
            </div>
            {downloadLink !== null && 
            <div className="p-4 flex justify-between items-center border-t">
              <Button size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                {'Download'}
              </Button>
            </div>}
   
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

