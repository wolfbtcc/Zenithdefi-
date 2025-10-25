import React from 'react';
import { Withdrawal } from '../types';
import WithdrawHistoryCard from './WithdrawHistoryCard';

interface WithdrawHistoryProps {
  withdrawals: Withdrawal[];
}

const WithdrawHistory: React.FC<WithdrawHistoryProps> = ({ withdrawals }) => {
  const sortedWithdrawals = [...withdrawals].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-[#FF7A00] mb-6">Histórico de Saques</h3>
      {sortedWithdrawals.length > 0 ? (
        <div className="space-y-4">
            {sortedWithdrawals.map((w) => (
                <WithdrawHistoryCard key={w.id} withdrawal={w} />
            ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border border-dashed border-gray-700 rounded-2xl">
            <p className="text-gray-500">Nenhum saque realizado ainda.</p>
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;