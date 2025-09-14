"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import { CampaignMetricsChart } from "@/components/CampaignMetricsChart";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import useCampaignStore from "@/stores/campaignStore.js";
import { getUserCampaigns } from "@/lib/services";
import Link from 'next/link';


const CampaignHistory = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    // Only redirect if the session has finished loading and the user is not authenticated
    if (!loading && !session) {
      useCampaignStore.getState().resetStore();
      router.push('/');
    }
  }, [session, loading, router]);


  const campaigns = useCampaignStore((s) => s.campaigns);
  const setCampaigns = useCampaignStore((s) => s.setCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);


  useEffect(() => {
    if (session?.user) {
      (async () => {
        try {
          const campaigns = await getUserCampaigns(session.user.googleId);
          setCampaigns(campaigns);
        } catch (err) {
          console.error("Error loading campaigns:", err);
        }
      })();
    }
  }, [session, setCampaigns]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" aria-busy="true">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-lg" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-transparent mix-blend-screen" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin border-gray-600" />
          <div className="text-sm text-gray-800 font-semibold">Please wait — loading</div>
        </div>
      </div>
    );
  }




  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.intent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-auto mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Campaign History</h2>
          <Link href="/campaign">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + New Campaign
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="RUNNING">Running</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No campaigns found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3"></th>
                  {[
                    "Campaign Name",
                    "Segment",
                    "Message",
                    "Audience Size",
                    "Status",
                    "Metrics",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map((campaign, i) => (
                  <React.Fragment key={campaign.id}>
                    <tr
                      className={`transition-colors cursor-pointer ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50`}
                      onClick={() => toggleExpand(campaign.id)}
                    >
                      <td className="px-6 py-4">
                        {expandedId === campaign.id ? (
                          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-6 py-4 max-w-[200px] text-sm text-gray-600">{campaign.intent}</td>
                      <td className="px-6 py-4 max-w-xs truncate" title={campaign.message}>
                        {campaign.message}
                      </td>
                      <td className="px-6 py-4 text-sm">{campaign.audience_size}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap
                          ${campaign.status === "active" ? "bg-green-100 text-green-800" : ""}
                          ${campaign.status === "completed" ? "bg-blue-100 text-blue-800" : ""}
                          ${campaign.status === "paused" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${campaign.status === "failed" ? "bg-red-100 text-red-800" : ""}
                        `}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <CampaignMetricsChart
                          sent={campaign.sent_count}
                          pending={campaign.pending_count}
                          failed={campaign.failed_count}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(campaign.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                    {/* Row for Detailed Summary */}
                    {expandedId === campaign.id && (
                      <tr className="bg-gray-100">
                        <td colSpan="8" className="p-6">
                          <div className="flex items-start space-x-6">
                            <div className="flex-1">
                              <p className="text-xl font-semibold text-gray-800 mb-2">Campaign Summary</p>
                              <p className="text-gray-700 leading-relaxed">
                                {campaign.summary || "This campaign is still in progress. A summary will be available once it is completed."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default CampaignHistory;