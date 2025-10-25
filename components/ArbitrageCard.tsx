import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RobotIcon, ExchangeIcon, ChartUpIcon } from './Icons';
import type { Operation, User } from '../types';

// Default props for easy configuration
const DEFAULT_PAIRS = ['ADA/USDT', 'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'DOT/USDT'];
const DEFAULT_EXCHANGES = ['Coinbase', 'Binance', 'OKX', 'KuCoin', 'Bitstamp', 'Huobi'];

interface ArbitrageCardProps {
  user: User;
  investmentValue?: number;
  pairs?: string[];
  exchanges?: string[];
  intervalSeconds?: number;
  minPercent?: number;
  maxPercent?: number;
  onExecuteOperation: (opData: Omit<Operation, 'id' | 'timestamp'>) => void;
}

interface Opportunity {
  pair: string;
  percentage: number;
  buyExchange: string;
  sellExchange: string;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
};

const ArbitrageCard: React.FC<ArbitrageCardProps> = ({
  user,
  investmentValue = 1000.00,
  pairs = DEFAULT_PAIRS,
  exchanges = DEFAULT_EXCHANGES,
  intervalSeconds = 15,
  minPercent = 0.15,
  maxPercent = 0.60,
  onExecuteOperation,
}) => {
  const [countdown, setCountdown] = useState(intervalSeconds);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isExecuteEnabled, setIsExecuteEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);

  // Effect for 3-hour cooldown
  useEffect(() => {
    if (user.cooldownUntil) {
        const cooldownEndTime = new Date(user.cooldownUntil).getTime();
        const now = Date.now();

        if (cooldownEndTime > now) {
            const remainingSeconds = Math.round((cooldownEndTime - now) / 1000);
            setCooldownRemaining(remainingSeconds);

            const interval = setInterval(() => {
                setCooldownRemaining(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(interval);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }
    setCooldownRemaining(null); // No active cooldown
  }, [user.cooldownUntil]);

  const generateNewOpportunity = useCallback(() => {
    // Select random pair
    const pair = pairs[Math.floor(Math.random() * pairs.length)];

    // Select two different exchanges
    let buyExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    let sellExchange;
    do {
      sellExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    } while (buyExchange === sellExchange);
    
    // Generate random percentage, skewed towards lower values
    const randomFactor = Math.random() * Math.random(); // Skews results toward the lower end
    const percentage = minPercent + randomFactor * (maxPercent - minPercent);

    setOpportunity({ pair, percentage, buyExchange, sellExchange });
    setAnimationKey(prev => prev + 1); // Trigger animation
  }, [pairs, exchanges, minPercent, maxPercent]);

  // Main timer for new opportunities and countdown display.
  // This single effect manages the ticking countdown and the refresh logic.
  useEffect(() => {
    // Generate the very first opportunity immediately on mount
    generateNewOpportunity();

    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          generateNewOpportunity();
          setIsExecuteEnabled(false);
          return intervalSeconds;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [generateNewOpportunity, intervalSeconds]);


  const handleUseInvestment = () => {
    setIsExecuteEnabled(true);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000); // Hide tooltip after 2s
  };

  const handleExecute = () => {
    if (!opportunity) return;
        
    onExecuteOperation({
        pair: opportunity.pair,
        exchanges: `${opportunity.buyExchange} > ${opportunity.sellExchange}`,
        percentage: opportunity.percentage,
        profit: calculations.userProfit,
        totalReturn: calculations.totalReturn,
    });
  };

  const calculations = useMemo(() => {
    if (!opportunity) {
        return { grossProfit: 0, userProfit: 0, platformFee: 0, totalReturn: 0 };
    }
    const grossProfit = investmentValue * (opportunity.percentage / 100);
    const userProfit = grossProfit * 0.70;
    const platformFee = grossProfit * 0.30;
    const totalReturn = investmentValue + userProfit;
    return { grossProfit, userProfit, platformFee, totalReturn };
  }, [opportunity, investmentValue]);

  const formatCooldown = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!opportunity) {
    return <div className="text-center p-8">Carregando oportunidade...</div>;
  }
  
  return (
    <div key={animationKey} className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col gap-4 text-white animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-[#3A2617] text-orange-400 p-3 rounded-xl">
                    <RobotIcon className="w-7 h-7" />
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-white">Zenith AI Analisando</h2>
                    <p className="text-sm text-gray-400">
                        Buscando oportunidade...
                    </p>
                </div>
            </div>
        </div>

        {/* Trading Pair Info */}
        <div className="bg-black rounded-xl p-4 space-y-3 border border-gray-800">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{opportunity.pair}</h3>
                <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                    <ChartUpIcon className="w-5 h-5" />
                    + {opportunity.percentage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="text-center bg-[#103D37] rounded-lg p-3 flex-1">
                    <p className="text-xs text-gray-400">Compra em</p>
                    <p className="font-bold text-green-400 mt-1">{opportunity.buyExchange}</p>
                </div>
                <ExchangeIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
                <div className="text-center bg-red-900/50 rounded-lg p-3 flex-1">
                    <p className="text-xs text-gray-400">Venda em</p>
                    <p className="font-bold text-red-400 mt-1">{opportunity.sellExchange}</p>
                </div>
            </div>
        </div>

         {/* Financials */}
        <div className="bg-black rounded-xl p-4 text-sm space-y-3 border border-gray-800">
            <div className="flex justify-between items-center">
                <p className="text-gray-400">Valor do Investimento</p>
                <p className="font-semibold text-base">{formatCurrency(investmentValue)}</p>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between items-center">
                <p className="text-gray-400">Lucro Bruto da Operação</p>
                <p className="font-semibold text-green-400">{formatCurrency(calculations.grossProfit)}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-gray-400">Seu Lucro (70%)</p>
                <p className="font-semibold text-green-400">{formatCurrency(calculations.userProfit)}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-gray-400">Taxa da Plataforma (30%)</p>
                <p className="font-semibold text-orange-400">{formatCurrency(calculations.platformFee)}</p>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between items-center">
                <p className="font-bold">Retorno Total</p>
                <p className="font-bold text-orange-400 text-xl">{formatCurrency(calculations.totalReturn)}</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
            {cooldownRemaining && cooldownRemaining > 0 ? (
                <div className="bg-black border border-orange-500/30 rounded-xl p-4 text-center">
                    <p className="text-gray-400 font-medium">Próxima operação disponível em:</p>
                    <p className="text-3xl font-bold text-orange-400 font-mono tracking-wider my-2">
                        {formatCooldown(cooldownRemaining)}
                    </p>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(1 - cooldownRemaining / (3 * 60 * 60)) * 100}%`, transition: 'width 1s linear' }}></div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <button 
                            onClick={handleUseInvestment}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-95"
                        >
                            Usar 100% do investimento
                        </button>
                        {showTooltip && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-fade-in-up">
                                100% do investimento selecionado
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleExecute}
                        disabled={!isExecuteEnabled}
                        aria-disabled={!isExecuteEnabled}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:bg-green-700"
                    >
                        Executar operação
                    </button>
                </>
            )}
        </div>
    </div>
  );
};


// Simple CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
  @keyframes pulse-heartbeat {
    0%, 100% {
        box-shadow: 0 0 5px rgba(255, 106, 0, 0.3), 0 0 7px rgba(255, 106, 0, 0.2);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 15px rgba(255, 106, 0, 0.6), 0 0 25px rgba(255, 106, 0, 0.4);
        transform: scale(1.05);
    }
  }
  .animate-pulse-heartbeat {
      animation: pulse-heartbeat 1.5s infinite ease-in-out;
  }
`;
document.head.append(style);


export default ArbitrageCard;