"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { toast } from 'sonner';
import useCampaignStore from '@/stores/campaignStore';
import Header from "@/components/Header";
import CreateCampaign from '@/components/CreateCampaign';
import CustomerTableModal from '@/components/CustomerTableModal';


const attributes = [
  { label: 'Spend', value: 'total_spend', type: 'number' },
  { label: 'Visits', value: 'visit', type: 'number' },
  { label: 'City', value: 'city', type: 'string' },
  { label: 'Last Order Date (in days)', value: 'last_order_date', type: 'number' },
];
const operators = {
  number: [">", "<", "=", ">=", "<="],
  string: ["=", "!="],
};


export default function CampaignBuilder() {
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


  const isModalOpen = useCampaignStore((s) => s.isModalOpen);
  const setModalOpen = useCampaignStore((s) => s.setModalOpen);
  const customers = useCampaignStore((s) => s.customers);
  const saveCampaign = useCampaignStore((s) => s.saveCampaign);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }


  const handleSaveCampaign = async () => {
    const campaignName = useCampaignStore.getState().campaignName;
    const personalizedMessage = useCampaignStore.getState().personalizedMessage;
    const ruleGroup = useCampaignStore.getState().ruleGroup;
    const audienceSize = useCampaignStore.getState().audienceSize;

    if (!campaignName || !personalizedMessage) {
      toast.error("Please fill in all required fields!");
      return;
    }
    if (!audienceSize || audienceSize === 0) {
      toast.error("Audience size is 0. Cannot save campaign.");
      return;
    }

    const payload = {
      userId: session.user.googleId, 
      name: campaignName,
      ruleGroup: ruleGroup,
      message: personalizedMessage,
    };

    try {
      const res = await fetch("http://localhost:3000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save campaign on server");

      const data = await res.json();

      toast.success(data.message || "Campaign saved successfully!");

      // Construct local campaign object 
      const newCampaign = {
        id: session.user.googleId,
        name: campaignName,
        intent: data.intent,
        personalizedMessage,
        audienceSize,
        pending: audienceSize,
        sent: 0,
        failed: 0,
        date: new Date().toLocaleDateString("en-GB"),
      };

      saveCampaign(data.campaignId); 

    } catch (err) {
      console.error("Error saving campaign:", err);
      toast.error("Failed to save campaign on server");
    }
  };


  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <Header />
      <main className="w-full pt-20">
        <CreateCampaign attributes={attributes} operators={operators} />
      </main>
      {isModalOpen && (
        <CustomerTableModal
          customers={customers}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCampaign}
        />
      )}
    </div>
  );
}
