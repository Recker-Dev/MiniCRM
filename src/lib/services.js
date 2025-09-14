const axios = require('axios');

export async function getCustomerDetails(ruleGroup) {
  try {
    // console.log(ruleGroup);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/customers/get`, ruleGroup);

    if (Array.isArray(response.data)) {
      return {
        size: response.data.length,
        customers: response.data
      };
    } else {
      return {
        size: 0,
        customers: []
      };
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(`Error getting customer: ${error.response.data.message}`);
    } else {
      console.error(`Error getting customer: ${error.message}`);
    }
    return { size: 0, customers: [] };
  }
};

export const getUserCampaigns = async (userId) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/campaigns/get`,
      userId 
    );

    return response.data; // expect array of campaigns
  } catch (error) {
    console.error("Error fetching campaigns:", error.response?.data || error.message);
    throw error;
  }
};

export const saveCampaignApi = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/campaigns`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error saving campaign:", error.response?.data || error.message);
    throw error;
  }
};

export async function generateAISuggestions(campaignName, campaignObjective) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/ai/campaign`, {
      campaignName,
      campaignObjective,
    });

    if (response.data.suggestions && Array.isArray(response.data.suggestions)) {
      return { success: true, suggestions: response.data.suggestions };
    } else {
      console.error("Invalid AI response:", response.data);
      return { success: false, suggestions: [] };
    }
  } catch (error) {
    if (error.response) {
      console.error("Error in generateAISuggestions service:", error.response.data);
    } else {
      console.error("Error in generateAISuggestions service:", error.message);
    }
    return { success: false, suggestions: [] };
  }
}


export async function generateAIRules(query) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/ai/dynamic`, {
      query,
    });

    if (response.data && typeof response.data.ruleGroup === "object") {
      return { success: true, ruleGroup: response.data.ruleGroup };
    }

    return { success: false, ruleGroup: null };
  } catch (err) {
    console.error("generateAIRules service error:", err.message);
    return { success: false, ruleGroup: null };
  }
}