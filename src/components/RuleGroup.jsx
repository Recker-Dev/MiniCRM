"use client";
import React from "react";
import { Trash2, Plus, } from "lucide-react";
import RuleComponent from "./RuleComponent";
import useCampaignStore from "@/stores/campaignStore";

const RuleGroup = ({ group, attributes, operators, parentId = null }) => {
    const addRule = useCampaignStore((s) => s.addRule);
    const addGroup = useCampaignStore((s) => s.addGroup);
    const removeItem = useCampaignStore((s) => s.removeItem);
    const updateGroupCombinator = useCampaignStore((s) => s.updateGroupCombinator);

    return (
        <div className="border border-gray-300 rounded-xl p-4 my-4 bg-gray-50 shadow-inner animate-fade-in-down">
            <div className="flex items-center space-x-4 mb-4">
                <label className="text-gray-600 font-semibold">Match</label>
                <select
                    value={group.combinator}
                    onChange={(e) => updateGroupCombinator(group.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <option value="AND">All (AND)</option>
                    <option value="OR">Any (OR)</option>
                </select>
                <div className="flex-grow"></div>
                {group.id !== "group-root" && (
                    <button
                        onClick={() => removeItem(parentId, group.id)}
                        className="relative p-2 text-red-500 hover:bg-red-100 rounded-full group transition-all duration-200"
                    >
                        <Trash2 className="h-5 w-5" />
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300">
                            Remove Group
                        </span>
                    </button>
                )}
            </div>
            <div className="pl-4 border-l-2 border-dashed border-gray-300 space-y-4">
                {group.rules.map((item) =>
                    item.combinator ? (
                        <RuleGroup
                            key={item.id}
                            group={item}
                            attributes={attributes}
                            operators={operators}
                            parentId={group.id}
                        />
                    ) : (
                        <RuleComponent
                            key={item.id}
                            rule={item}
                            attributes={attributes}
                            operators={operators}
                            parentId={group.id}
                        />
                    )
                )}
            </div>
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={() => addRule(group.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition"
                >
                    <Plus size={16} />
                    <span>Add Rule</span>
                </button>
                <button
                    onClick={() => addGroup(group.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-sm hover:bg-purple-600 transition"
                >
                    <Plus size={16} />
                    <span>Add Group</span>
                </button>
            </div>
        </div>
    );
};

export default RuleGroup;