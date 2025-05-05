import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { useDropzone } from "react-dropzone";
import MyDocument from "./MyDocument";

const calculateMonthlyTax = (monthlySalary) => {
  const salary = Number(monthlySalary) || 0;
  if (salary < 50000) return 0;

  let annualSalary = salary * 12;
  let tax = 0;
  if (annualSalary >= 600000 && annualSalary < 1200000) {
    tax = (annualSalary - 600000) * 0.05;
  } else if (annualSalary >= 1200000 && annualSalary < 1800000) {
    tax = (annualSalary - 1200000) * 0.1 + 30000;
  } else if (annualSalary >= 1800000 && annualSalary < 2500000) {
    tax = (annualSalary - 1800000) * 0.15 + 90000;
  } else if (annualSalary >= 2500000 && annualSalary < 3500000) {
    tax = (annualSalary - 2500000) * 0.175 + 195000;
  } else if (annualSalary >= 3500000 && annualSalary < 5000000) {
    tax = (annualSalary - 3500000) * 0.2 + 370000;
  }
  return Math.round(tax / 12);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Invalid Date";

  let date;
  if (!isNaN(dateValue) && Number(dateValue) > 10000) {
    date = new Date((Number(dateValue) - 25569) * 86400000);
  } else {
    date = new Date(dateValue);
  }

  if (isNaN(date.getTime())) return "Invalid Date";

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
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setProgress(null);

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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv, .xlsx",
  });

  const generatePayslips = async () => {
    if (employees.length === 0) {
      alert("No employee data found!");
      return;
    }

    setLoading(true);
    setProgress(`Preparing ${employees.length} payslips...`);
    const zip = new JSZip();

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const name = employee.name || "Unknown";
      const id = employee.id || "N/A";
      const salary = Math.round(parseFloat(employee.salary) || 0);
      const adjustments = Math.round(parseFloat(employee.adjustments) || 0);
      let additionalHours =
        employee.addHours || employee.additionalHours || "0";
      additionalHours = parseFloat(additionalHours.toString().trim()) || 0;

      const rawPaidOn = employee.paidOn;
      const formattedDate = formatDate(rawPaidOn);
      const payMonth = employee.payMonth;

      const tax = calculateMonthlyTax(salary);
      const extras =
        additionalHours > 0 ? Math.round((salary / 160) * additionalHours) : 0;
      const netpay = salary + extras + adjustments - tax;
      const email = employee.email;
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
          adjustments={adjustments}
        />
      );

      const blob = await pdf(payslip).toBlob();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email); // email must exist in CSV
      formData.append("payslip", blob, `Payslip-${name}.pdf`);

      try {
      await fetch("http://localhost:5000/send-email", {
      method: "POST",
      body: formData,
    });
    } catch (err) {
    console.error("Failed to send email to", name);
  }
      zip.file(`Payslip_${name.replace(/\s+/g, "_")}.pdf`, blob);

      setProgress(`Generating payslip ${i + 1} of ${employees.length}...`);
    }

    zip.generateAsync({ type: "blob" }).then((zipBlob) => {
      saveAs(zipBlob, "Payslips.zip");
      setLoading(false);
      setProgress("Download complete!");
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Employees Payslips
      </h2>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:border-blue-500 transition"
      >
        <input {...getInputProps()} />
        {fileName ? (
          <p className="text-gray-700">📂 {fileName} uploaded successfully</p>
        ) : isDragActive ? (
          <p className="text-gray-600">Drop the file here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop a file here, or click to select a file
          </p>
        )}
      </div>

      {progress && <p className="text-blue-500 mt-2 text-center">{progress}</p>}

      <button
        onClick={generatePayslips}
        className={`w-full p-3 rounded-lg mt-4 transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-blue-400"
        }`}
        disabled={loading}
      >
        {loading ? "Generating Payslips..." : "Download Payslips"}
      </button>
    </div>
  );
};

export default BulkPayslipUploader;
