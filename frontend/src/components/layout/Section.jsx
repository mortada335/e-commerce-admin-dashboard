import { cn } from "@/lib/utils"

const Section = ({ className, children }) => {
  return (
    <section
      className={cn(
        " font-roboto flex flex-col w-full  h-screen max-h-fit  justify-start items-center px-[20px] py-4 mb-8",
        className
      )}
    >
      {children}
    </section>
  )
}

export default Section
