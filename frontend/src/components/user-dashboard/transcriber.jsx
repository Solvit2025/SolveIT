"use client";

import "../../styles/globals.css";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../ui/tabs";

import UserRequestPanel from "./service/userRequestPannel";
import RequestSpecialistResponseTable from "./tables/requestSpecialistResponseTable";
import RequestLogTable from "./tables/requestLogTable";

const Transcriber = () => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="min-h-screen default_bg_theme p-6">
      <div className="overflow-x-auto w-full sm:w-[90%] mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-10 flex items-center gap-4">
          <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-lg text-base font-semibold">
            Welcome
          </span>
          User Dashboard
        </h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex justify-start gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
            {[
              { value: "main", label: "🧑 User Request" },
              { value: "history", label: "📜 History" },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={`px-4 py-2 rounded-t-lg font-medium transition-all duration-300
                  data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                  hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                  dark:data-[state=active]:text-blue-400 dark:hover:text-blue-300`}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "main" && (
              <TabsContent
                value="main"
                className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-6"
                forceMount
              >
                <UserRequestPanel />
                <div className="tiles_theme rounded-lg shadow-lg p-6">
                  <h2 className="text-xl title mb-6">Specialist Response For Pending Request</h2>
                  <RequestSpecialistResponseTable />
                </div>
              </TabsContent>
            )}

            {activeTab === "history" && (
              <TabsContent value="history" forceMount>
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tiles_theme p-4 rounded-xl border border-gray-200">
                    <h3 className="text-xl title mb-4">Interaction History</h3>
                    <RequestLogTable />
                  </div>
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default Transcriber;
