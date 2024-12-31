import React, { useState } from "react";
import axios from "axios";

const PatientReport = () => {
  const [reports, setReports] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = await axios.get("http://localhost:3000/getuser",{
          headers: { token: token },
        });
      const patientId = userData.data.user._id;
      const response = await axios.post(
        "http://localhost:3000/transaction/getreport",
        { startDate, endDate,patientId },
        {
          headers: { token },
        }
      );
      const data = response.data;
      setReports(response.data);
      let saved = 0;
      let expense = 0;
      data.walletTransactionsReport.forEach((transaction) => {
        saved += transaction.discount || 0;
        expense += transaction.finalWalletDeduction || 0;
      });
      setTotalSaved(saved);
      setTotalExpense(expense);
    } catch (error) {
      console.error("Error fetching reports:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Patient Report</h1>
      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchReports}>Generate Report</button>
      </div>

      {reports && (
        <div>
          <div>
            <h2>Summary</h2>
            <p><b>Total Saved from Discounts:</b> ${totalSaved.toFixed(2)}</p>
            <p><b>Total Expense:</b> ${totalExpense.toFixed(2)}</p>
          </div>
          <h2>Discount Usage Report</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Patient Name</th>
                <th>Consultation Date</th>
                <th>Discount Applied</th>
              </tr>
            </thead>
            <tbody>
              {reports.discountUsageReport.map((item, index) => (
                <tr key={index}>
                  <td>{item.doctorName}</td>
                  <td>{item.patientName}</td>
                  <td>{new Date(item.consultationDate).toLocaleDateString()}</td>
                  <td>{item.discountApplied}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Wallet Transactions Report</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Consultation Fee</th>
                <th>Discount</th>
                <th>Final Wallet Deduction</th>
              </tr>
            </thead>
            <tbody>
              {reports.walletTransactionsReport.map((item, index) => (
                <tr key={index}>
                  <td>{item.patientName}</td>
                  <td>{item.doctorName}</td>
                  <td>{item.consultationFee}</td>
                  <td>{item.discount}</td>
                  <td>{item.finalWalletDeduction}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>System Summary Report</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Total Discounts</th>
                <th>Total Wallet Deductions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{reports.systemSummaryReport.totalDiscounts}</td>
                <td>{reports.systemSummaryReport.totalWalletDeductions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientReport;
