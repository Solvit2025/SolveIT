"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Loader2, Play, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { getServiceItemsByCompany, submitUserRequest } from "@/lib/apis";

const UserRequestPanel = () => {
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState("idle");

  const [selectedCompany, setSelectedCompany] = useState("");
  const [serviceItemsByCompany, setServiceItemsByCompany] = useState({});
  const [serviceItems, setServiceItems] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const selectedServiceName =
    serviceItems.find((item) => item.id === selectedService)?.name || "";

  // Fetch companies and service topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getServiceItemsByCompany();
        const mapping = {};
        response.data.forEach((entry) => {
          mapping[entry.company_name] = entry.service_categories.map((name, idx) => ({
            id: `${idx + 1}`,
            name,
          }));
        });
        setServiceItemsByCompany(mapping);
      } catch (error) {
        toast.error("Unable to load service categories.");
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedCompany && serviceItemsByCompany[selectedCompany]) {
      setServiceItems(serviceItemsByCompany[selectedCompany]);
      setSelectedService("");
    } else {
      setServiceItems([]);
    }
  }, [selectedCompany, serviceItemsByCompany]);

  const toggleListening = () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsListening(false);
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          mediaRecorderRef.current = new MediaRecorder(stream);
          const chunks = [];

          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            setAudioBlob(blob);
            setTranscript("🎙 Audio recorded.");
          };

          mediaRecorderRef.current.start();
          setTranscript("");
          setAudioBlob(null);
          setIsListening(true);
        })
        .catch(() => toast.error("Microphone access denied."));
    }
  };

  const handleSendRequest = async () => {
    const isAudioOnly = audioBlob && !transcript.trim();

    if (!transcript.trim() && !audioBlob) {
      toast.error("Please enter a message or record audio.");
      return;
    }

    if (!selectedCompany || !selectedService) {
      toast.error("Please select a company and service.");
      return;
    }

    setIsProcessing(true);
    setResponseStatus("processing");

    try {
      const result = await submitUserRequest({
        companyName: selectedCompany,
        serviceCategory: selectedServiceName,
        requestText: transcript.trim() || "", // for text or fallback
        audioFile: audioBlob ? new File([audioBlob], "recording.webm", { type: "audio/webm" }) : null,
      });

      if (result.answer) {
        setResponse(result.answer);
        setResponseStatus("completed");
      } else {
        setResponse(result.message || "Your request is under review.");
        setResponseStatus("idle");
      }
    } catch (err) {
      toast.error(err.message || "Submission failed.");
      setResponse("An error occurred while processing your request.");
      setResponseStatus("idle");
    } finally {
      setIsProcessing(false);
      setAudioBlob(null);
    }
  };

  return (
    <div className="rounded-xl shadow-lg p-6 space-y-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Service Selection */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Service Category</h2>
        <div className="space-y-4">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2 rounded-md"
          >
            <option value="">Select a company</option>
            {Object.keys(serviceItemsByCompany).map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            disabled={!selectedCompany || serviceItems.length === 0}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2 rounded-md"
          >
            <option value="">Select a service item</option>
            {serviceItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Voice Input / Text Message */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Voice or Text Input</h2>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={5}
          placeholder="Type your message or record voice..."
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 rounded-md resize-none text-sm"
        />
        {audioBlob && (
          <p className="text-xs text-blue-500 mt-1">✅ Audio recorded and ready to send.</p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md shadow ${
              isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Mic className="w-4 h-4" />
            {isListening ? "Stop" : "Record"}
          </button>

          <button
            onClick={handleSendRequest}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md shadow"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>

          {isProcessing && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
        </div>
      </section>

      {/* AI Response */}
      <section>
        <h2 className="text-lg font-semibold mb-4">AI Response</h2>
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              responseStatus === "processing"
                ? "bg-yellow-100 text-yellow-800"
                : responseStatus === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {responseStatus}
          </span>
          {response && (
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <Play className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-4 rounded-md min-h-[100px] text-sm text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          {response || "Response will appear here..."}
        </div>
      </section>
    </div>
  );
};

export default UserRequestPanel;
