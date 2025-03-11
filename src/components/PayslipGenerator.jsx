// Function to calculate tax based on Pakistan's latest tax slabs
const calculateMonthlyTax = (monthlySalary) => {
  const salary = Number(monthlySalary);
  if (salary <= 50000) return 0;
  if (salary <= 100000) return (salary - 50000) * 0.05;
  if (salary <= 183333) return 2500 + (salary - 100000) * 0.15;
  if (salary <= 266667) return 15000 + (salary - 183333) * 0.25;
  if (salary <= 341667) return 35833 + (salary - 266667) * 0.3;
  return 62500 + (salary - 341667) * 0.35;
};

// Payslip Generator Component
const PayslipGenerator = ({ form, setForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    if (name === "salary") {
      const salary = parseFloat(value) || 0;
      const tax = calculateMonthlyTax(salary);
      const extras = (salary / 160) * (parseFloat(newForm.addHours) || 0);
      const netPay = salary + extras - tax;

      newForm = { ...newForm, tax, netPay, extras };
    } else if (name === "addHours") {
      const extras =
        (parseFloat(newForm.salary) / 160) * (parseFloat(value) || 0);
      const netPay =
        parseFloat(newForm.salary) + extras - parseFloat(newForm.tax);

      newForm = { ...newForm, netPay, extras };
    } else if (name === "paidOn") {
      const date = new Date(`${value}T00:00:00`);
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

      const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;

      newForm = { ...newForm, payMonth: month, paidOn: formattedDate };
    }

    setForm(newForm);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Generate Payslip</h2>
      <div className="space-y-2">
        <input
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="id"
          placeholder="Employee ID"
          onChange={handleChange}
          value={form.id}
          className="w-full p-2 border rounded"
        />
        <input
          name="addHours"
          placeholder="Additional Hours"
          onChange={handleChange}
          value={form.addHours}
          className="w-full p-2 border rounded"
        />
        <input
          name="salary"
          placeholder="Basic Salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="paidOn"
          placeholder="Paid On"
          type="date"
          value={form.paidOn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default PayslipGenerator;
