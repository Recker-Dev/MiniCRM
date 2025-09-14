"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { SparklesIcon } from "@heroicons/react/24/solid";
import useCampaignStore from "@/stores/campaignStore";
import { generateAIRules } from "@/lib/services";

const AiRuleBuilder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAISuggestionModalOpen, setAISuggestionModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const aiBadgeRef = useRef(null);
    const setRuleGroup = useCampaignStore((s) => s.setRuleGroup);

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

    
    const handleGenerateAIRules = async () => {
        try {
            setIsLoading(true);
            const query = aiPrompt.trim();

            if (query == "") {
                toast.error("Query is needed!");
                return;
            }

            const { success, ruleGroup } = await generateAIRules(query);

            if (success && typeof ruleGroup === "object") {
                setRuleGroup(ruleGroup);
            } else {
                console.error("Invalid AI response");
            }
        } catch (err) {
            console.error("Error generating AI rules:", err);
        } finally {
            setIsLoading(false);
            setAISuggestionModalOpen(false);
            setAiPrompt("");
        }
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
                <div className="absolute -right-4 top-16 w-85 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                        Get AI to Build Rules
                    </h3>

                    <div>
                        <label htmlFor="aiPrompt" className="sr-only">
                            Prompt for AI
                        </label>
                        <textarea
                            id="aiPrompt"
                            rows="6"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full rounded-lg text-sm border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                            placeholder="Describe the rules you want to build, e.g., 'total_spend > 500 in New York' or 'users with last_order_date > 30'. This is a prototype — results may not be 100% accurate, so clearer instructions yield better suggestions.">
                        </textarea>
                    </div>

                    <button
                        onClick={handleGenerateAIRules}
                        disabled={isLoading}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ease-in-out
                            ${isLoading
                                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                : "text-white bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isLoading ? "Generating..." : "Generate"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AiRuleBuilder;
