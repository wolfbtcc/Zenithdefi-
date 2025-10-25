import React from 'react';
import { Operation } from '../types';
import OperationHistoryCard from './OperationHistoryCard';

interface OperationHistoryProps {
  operations: Operation[];
}

const OperationHistory: React.FC<OperationHistoryProps> = ({ operations }) => {
  // Sort operations by timestamp, newest first
  const sortedOperations = [...operations].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-[#FF7A00] mb-6">Histórico de Operações</h3>
      <div className="space-y-4">
        {sortedOperations.map((op) => (
          <OperationHistoryCard key={op.id} operation={op} />
        ))}
      </div>
    </div>
  );
};

export default OperationHistory;
