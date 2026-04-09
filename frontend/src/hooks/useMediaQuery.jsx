import { useState, useEffect } from "react"

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handleMediaQueryChange = (event) => {
      setMatches(event.matches)
    }

    // Initial check
    setMatches(mediaQuery.matches)

    // Add listener for changes
    mediaQuery.addListener(handleMediaQueryChange)

    // Cleanup function
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange)
    }
  }, [query])

  return matches
}
