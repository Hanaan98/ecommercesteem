import "./App.css";
import BulkPayslipUploader from "./components/BulkPayslipUploader";
import PayslipGenerator from "./components/PayslipGenerator";
import Pdf from "./components/Pdf";
import { useState } from "react";
function App() {
  const [form, setForm] = useState({
    name: "",
    id: "",
    payMonth: "",
    paidOn: "",
    addHours: 0,
    extras: 0,
    salary: "",
    tax: 0,
    netPay: 0,
  });

  return (
    <>
      <BulkPayslipUploader />
      {/* <PayslipGenerator form={form} setForm={setForm} />
      <Pdf
        name={form.name}
        id={form.id}
        payMonth={form.payMonth}
        paidOn={form.paidOn}
        extras={form.extras}
        salary={form.salary}
        tax={form.tax}
        netpay={form.netPay}
        setForm={setForm}
      /> */}
    </>
  );
}

export default App;
