import { useState } from "react";
import { convertIntToStrMoney } from "../utils/helper";

export default function useOnChange(initialValue = null) {
  const [value, setValue] = useState(initialValue);
  const handleOnChange = (e) => {
    setValue(convertIntToStrMoney(e.target.value));
  };

  return [value, handleOnChange, setValue];
}
