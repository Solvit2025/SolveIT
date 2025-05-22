"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { getUserInteractionLogs } from "@/lib/apis";

// Utility to format dates as 'YYYY-MM-DD'
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

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

const tryParseJSON = (str) => {
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed.answer || JSON.stringify(parsed);
    }
    return str;
  } catch (e) {
    return str;
  }
};

const RequestLogTable = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const data = await getUserInteractionLogs(start, end);
      setInteractions(data.interactions || []);

    } catch (err) {
      console.error("Failed to load interaction logs", err);
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
      {/* Date Filters */}
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


      {/* Logs Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
        {loading ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Loading services...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-blue-100 dark:bg-blue-900">
              <tr>
                {["Timestamp", "Request", "Type", "Response", "Status", "Service", "Company"].map((col, i) => (
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
              {interactions.length > 0 ? (
                interactions.map((interaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300 whitespace-nowrap">
                      {new Date(interaction.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white max-w-[240px] truncate">
                      {interaction.request_content || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {interaction.request_type || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white max-w-[240px] truncate">
                      {interaction.response_content
                        ? tryParseJSON(interaction.response_content)
                        : <span className="italic text-gray-400">No response</span>}
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
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {interaction.service_category || "N/A"}
                    </td>
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
        )}
      </div>
    </div>
  );
};

export default RequestLogTable;
