import { useState } from "react";

export default function useClickToggleBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const handleToggleBoolean = () => setValue(!value);
  return {
    value,
    handleToggleBoolean,
  };
}
