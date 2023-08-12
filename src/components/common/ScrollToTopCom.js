import React, { useEffect, useState } from "react";
import { IconArrowUpCom } from "../icon";

const ScrollToTopCom = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleScroll = () =>
    window.scrollY > 100
      ? setShowScrollButton(true)
      : setShowScrollButton(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`tap-top block z-20 animate-bounce tw-transition-all ${
          showScrollButton ? "opacity-60" : "opacity-0"
        }`}
        onClick={scrollToTop}
      >
        <IconArrowUpCom className="mx-auto" />
      </div>
    </>
  );
};

export default ScrollToTopCom;
