"use client";
import { toast } from 'sonner';
import Link from 'next/link';
import useCampaignStore from '@/stores/campaignStore';
import CreateCampaign from '@/components/CreateCampaign';
import ProfileNav from '@/components/ProfileNav';
import CustomerTableModal from '@/components/CustomerTableModal';




const attributes = [
  { label: 'Spend', value: 'spend', type: 'number' },
  { label: 'Visits', value: 'visits', type: 'number' },
  { label: 'City', value: 'city', type: 'string' },
  { label: 'Inactive for (days)', value: 'inactive', type: 'number' },
];

const operators = {
  number: ['>', '<', '=', '>='],
  string: ['=', '!='],
};


export default function App() {
  const view = useCampaignStore((s) => s.view);
  const isModalOpen = useCampaignStore((s) => s.isModalOpen);
  const setModalOpen = useCampaignStore((s) => s.setModalOpen);
  const customers = useCampaignStore((s) => s.customers);
  const saveCampaign = useCampaignStore((s) => s.saveCampaign);



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
      userId: "user_123", // replace if dynamic
      name: campaignName,
      ruleGroup: ruleGroup,
      message: personalizedMessage,
    };

    try {
      const res = await fetch("http://localhost:3000/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save campaign on server");

      const data = await res.json();

      toast.success(data.message || "Campaign saved successfully!");

      // Construct local campaign object using server output if available
      const newCampaign = {
        id: data.campaignId || Date.now(),
        name: campaignName,
        intent: data.intent,
        personalizedMessage,
        audienceSize,
        pending: audienceSize,
        sent: 0,
        failed: 0,
        date: new Date().toLocaleDateString("en-GB"),
      };

      saveCampaign(data.campaignId); // update Zustand store

    } catch (err) {
      console.error("Error saving campaign:", err);
      toast.error("Failed to save campaign on server");
    }
  };


  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; }
            `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm shadow-md">
        <Link href="/" className="text-3xl font-extrabold text-blue-700 tracking-tight">
          Mini CRM
        </Link>
        <div className="flex items-center space-x-4">
          <ProfileNav />
        </div>
      </header>
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
