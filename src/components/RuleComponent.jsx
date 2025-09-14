"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import useCampaignStore from "@/stores/campaignStore";

const RuleComponent = ({ rule, attributes, operators, parentId }) => {
    const updateRule = useCampaignStore((s) => s.updateRule);
    const removeItem = useCampaignStore((s) => s.removeItem);

    const attributeType = attributes.find((a) => a.value === rule.attribute)?.type;
    const isValueDisabled = !rule.attribute || !rule.operator;

    return (
        <div className="border border-gray-300 rounded-xl p-4 my-4 bg-gray-50 shadow-inner max-w-2xl mx-auto animate-fade-in-down">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <select
                    value={rule.attribute}
                    onChange={(e) => updateRule(parentId, rule.id, "attribute", e.target.value)}
                    className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <option value="" disabled>
                        Select Attribute
                    </option>
                    {attributes.map((attr) => (
                        <option key={attr.value} value={attr.value}>
                            {attr.label}
                        </option>
                    ))}
                </select>
                <select
                    value={rule.operator}
                    onChange={(e) => updateRule(parentId, rule.id, "operator", e.target.value)}
                    className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                    disabled={!rule.attribute}
                >
                    <option value="" disabled>
                        Select Operator
                    </option>
                    {attributeType &&
                        operators[attributeType].map((op) => (
                            <option key={op} value={op}>
                                {op}
                            </option>
                        ))}
                </select>
                <input
                    type={attributeType === "number" ? "number" : "text"}
                    value={rule.value}
                    onChange={(e) => updateRule(parentId, rule.id, "value", e.target.value)}
                    placeholder="Value"
                    disabled={isValueDisabled}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:max-w-xs disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                />
                <button
                    onClick={() => removeItem(parentId, rule.id)}
                    className="relative p-2 text-red-500 hover:bg-red-100 rounded-full group transition-all duration-200"
                    title="Remove rule"
                >
                    <Trash2 className="h-5 w-5" />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300">
                        Remove Rule
                    </span>
                </button>
            </div>
            {rule.attribute === "last_order_date" && rule.operator && (
                <span className="text-xs text-gray-500 mt-2 md:mt-0 block text-right">
                    <span className="font-semibold">{rule.operator === '<' ? 'Less than (<):' : 'Greater than (>):'}</span>
                    {' '}
                    {rule.operator === '<'
                        ? 'last order was placed more than the specified days ago.'
                        : 'last order was placed within the specified days ago.'
                    }
                </span>
            )}
        </div>
    );
};

export default RuleComponent;