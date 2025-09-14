import React, { useState } from 'react';
import useCampaignStore from '@/stores/campaignStore';
import { useRouter } from 'next/navigation';

const CustomerTableModal = ({ customers, onClose, onSave }) => {
  const router = useRouter();
  const setModalOpen = useCampaignStore((s) => s.setModalOpen);
  if (!customers || customers.length === 0) return null;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true); 
    try {
      await onSave(); 
      setModalOpen(false);
      router.push("/history");
    } finally {
      setLoading(false); 
    }
  };


  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  function formatKey(key) {
    if (key === "createdAt") return "Created At";
    return key.replace(/_/g, " ").toUpperCase();
  }


  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col transition-transform duration-300 scale-95">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Audience Preview</h2>
          <p className="text-gray-500 text-center mt-1">Review the customers who will receive this campaign.</p>
        </div>

        <div className="flex-grow overflow-hidden no-scrollbar">
          {customers.length > 0 ? (
            <div className="p-6 h-full mr-4 ml-4 overflow-y-auto no-scrollbar">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-950 sticky top-0">
                  <tr>
                    {Object.keys(customers[0])
                      .filter((key) => key !== "id" && key != 'createdAt')
                      .map((key) => (
                        <th
                          key={key}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {formatKey(key)}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer, index) => (
                    <tr key={index}>
                      {Object.entries(customer)
                        .filter(([key]) => key !== "id" && key != 'createdAt')
                        .map(([key, value], idx) => (
                          <td
                            key={idx}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]"
                          >
                            {(key === "last_order_date" || key === "createdAt")
                              ? new Date(value).toLocaleDateString("en-GB") // 👉 dd/mm/yyyy
                              : value}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No customers match the current criteria.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleClick}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white transition shadow-md
        ${loading ? "bg-gray-400 cursor-wait" : "bg-green-500 hover:bg-green-600"}
      `}
          >
            {loading ? "Saving..." : "Save Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTableModal;
