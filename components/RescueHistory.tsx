import React from 'react';
import { InvestmentRescue } from '../types';
import RescueHistoryCard from './RescueHistoryCard';

interface RescueHistoryProps {
  rescues: InvestmentRescue[];
}

const RescueHistory: React.FC<RescueHistoryProps> = ({ rescues }) => {
  const sortedRescues = [...rescues].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="h-full">
      <h3 className="text-2xl font-bold text-[#FF7A00] mb-6">Histórico de Resgates</h3>
      {sortedRescues.length > 0 ? (
        <div className="space-y-4">
            {sortedRescues.map((r) => (
                <RescueHistoryCard key={r.id} rescue={r} />
            ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border border-dashed border-gray-700 rounded-2xl h-full flex items-center justify-center">
            <p className="text-gray-500">Nenhum resgate solicitado ainda.</p>
        </div>
      )}
    </div>
  );
};

export default RescueHistory;
