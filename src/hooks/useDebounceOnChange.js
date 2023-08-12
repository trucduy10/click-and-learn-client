import { debounce } from "lodash";
import { useEffect, useState } from "react";

// After time will OnChange value
export default function useDebounceOnChange(
  initialValue = "",
  delayTime = 1000
) {
  const [debounceValue, setDebounceValue] = useState(initialValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(initialValue);
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime, initialValue]);

  return debounceValue;
}
