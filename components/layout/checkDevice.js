import * as React from "react";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";

const CheckDevice = (props) => {

    const [windowDimension, setWindowDimension] = React.useState(null);

  React.useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  React.useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowDimension <= 640;
  return (
    <div>
    {
        (isMobile)
        ? (
            <BottomNavbar {...props} />
          )
        :
         (
            <Navbar {...props} />
          )
    }
    </div>
  )
}

export default (CheckDevice);