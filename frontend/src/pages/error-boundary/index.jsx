import { Button } from "@/components/ui/button"
import { Component, ErrorInfo, ReactNode } from "react"

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError(_) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <section className="relative flex items-center w-full h-screen justify-evenly">
          <div className="flex flex-col  w-[90%] md:w-[75%] lg:w-[30%] h-full md:h-[70%] items-start justify-center space-y-2 md:space-y-8 z-10">
            <h1 className="text-2xl font-bold text-[#F4035A]">Oops...!</h1>
            <p className="font-bold text-7xl text-[#F4035A]">Network Issue</p>
            <p className="flex flex-col font-semibold text-[#898989]">
              <span>This page is currently not available</span>
              <span>check your connectivity and try again.</span>
            </p>
            <a href="/">
              <Button>Go to homepage</Button>
            </a>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
