const axios = require('axios');

exports.getCustomerDetails = async (ruleGroup) => {
    try {
        // console.log(ruleGroup);
        const response = await axios.post('http://localhost:3000/api/customers/get', ruleGroup);

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
