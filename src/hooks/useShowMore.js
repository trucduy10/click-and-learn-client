import { useState } from "react";
import { LIMIT_SHOW_MORE } from "../constants/config";

export default function useShowMore(
  items,
  initialItemCount = LIMIT_SHOW_MORE,
  increment = LIMIT_SHOW_MORE
) {
  const [showItemsCount, setShowItemsCount] = useState(initialItemCount);

  const handleShowMore = () => {
    const newShowItemsCount = showItemsCount + increment;
    setShowItemsCount(newShowItemsCount);
  };

  const showItems = items?.slice(0, showItemsCount);
  const isRemain = showItemsCount < items.length;

  return {
    showItems,
    isRemain,
    handleShowMore,
  };
}
