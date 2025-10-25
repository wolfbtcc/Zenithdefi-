import React from 'react';
import { InvestmentRescue } from '../types';
import { SafeIcon, ClockIcon, CheckCircleIcon } from './Icons';

interface RescueHistoryCardProps {
  rescue: InvestmentRescue;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
};

const RescueHistoryCard: React.FC<RescueHistoryCardProps> = ({ rescue }) => {
  
  const isPending = (new Date().getTime() - rescue.timestamp.getTime()) < 72 * 60 * 60 * 1000;
  
  const statusConfig = {
      pending: {
          text: 'Pendente',
          icon: <ClockIcon className="w-4 h-4" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/50',
      },
      completed: {
          text: 'Concluído com sucesso',
          icon: <CheckCircleIcon className="w-4 h-4" />,
          color: 'text-green-400',
          bgColor: 'bg-green-900/50',
      }
  };

  const currentStatus = isPending ? statusConfig.pending : statusConfig.completed;

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(rescue.timestamp);

  return (
    <div className="bg-black border border-gray-800 rounded-2xl p-4 shadow-md shadow-black/20">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <SafeIcon className="w-6 h-6 text-orange-400" />
                <div>
                    <h4 className="font-bold text-white">Resgate de Investimento</h4>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.color}`}>
                {currentStatus.icon}
                <span>{currentStatus.text}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 text-sm space-y-1">
            <div className="flex justify-between items-center text-gray-400">
                <span>Valor resgatado:</span>
                <span className="font-medium text-white">{formatCurrency(rescue.amountRescued)}</span>
            </div>
             <div className="flex justify-between items-center text-gray-400">
                <span>Taxa (28%):</span>
                <span className="font-medium text-red-400">- {formatCurrency(rescue.fee)}</span>
            </div>
             <div className="flex justify-between items-center font-bold text-base mt-1">
                <span className="text-white">Valor recebido:</span>
                <span className="text-green-400">{formatCurrency(rescue.amountReceived)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 pt-2 border-t border-gray-800/50 mt-2">
                <span>Carteira de destino:</span>
                <span className="font-mono text-xs text-white truncate max-w-[150px] sm:max-w-[200px]" title={rescue.details.usdtAddress}>
                    {rescue.details.usdtAddress}
                </span>
            </div>
        </div>
    </div>
  );
};

export default RescueHistoryCard;