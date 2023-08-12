import { useState } from "react";

// Used for checkbox Checked and UnChecked
export default function useOnChangeCheckBox(
  setValue,
  field,
  initialValue = false
) {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    setValue(field, newValue);
  };

  return [isChecked, handleChange];
}
