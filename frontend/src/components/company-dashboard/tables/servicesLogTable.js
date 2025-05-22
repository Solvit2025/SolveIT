"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { getCompanyInteractionLogs } from "@/lib/apis";

// Utility to format dates as 'YYYY-MM-DD'
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Status helpers
const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const ServicesLogTable = () => {
  // Initial date range: past 30 days
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        console.warn("Start date must be before end date");
        setInteractions([]);
        return;
      }
      const data = await getCompanyInteractionLogs(startDate, endDate);
      setInteractions(data.interactions || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setInteractions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ml-2 px-2 py-1 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </label>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="ml-2 px-2 py-1 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </label>
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-blue-100 dark:bg-blue-900">
            <tr>
              {["Timestamp", "Request", "Type", "Response", "Status", "Service Category", "Company"].map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-white uppercase text-xs tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Loading services...</span>
                  </div>
                </td>
              </tr>
            ) : interactions.length > 0 ? (
              interactions.map((interaction) => (
                <tr key={interaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-300 whitespace-nowrap">
                    {new Date(interaction.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white max-w-[200px] truncate">
                    {interaction.request_content}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{interaction.request_type}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white max-w-[200px] truncate">
                    {interaction.response_content || <span className="italic text-gray-400">No response</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        interaction.status
                      )}`}
                    >
                      {getStatusIcon(interaction.status)}
                      {interaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{interaction.service_category}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {interaction.business_phone_number || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No interactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesLogTable;
