import { cn } from "@/lib/utils"
import { Toggle } from "./toggle"
import { Input } from "./input"
import { useEffect, useState } from "react"
import { Check, SlidersHorizontal } from "lucide-react"
import { Button } from "./button"
import { Slider } from "./slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ColorPicker = ({ value = "", handleColorClick = () => {} }) => {
  const colors = [
    "#7F77F1",
    "#6985FF",
    "#40A6E6",
    "#3FB1B2",
    "#64C6A2",
    "#33A069",
    "#F9BE33",
    "#E78945",
    "#DC646A",
    "#F17EAD",
    "#C580E6",
    "#BBA399",
    "#87909E",
    "#656F7D",
  ]

  const [redColorValue, setRedColorValue] = useState([0])
  const [greenColorValue, setGreenColorValue] = useState([0])
  const [blueColorValue, setBlueColorValue] = useState([0])
  const [isCustomColor, setIsCustomColor] = useState(false)

  useEffect(() => {
    const extractColorValues = () => {
      const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

      const hexMatches = value?.match(hexRegex)

      if (hexMatches) {
        setRedColorValue([parseInt(hexMatches[1], 16)])
        setGreenColorValue([parseInt(hexMatches[2], 16)])
        setBlueColorValue([parseInt(hexMatches[3], 16)])
      }
    }
    extractColorValues()
    

    if (!colors.some((item) => item === value)) {
      setIsCustomColor(true)
    } else {
      setIsCustomColor(false)
    }
  }, [value])
  const rgbToHex = (red, green, blue) => {
    // Ensure the values are within the valid range
    const clamp = (value) => Math.min(255, Math.max(0, value))

    // Convert each component to hex and concatenate them
    const toHex = (value) => {
      const hex = value.toString(16)
      return hex.length === 1 ? "0" + hex : hex // Ensure two digits
    }

    const r = toHex(clamp(red))
    const g = toHex(clamp(green))
    const b = toHex(clamp(blue))

    return `#${r}${g}${b}`
  }
  const handleSelectingCustomColor = () => {
    handleColorClick(rgbToHex(redColorValue, greenColorValue, blueColorValue))
  }

  return (
    <>
      {isCustomColor && (
        <div className="flex flex-col justify-start items-center w-full h-full border rounded-md px-2 py-2 relative">
          <div
            style={{
              background: `rgb(${redColorValue}, ${greenColorValue}, ${blueColorValue})`,
            }}
            className="rounded-sm h-[100px] w-full"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={handleSelectingCustomColor}
                  size="icon"
                  className="absolute top-3 right-3 rounded-full w-8 h-8 bg-white hover:bg-green-400 text-green-500 hover:text-white"
                >
                  <Check className="" size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="mt-5 flex flex-col justify-start items-center w-full h-full space-y-4">
            <div className="flex justify-between items-center w-full space-x-4 ">
              <Slider
                onValueChange={setRedColorValue}
                defaultValue={redColorValue}
                max={255}
                step={1}
              />
              <Input
                onChange={(e) => {
                  setRedColorValue(e.target.value)
                }}
                type="number"
                placeholder="10"
                max="255"
                style={{ maxInlineSize: "5rem" }}
                value={redColorValue}
                readOnly
              />
            </div>

            <div className="flex justify-between items-center w-full space-x-4">
              <Slider
                onValueChange={setGreenColorValue}
                defaultValue={greenColorValue}
                max={255}
                step={1}
              />

              <Input
                onChange={(e) => {
                  setGreenColorValue(e.target.value)
                }}
                type="number"
                placeholder="20"
                max="255"
                style={{ maxInlineSize: "5rem" }}
                value={greenColorValue}
                readOnly
              />
            </div>

            <div className="flex justify-between items-center w-full space-x-4">
              <Slider
                onValueChange={setBlueColorValue}
                defaultValue={[blueColorValue]}
                max={255}
                step={1}
              />

              <Input
                readOnly
                onChange={(e) => {
                  setBlueColorValue(e.target.value)
                }}
                type="number"
                placeholder="30"
                max="255"
                style={{ maxInlineSize: "5rem" }}
                value={blueColorValue}
              />
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-start items-center flex-wrap gap-2">
        {colors.map((color) => (
          <Toggle
            key={color}
            onClick={() => {
              handleColorClick(color)
            }}
            variant="outline"
            aria-label="Toggle italic"
            className={cn(
              "w-10   cursor-pointer",
              value?.toLowerCase() === color?.toLowerCase() &&
                "outline outline-2 outline-offset-2"
            )}
          >
            <span
              className={cn("w-8 rounded-full h-5 cursor-pointer")}
              style={{ backgroundColor: color }}
            />
          </Toggle>
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => {
                  setIsCustomColor(!isCustomColor)
                }}
                className=""
                size="icon"
                variant={isCustomColor ? "default" : "outline"}
              >
                <SlidersHorizontal size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Custom Color</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  )
}

export default ColorPicker
