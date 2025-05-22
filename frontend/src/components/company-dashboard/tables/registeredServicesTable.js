"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, X,   Loader2 } from "lucide-react";
import RegisterServicePannel from "./registerServicePannel";
import { getCompanyServices } from "@/lib/apis";
import { toast } from "react-hot-toast";

const RegisteredServicesTable = () => {
  const [registeredServices, setRegisteredServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await getCompanyServices();
      setRegisteredServices(data);
    } catch (error) {
      console.error("Failed to load company services", error);
      toast.error("Failed to fetch registered services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleModalClose = async () => {
    setShowModal(false);
    setLoading(true);
    await fetchServices(); // 🔁 Refresh services after modal close
  };

  return (
    <div className="relative">
      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          showModal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow"
          >
            <Plus className="w-4 h-4" />
            New Service
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
          <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-blue-100 dark:bg-blue-900">
              <tr>
                <th className="w-[10%] px-4 py-3 text-left font-semibold text-gray-700 dark:text-white uppercase text-xs tracking-wider">
                  ID
                </th>
                <th className="w-[30%] px-4 py-3 text-left font-semibold text-gray-700 dark:text-white uppercase text-xs tracking-wider">
                  Service Topic
                </th>
                <th className="w-[40%] px-4 py-3 text-left font-semibold text-gray-700 dark:text-white uppercase text-xs tracking-wider">
                  PDF File
                </th>
                <th className="w-[20%] px-4 py-3 text-left font-semibold text-gray-700 dark:text-white uppercase text-xs tracking-wider">
                  Created At
                </th>
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
            ) : registeredServices.length > 0 ? (
                registeredServices.map((service) => {
                  const cleanedPath = service.pdf_filename.replace(/\\/g, "/");
                  const fileName = cleanedPath.split("/").pop();

                  return (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-300 font-medium whitespace-nowrap">
                        {service.id}
                      </td>
                      <td className="px-4 py-4 text-gray-900 dark:text-white font-semibold">
                        {service.service_category}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`/${cleanedPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="truncate">{fileName}</span>
                        </a>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {new Date(service.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-y-auto">
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <RegisterServicePannel onSuccess={handleModalClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredServicesTable;
