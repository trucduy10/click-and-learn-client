import { useState } from "react";
import { LIMIT_PAGE } from "../constants/config";

export default function usePagination(
  initialPage = 1,
  defaultPageSize = LIMIT_PAGE
) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const startIndex = (currentPage - 1) * parseInt(defaultPageSize);
  const endIndex = startIndex + parseInt(defaultPageSize);

  const handleChangePage = (page) => setCurrentPage(page);
  return {
    currentPage,
    handleChangePage,
    startIndex,
    endIndex,
  };
}
