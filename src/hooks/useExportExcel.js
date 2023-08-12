import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { APP_KEY_NAME } from "../constants/config";

export default function useExportExcel(fileName = APP_KEY_NAME) {
  const [excelData, setExcelData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);

  const handleExcelData = (headers, dataExcel) => {
    // const headers = ["No", "Section Name", "Status", "Order"];
    // const data = sections.map((section, index) => [
    //   index + 1,
    //   section.name,
    //   section.status === 1 ? "Active" : "Inactive",
    //   section.ordered,
    // ]);
    setExcelHeaders(headers);
    setExcelData(dataExcel);
  };

  useEffect(() => {
    if (excelData.length > 0 && excelHeaders.length > 0) handleExportExcel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelData, excelHeaders]);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([excelHeaders, ...excelData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return {
    handleExcelData,
  };
}
