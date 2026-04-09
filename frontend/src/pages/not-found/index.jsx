import ErrorHandler from "@/components/layout/ErrorHandler"

import Image404 from "@/assets/images/not-found.png"
import Section from "@/components/layout/Section"
const index = () => {
  return (
    <Section>
      {" "}
      <ErrorHandler
        image={Image404}
        title="Oops!, we can’t find this page. It might have been removed or doesn’t exist anymore."
      />
    </Section>
  )
}

export default index
