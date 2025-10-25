import React from 'react';
import { Operation } from '../types';
import { ArrowUpIcon } from './Icons';

interface OperationHistoryCardProps {
  operation: Operation;
}

const neonGreen = '#2AF8A1';

const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    // Intl for pt-BR might add R$, so we ensure it's just $
    return `$ ${formatted.replace(/R\$\s?/, '')}`;
};

const OperationHistoryCard: React.FC<OperationHistoryCardProps> = ({ operation }) => {
  
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(operation.timestamp).replace(',', ` às`);

  return (
    <div className="bg-black border border-gray-800/80 rounded-2xl p-4 shadow-lg shadow-black/30">
        {/* Top Section */}
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Operação Cripto</p>
                <h3 className="text-lg font-bold text-white mt-1">{operation.pair}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{operation.exchanges}</p>
            </div>
            <div className="flex items-center gap-1.5 text-base font-bold" style={{ color: neonGreen }}>
                + {operation.percentage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                <ArrowUpIcon className="w-4 h-4" />
            </div>
        </div>

        {/* Bottom Section - Compact */}
        <div className="mt-4 pt-4 border-t border-gray-800/50 grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Lucro</p>
                <p className="text-xl font-bold" style={{ color: neonGreen }}>{formatCurrency(operation.profit)}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Retorno Total</p>
                <p className="text-xl font-bold" style={{ color: neonGreen }}>{formatCurrency(operation.totalReturn)}</p>
            </div>
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-gray-500 text-right pt-2">{formattedDate}</p>
    </div>
  );
};

export default OperationHistoryCard;
