// useCookie.js
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useCookie = (cookieName) => {
  const [cookieValue, setCookieValue] = useState(Cookies.get(cookieName));

  useEffect(() => {
    const handleCookieChange = () => {
      const newValue = Cookies.get(cookieName);
      if (newValue !== cookieValue) {
        setCookieValue(newValue);
      }
    };

    // Đăng ký sự kiện để theo dõi sự thay đổi của cookie
    const observer = new MutationObserver(handleCookieChange);
    observer.observe(document, { attributes: true, childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [cookieName, cookieValue]);

  return cookieValue;
};

export default useCookie;
