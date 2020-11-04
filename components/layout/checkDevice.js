import * as React from "react";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";

const CheckDevice = (props) => {

    const [windowDimension, setWindowDimension] = React.useState(null);
    const [loadingDimension, setloadingDimension] = React.useState(true);

    React.useEffect(() => {
      setloadingDimension(false)
      setWindowDimension(window.innerWidth);
    }, []);

    React.useEffect(() => {
      function handleResize() {
        setloadingDimension(false)
        setWindowDimension(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const isMobile = windowDimension <= 640 && !loadingDimension;
  return (
    <div>
    {
        (isMobile)
        ? (
            <BottomNavbar {...props} />
          )
        :
         (
           <div></div>
          )
    }
    </div>
  )
}

export default (CheckDevice);