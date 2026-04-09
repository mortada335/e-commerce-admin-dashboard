import { Link } from "react-router-dom"
import { Button } from "../ui/button"
const websiteUrl = import.meta.env.VITE_APP_TAAWON_URL

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center w-full h-fit px-8">
      <div className="flex justify-center items-center flex-wrap text-sm">
        &copy; {new Date().getFullYear()}, Powered by
        <Link to={websiteUrl} target="_blank">
          <Button className="px-0 py-0" variant="link">
            &nbsp;{"Dashmerce"}&nbsp;
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center flex-wrap text-sm space-x-4">
        <Link to={websiteUrl} target="_blank">
          <Button className="px-0 py-0" variant="link">
            About Us
          </Button>
        </Link>
        <Link to={websiteUrl} target="_blank">
          <Button className="px-0 py-0" variant="link">
            Blog
          </Button>
        </Link>
        <Link to={websiteUrl} target="_blank">
          <Button className="px-0 py-0" variant="link">
            License
          </Button>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
