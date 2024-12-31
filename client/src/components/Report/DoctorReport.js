import React, { useState } from "react";
import axios from "axios";

const DoctorReport = () => {
  const [reports, setReports] = useState(null);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const userData = await axios.get("http://localhost:3000/getuser",{
          headers: { token: token },
        });
      const doctorId = userData.data.user._id;

      const response = await axios.post(
        "http://localhost:3000/transaction/getreport",
        { doctorId},
        { headers: { token } }
      );
      const data = response.data;
      console.log(data)
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Doctor Report</h1>
      <div>
        <button onClick={fetchReports}>Generate Report</button>
      </div>

      {reports && (
        <div>
          <h2>Doctors Earnings Report</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Consultation Fee</th>
                <th>Discount Given</th>
                <th>Net Earning</th>
              </tr>
            </thead>
            <tbody>
              {reports.walletTransactionsReport.map((item, index) => (
                <tr key={index}>
                  <td>{item.patientName}</td>
                  <td>{item.consultationFee}</td>
                  <td>{item.discount}</td>
                  <td>{item.finalWalletDeduction}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Summary Report</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Total Discounts</th>
                <th>Total Doctor Earnings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{reports.systemSummaryReport.totalDiscounts}</td>
                <td>{reports.systemSummaryReport.totalDoctorEarnings}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorReport;
