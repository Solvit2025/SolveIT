"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import RegisteredServicesTable from "@/components/company-dashboard/tables/registeredServicesTable";
import ServicesLogTable from "@/components/company-dashboard/tables/servicesLogTable";
import ServicesSpecialistResponseTable from "@/components/company-dashboard/tables/servicesSpecialistResponseTable";

const TABS = [
  { key: "waiting", label: "Waiting Response" },
  { key: "registered", label: "Registered Services" },
  { key: "history", label: "History" },
];

const DashboardCompanyPage = () => {
  const [activeTab, setActiveTab] = useState("waiting");

  return (
    <>
      <Breadcrumb pageName="Company Dashboard" />

      <div className="container mx-auto px-4 mt-10 space-y-8">
        {/* Clear & Modern Tabs */}
        <div className="flex gap-6 border-b border-gray-300 dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 relative text-base font-semibold transition-colors duration-300
                ${
                  activeTab === tab.key
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content with Fixed Height */}
        <div className="tiles_theme p-6 rounded-lg shadow-lg h-[800px] overflow-y-auto bg-white dark:bg-gray-800">
          {activeTab === "waiting" && <ServicesSpecialistResponseTable />}
          {activeTab === "registered" && <RegisteredServicesTable />}
          {activeTab === "history" && <ServicesLogTable />}
        </div>
      </div>
    </>
  );
};

export default DashboardCompanyPage;
