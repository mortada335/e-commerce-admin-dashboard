import ErrorHandler from "@/components/layout/ErrorHandler"

import NotAuthorized from "@/assets/images/not-authorized.png"
import Section from "@/components/layout/Section"
const index = () => {
  return (
    <Section>
      {" "}
      <ErrorHandler
        image={NotAuthorized}
        title="Oops!, Your not authorize to visit this page."
      />
    </Section>
  )
}

export default index
