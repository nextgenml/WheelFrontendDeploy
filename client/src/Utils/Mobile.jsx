import { useState, useEffect } from "react";

// Custom hook to detect mobile view
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Set isMobile to true if the viewport width is less than a certain threshold (e.g., 768 pixels)
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check on mount
    handleResize();

    // Attach the event listener to handle window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return isMobile;
}

export default useIsMobile;
