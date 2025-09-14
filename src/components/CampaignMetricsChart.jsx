import { PieChart, Pie, Cell, Tooltip } from 'recharts';
export const CampaignMetricsChart = ({ sent, pending, failed }) => {

  const COLORS = {
    sent: '#10B981', // Green
    pending: '#F59E0B', // Yellow
    failed: '#EF4444', // Red
  };

  const data = [
    { name: "Sent", value: sent, color: COLORS.sent },
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "Failed", value: failed, color: COLORS.failed },
  ];

  return (
    <div className="flex items-center space-x-2">
      <PieChart width={80} height={80}>
        <Pie
          data={data}
          cx={40}
          cy={40}
          innerRadius={15}
          outerRadius={30}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${name}: ${value}`, ""]} />
      </PieChart>
      <div className="flex flex-col text-sm">
        <span className="font-bold" style={{ color: COLORS.sent }}>{sent} Sent</span>
        <span className="font-bold" style={{ color: COLORS.pending }}>{pending} Pending</span>
        <span className="font-bold" style={{ color: COLORS.failed }}>{failed} Failed</span>
      </div>
    </div>
  );
};