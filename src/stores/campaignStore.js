import { create } from 'zustand';


const useCampaignStore = create((set, get) => ({
    // -------------------------
    // State
    // -------------------------
    view: 'create-campaign',
    campaigns: [],
    customers: [],
    audienceSize: null,
    campaignName: '',
    personalizedMessage: '',
    isModalOpen: false,
    ruleGroup: {
        id: 'group-root',
        combinator: 'AND',
        rules: [{ id: 'rule-1', attribute: '', operator: '', value: '' }],
    },
    // -------------------------
    // Actions
    // -------------------------

    // UI actions
    setView: (newView) => set(() => ({ view: newView })),
    setAudienceSize: (newSize) => set(() => ({ audienceSize: newSize })),
    setCustomers: (newCustomers) => set(() => ({ customers: newCustomers })),
    setCampaignName: (name) => set(() => ({ campaignName: name })),
    setCampaigns: (newCampaigns) => set(() => ({ campaigns: newCampaigns })),
    setPersonalizedMessage: (message) => set(() => ({ personalizedMessage: message })),
    setModalOpen: (isOpen) => set(() => ({ isModalOpen: isOpen })),
    setRuleGroup: (newRuleGroup) => set(() => ({ ruleGroup: newRuleGroup })),


    // Rule tree actions
    addRule: (groupId) => {
        set((state) => {
            const newRule = { id: Date.now(), attribute: '', operator: '', value: '' };
            const newRuleGroup = JSON.parse(JSON.stringify(state.ruleGroup));

            const findAndAdd = (group) => {
                if (group.id === groupId) {
                    // Find first nested group and insert rule before it
                    const firstGroupIndex = group.rules.findIndex(r => r.combinator);
                    if (firstGroupIndex === -1) {
                        group.rules.push(newRule);
                    } else {
                        group.rules.splice(firstGroupIndex, 0, newRule);
                    }
                    return true;
                }
                for (const rule of group.rules) {
                    if (rule.combinator && findAndAdd(rule)) return true;
                }
                return false;
            };
            console.log(JSON.stringify(newRuleGroup, null, 3));
            findAndAdd(newRuleGroup);
            return { ruleGroup: newRuleGroup };
        });
    },


    addGroup: (groupId) => {
        set((state) => {
            const newGroup = {
                id: Date.now(),
                combinator: 'AND',
                rules: [{ id: Date.now() + 1, attribute: '', operator: '', value: '' }],
            };
            const newRuleGroup = JSON.parse(JSON.stringify(state.ruleGroup));

            const findAndAdd = (group) => {
                if (group.id === groupId) {
                    group.rules.push(newGroup);
                    return true;
                }
                for (const rule of group.rules) {
                    if (rule.combinator) findAndAdd(rule);
                }
                return false;
            };

            findAndAdd(newRuleGroup);
            return { ruleGroup: newRuleGroup };
        });
    },


    updateRule: (parentId, ruleId, field, value) => {
        set((state) => {
            const newRuleGroup = JSON.parse(JSON.stringify(state.ruleGroup));

            const findAndUpdate = (group) => {
                if (group.id === parentId) {
                    group.rules = group.rules.map((rule) =>
                        rule.id === ruleId ? { ...rule, [field]: value } : rule
                    );
                    return true;
                }
                for (const rule of group.rules) {
                    if (rule.combinator && findAndUpdate(rule)) return true;
                }
                return false;
            };

            findAndUpdate(newRuleGroup);
            return { ruleGroup: newRuleGroup };
        });
    },


    updateGroupCombinator: (groupId, combinator) => {
        set((state) => {
            const newRuleGroup = JSON.parse(JSON.stringify(state.ruleGroup));

            const findAndUpdate = (group) => {
                if (group.id === groupId) {
                    group.combinator = combinator;
                    return true;
                }
                for (const rule of group.rules) {
                    if (rule.combinator && findAndUpdate(rule)) return true;
                }
                return false;
            };

            findAndUpdate(newRuleGroup);
            return { ruleGroup: newRuleGroup };
        });
    },

    removeItem: (parentId, itemId) => {
        set((state) => {
            const newRuleGroup = JSON.parse(JSON.stringify(state.ruleGroup));

            const recursiveRemove = (group) => {
                if (group.id === parentId) {
                    group.rules = group.rules.filter(item => item.id !== itemId);
                    return true;
                }
                for (const item of group.rules) {
                    if (item.combinator && recursiveRemove(item)) {
                        return true;
                    }
                }
                return false;
            };

            // Handle the root level separately
            if (parentId === 'group-root') {
                newRuleGroup.rules = newRuleGroup.rules.filter(item => item.id !== itemId);
            } else {
                recursiveRemove(newRuleGroup);
            }
            console.log(JSON.stringify(newRuleGroup, null, 3));
            return { ruleGroup: newRuleGroup };
        });
    },


    // Campaign actions
    saveCampaign: (campaignId) => set((state) => {

        const newCampaign = {
            id: campaignId || state.campaigns.length + 1,
            name: state.campaignName || 'Untitled Campaign',
            ruleGroup: state.ruleGroup,
            audienceSize: state.audienceSize || 0,
            personalizedMessage: state.personalizedMessage || 'No personalized message.',
            pending: state.audienceSize,
            sent: 0,
            failed: 0,
            date: new Date().toLocaleDateString("en-GB"),
        };
        return {
            campaigns: [newCampaign, ...state.campaigns],
            view: 'campaign-history',
            campaignName: '',
            personalizedMessage: '',
            audienceSize: null,
            ruleGroup: {
                id: 'group-root',
                combinator: 'AND',
                rules: [{ id: 'rule-1', attribute: '', operator: '', value: '' }],
            },
        };
    }),

    // Global reset action
    resetStore: () => set(() => ({
        view: 'create-campaign',
        audienceSize: null,
        campaignName: '',
        personalizedMessage: '',
        isModalOpen: false,
        ruleGroup: {
            id: 'group-root',
            combinator: 'AND',
            rules: [{ id: 'rule-1', attribute: '', operator: '', value: '' }],
        },
    })),


}));

export default useCampaignStore;
