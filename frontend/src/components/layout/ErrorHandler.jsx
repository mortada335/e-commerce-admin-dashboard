import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import HeaderText from "./header-text"
import Text from "./text"

const ErrorHandler = ({ image, statusCode, title, description }) => {
  return (
    <div className="flex flex-col w-full justify-center items-center h-full gap-4 py-8">
      {image && (
        <img
          src={image}
          alt="error img"
          className="mx-auto h-[300px]  xl:h-[500px] w-[750px] object-contain"
        />
      )}

      <div className="flex flex-col text-center justify-center items-center">
        {statusCode && <HeaderText text={statusCode} />}
        {title && <HeaderText text={title} />}
        {description && <Text text={description} />}
      </div>

      <Link to={"/"}>
        <Button className="">Take me Home</Button>
      </Link>
    </div>
  )
}

export default ErrorHandler
