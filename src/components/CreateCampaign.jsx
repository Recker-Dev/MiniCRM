"use client";
import React from "react";
import { toast } from 'sonner';
import RuleGroup from "@/components/RuleGroup";
import useCampaignStore from "@/stores/campaignStore";
import AiPersonalizedMessageBuilder from "@/components/AiPersonalizedMessageBuilder";
import AiRuleBuilder from "@/components/AiRuleBuilder";
import { getCustomerDetails } from "@/lib/services";
import { EyeIcon, UserGroupIcon } from "@heroicons/react/24/solid";

const CreateCampaign = ({ attributes, operators }) => {
  const campaignName = useCampaignStore((s) => s.campaignName);
  const setCampaignName = useCampaignStore((s) => s.setCampaignName);
  const personalizedMessage = useCampaignStore((s) => s.personalizedMessage);
  const setPersonalizedMessage = useCampaignStore((s) => s.setPersonalizedMessage);
  const ruleGroup = useCampaignStore((s) => s.ruleGroup);
  const audienceSize = useCampaignStore((s) => s.audienceSize);
  const setAudienceSize = useCampaignStore((s) => s.setAudienceSize);
  const setCustomers = useCampaignStore((s) => s.setCustomers);
  const setModalOpen = useCampaignStore((s) => s.setModalOpen);



  const handleGetEstimate = async () => {
    try {
      const { size, customers } = await getCustomerDetails(ruleGroup);
      setAudienceSize(size);
      setCustomers(customers);
      toast.success(`Successfully estimated audience size: ${size} customers.`);
    } catch (err) {
      toast.error("Failed to get audience estimate. Please check your rules.");
      setAudienceSize(null);
    }
  };

  const handlePreviewCampaign = () => {
    if (!campaignName.trim() || !personalizedMessage.trim() || !audienceSize) {
      toast.error("Please fill in campaign name, message, and select an audience.");
      return;
    }
    setModalOpen(true);
  };

  const handleCancel = () => {
    setAudienceSize(null);
    setPersonalizedMessage('');
    setCampaignName('');
    setCustomers([]);
    useCampaignStore.getState().setView("campaign-history");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
        Create New Campaign
      </h2>
      <div className="space-y-6 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="campaign-name"
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            Campaign Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="campaign-name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="e.g., Summer Sale 2024"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="personalized-message"
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            Personalized Message <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <AiPersonalizedMessageBuilder />
            <textarea
              id="personalized-message"
              value={personalizedMessage}
              onChange={(e) => setPersonalizedMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
              rows="5"
              placeholder="Example: Hi {{name}}, we’re offering an exclusive deal just for our {{city}} customers! Don’t miss out 🎉"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            <span className="font-medium">Available variables:</span>{' '}
            {'{{name}}'}, {'{{city}}'}
          </p>

        </div>
      </div>

      <div className="relative">
        <AiRuleBuilder />
        <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl mb-6">
          <p className="font-semibold text-gray-700 mb-4">Define your audience segment:</p>
          <RuleGroup
            group={ruleGroup}
            attributes={attributes}
            operators={operators}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGetEstimate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center space-x-2 animate-pulse-once"
        >
          <span>Get Audience Estimate</span>
        </button>
      </div>

      {audienceSize !== null && (
        <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 text-purple-800 rounded-xl text-center font-semibold shadow-md border-2 border-purple-200 transition-all duration-500 ease-in-out transform scale-100 opacity-100 animate-slide-in">
          <div className="flex items-center justify-center space-x-3">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
            <span className="text-xl">Estimated Audience Size: <span className="font-bold">{audienceSize}</span></span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4">
        <button
          onClick={handleCancel}
          className="w-full sm:w-auto px-6 py-3 bg-red-200 text-gray-800 rounded-lg hover:bg-red-300 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handlePreviewCampaign}
          disabled={!campaignName.trim() || !personalizedMessage.trim() || !audienceSize}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center space-x-2 ${!campaignName.trim() || !personalizedMessage.trim() || !audienceSize
            ? "bg-gray-400 cursor-not-allowed text-gray-700"
            : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          <EyeIcon className="h-5 w-5" />
          <span>Preview Campaign</span>
        </button>
      </div>
    </div>
  );
};

export default CreateCampaign;