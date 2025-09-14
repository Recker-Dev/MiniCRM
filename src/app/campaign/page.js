"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { toast } from 'sonner';
import useCampaignStore from '@/stores/campaignStore';
import { saveCampaignApi } from "@/lib/services";
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
      ruleGroup,
      message: personalizedMessage,
    };

    try {
      const data = await saveCampaignApi(payload);

      toast.success(data.message || "Campaign saved successfully!");

      // Construct local campaign object (if needed)
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

      // call your local store update
      useCampaignStore.getState().saveCampaign(data.campaignId);

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
