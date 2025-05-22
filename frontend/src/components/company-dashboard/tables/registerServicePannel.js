"use client";

import React, { useState } from "react";
import {
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Upload,

} from "lucide-react";
import { registerServiceDocument } from "@/lib/apis";
import { toast } from "react-hot-toast";

const RegisterServicePannel = () => {
  const [formData, setFormData] = useState({
    topics: [],
    escalationEmail: "",
    escalationPhone: "",
  });
  const [newTopic, setNewTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const handleReset = () => {
    setFormData({
      topics: [],
      escalationEmail: "",
      escalationPhone: "",
    });
    setNewTopic("");
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topics.length) {
      toast.error("Please add at least one service topic.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (!formData.escalationEmail || !formData.escalationPhone) {
      toast.error("Please provide escalation contact details.");
      return;
    }

    setIsSubmitting(true);

    try {
      for (const topic of formData.topics) {
        await registerServiceDocument({
          serviceCategory: topic,
          contactEmail: formData.escalationEmail,
          contactPhone: formData.escalationPhone,
          file: selectedFile,
        });
      }

      toast.success("All services registered successfully!");
      handleReset();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tiles_theme rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Register New Service</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Topics */}
        <div>
          <label className="block mb-2 font-medium">Service Topics</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add new topic"
              className="border px-3 py-2 rounded w-full"
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2 mt-3">
            {formData.topics.map((topic, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>{topic}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(index)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-2 font-medium">Q&A PDF</label>
          <div className="border-2 border-dashed p-6 rounded-lg text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500">Drag or click to upload PDF</p>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              Select file
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">{selectedFile.name}</p>
            )}
          </div>
        </div>

        {/* Contacts */}
        <div>
          <label className="block mb-2 font-medium">Escalation Contacts</label>
          <div className="space-y-4">
            <input
              type="email"
              name="escalationEmail"
              value={formData.escalationEmail}
              onChange={handleChange}
              placeholder="Email"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="tel"
              name="escalationPhone"
              value={formData.escalationPhone}
              onChange={handleChange}
              placeholder="Phone"
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 border border-gray-400 px-4 py-2 rounded"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterServicePannel;
