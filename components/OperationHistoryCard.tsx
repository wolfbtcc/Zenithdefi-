import React from 'react';
import { Operation } from '../types';
import { ArrowUpIcon } from './Icons';

interface OperationHistoryCardProps {
  operation: Operation;
}

const neonOrange = '#FF7A00';
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
                <h3 className="text-xl font-bold text-white mt-1">{operation.pair}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{operation.exchanges}</p>
            </div>
            <div className="flex items-center gap-1.5 text-base font-bold" style={{ color: neonGreen }}>
                + {operation.percentage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                <ArrowUpIcon className="w-4 h-4" />
            </div>
        </div>

        {/* Bottom Section with Accent */}
        <div className="relative flex mt-4">
            {/* Accent Line */}
            <div className="w-4 flex-shrink-0 flex justify-center">
                 <div className="relative w-px h-full bg-gradient-to-b from-orange-700 via-orange-800 to-transparent">
                     <div className="absolute top-[20%] -left-px w-1.5 h-1.5 rounded-full" style={{backgroundColor: neonOrange}}></div>
                     <div className="absolute top-[80%] -left-px w-1.5 h-1.5 rounded-full" style={{backgroundColor: neonOrange}}></div>
                </div>
            </div>
            
            {/* Financial Details */}
            <div className="flex-grow pl-2 space-y-4">
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Lucro</p>
                    <p className="text-3xl font-extrabold" style={{ color: neonGreen }}>{formatCurrency(operation.profit)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Retorno Total</p>
                    <p className="text-2xl font-extrabold" style={{ color: neonGreen }}>{formatCurrency(operation.totalReturn)}</p>
                </div>
            </div>
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-gray-500 text-right pt-2">{formattedDate}</p>
    </div>
  );
};

export default OperationHistoryCard;
