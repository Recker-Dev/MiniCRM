"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { SparklesIcon } from "@heroicons/react/24/solid";
import useCampaignStore from "@/stores/campaignStore";
import { generateAISuggestions } from "@/lib/services";

const AiPersonalizedMessageBuilder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAISuggestionModalOpen, setAISuggestionModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const aiBadgeRef = useRef(null);
  const setPersonalizedMessage = useCampaignStore((s) => s.setPersonalizedMessage);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        aiBadgeRef.current &&
        !aiBadgeRef.current.contains(event.target) &&
        !isLoading
      ) {
        setAISuggestionModalOpen(false);
      }
    };

    if (isAISuggestionModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAISuggestionModalOpen, isLoading]);


  const handleGenerateAISuggestions = async () => {
    try {
      setIsLoading(true);
      const campaignName = useCampaignStore.getState().campaignName;
      const campaignObjective = aiPrompt.trim();

      if (campaignName == "" || campaignObjective == "") {
        toast.error("Campaign name and objective is needed!");
        return;
      }

      const { success, suggestions } = await generateAISuggestions(
        campaignName,
        campaignObjective
      );

      if (success) {
        setAiSuggestions(suggestions);
      } else {
        console.error("Invalid AI response");
        setAiSuggestions([]);
      }
    } catch (err) {
      console.error("Error generating AI suggestions:", err);
      setAiSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setPersonalizedMessage(suggestion)
    setAISuggestionModalOpen(false);
  };

  return (
    <div className="relative w-full"
      ref={aiBadgeRef}>
      {/* Toggle button */}
      <button
        onClick={() => setAISuggestionModalOpen((prev) => !prev)}
        className="absolute -top-3 -right-3   font-bold text-white bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center shadow-md 
             transition duration-200 ease-in-out 
             hover:bg-blue-700 hover:scale-110 active:scale-95"

      >
        <SparklesIcon className="h-5 w-5" />
      </button>

      {/* Modal */}
      {isAISuggestionModalOpen && (
        <div className="absolute -right-4 top-16 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Get AI Suggestions
          </h3>

          <div>
            <label htmlFor="aiPrompt" className="sr-only">
              Prompt for AI
            </label>
            <textarea
              id="aiPrompt"
              rows="4"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full rounded-lg text-sm border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter the context or objective for this campaign, e.g., 'bring back inactive users' or 'promote new product launch'"
            ></textarea>
          </div>

          <button
            onClick={handleGenerateAISuggestions}
            disabled={isLoading}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ease-in-out
    ${isLoading
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>

          {aiSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Suggestions:</p>
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left p-3 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-150 ease-in-out"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiPersonalizedMessageBuilder;
