import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import MyDocument from "./MyDocument"; // Import your PDF document component

const calculateMonthlyTax = (monthlySalary) => {
  const salary = Number(monthlySalary) || 0;
  if (salary <= 50000) return 0;
  if (salary <= 100000) return Math.round((salary - 50000) * 0.05);
  if (salary <= 183333) return Math.round(2500 + (salary - 100000) * 0.15);
  if (salary <= 266667) return Math.round(15000 + (salary - 183333) * 0.25);
  if (salary <= 341667) return Math.round(35833 + (salary - 266667) * 0.3);
  return Math.round(62500 + (salary - 341667) * 0.35);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Invalid Date"; // Handle missing values

  let date;

  // Check if the date is a number (Excel stores dates as serial numbers)
  if (!isNaN(dateValue) && Number(dateValue) > 10000) {
    date = new Date((Number(dateValue) - 25569) * 86400000); // Convert Excel serial date to JS date
  } else {
    date = new Date(dateValue);
  }

  if (isNaN(date.getTime())) return "Invalid Date"; // Final fallback

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

const BulkPayslipUploader = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      if (file.name.endsWith(".csv")) {
        Papa.parse(target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => setEmployees(result.data),
        });
      } else {
        const workbook = XLSX.read(target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setEmployees(sheet);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const generatePayslips = async () => {
    if (employees.length === 0) {
      alert("No employee data found!");
      return;
    }

    setLoading(true);
    const zip = new JSZip();

    for (const employee of employees) {
      console.log("Raw Employee Data:", employee); // 🟢 Debug log

      const name = employee.name || "Unknown";
      const id = employee.id || "N/A";
      const salary = Math.round(parseFloat(employee.salary) || 0);

      let additionalHours =
        employee.addHours || employee.additionalHours || "0"; // Ensure correct key
      additionalHours = additionalHours.toString().trim(); // Remove any hidden spaces
      additionalHours = parseFloat(additionalHours); // Convert to number
      if (isNaN(additionalHours)) additionalHours = 0; // Ensure no NaN

      console.log(`Parsed Additional Hours for ${name}:`, additionalHours); // 🟢 Debug log

      const rawPaidOn = employee.paidOn;
      const formattedDate = formatDate(rawPaidOn);
      const payMonth = formattedDate.split(" ")[1] || "N/A";

      const tax = calculateMonthlyTax(salary);

      // ✅ Fix: Ensure correct extras calculation
      const extras =
        additionalHours > 0 ? Math.round((salary / 160) * additionalHours) : 0;

      console.log(`Calculated Extras for ${name}:`, extras); // 🟢 Debug log

      const netpay = salary + extras - tax;

      const payslip = (
        <MyDocument
          name={name}
          id={id}
          salary={salary}
          extras={extras}
          paidOn={formattedDate}
          payMonth={payMonth}
          tax={tax}
          netpay={netpay}
        />
      );

      const blob = await pdf(payslip).toBlob();
      zip.file(`Payslip_${name.replace(/\s+/g, "_")}.pdf`, blob);
    }

    zip.generateAsync({ type: "blob" }).then((zipBlob) => {
      saveAs(zipBlob, "Payslips.zip");
      setLoading(false);
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bulk Payslip Generator</h2>
      <input
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileUpload}
        className="w-full border p-2 mb-2"
      />
      <button
        onClick={generatePayslips}
        className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Generating PDFs..." : "Download Payslips"}
      </button>
    </div>
  );
};

export default BulkPayslipUploader;
