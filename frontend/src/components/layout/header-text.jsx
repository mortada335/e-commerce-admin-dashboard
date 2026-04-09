import { cn } from "@/lib/utils"

const HeaderText = ({ className, text }) => {
  return (
    <h2
      className={cn(
        "text-lg md:text-xl lg:text-2xl  !text-foreground dark:!text-foreground font-semibold leading-none tracking-tight",
        className
      )}
    >
      {text}
    </h2>
  )
}

export default HeaderText
