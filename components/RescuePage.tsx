import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon } from './Icons';
import type { Financials, InvestmentRescue } from '../types';
import RescueHistory from './RescueHistory';

interface RescuePageProps {
  financials: Financials;
  rescues: InvestmentRescue[];
  onNavigateToDashboard: () => void;
  onRescueRequest: (data: Omit<InvestmentRescue, 'id' | 'timestamp' | 'fee' | 'amountReceived'>) => boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
};

const RESCUE_FEE_PERCENTAGE = 0.28;

const RescuePage: React.FC<RescuePageProps> = ({ financials, rescues, onNavigateToDashboard, onRescueRequest }) => {
    const [fullName, setFullName] = useState('');
    const [amountToRescue, setAmountToRescue] = useState<string>('');
    const [reason, setReason] = useState('');
    const [usdtAddress, setUsdtAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const numericAmountToRescue = useMemo(() => parseFloat(amountToRescue) || 0, [amountToRescue]);

    const simulation = useMemo(() => {
        const fee = numericAmountToRescue * RESCUE_FEE_PERCENTAGE;
        const received = numericAmountToRescue - fee;
        return { fee, received };
    }, [numericAmountToRescue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName || !amountToRescue || !reason || !usdtAddress) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        
        if (numericAmountToRescue <= 0) {
            setError('Por favor, insira um valor de resgate válido.');
            return;
        }

        if (numericAmountToRescue > financials.totalInvested) {
            setError('Você não pode resgatar mais do que o total investido.');
            return;
        }
        
        setIsSubmitting(true);
        const success = onRescueRequest({
            amountRescued: numericAmountToRescue,
            details: {
                fullName,
                reason,
                usdtAddress,
            }
        });

        if (success) {
            setShowSuccessMessage(true);
            setFullName('');
            setAmountToRescue('');
            setReason('');
            setUsdtAddress('');
            setTimeout(() => setShowSuccessMessage(false), 5000); // Hide message after 5s
        } else {
            setError('Ocorreu um erro ao processar a solicitação. Tente novamente.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black pointer-events-none"></div>

            <header className="w-full max-w-4xl mx-auto flex items-center z-10 mb-8">
                <button 
                    onClick={onNavigateToDashboard} 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Voltar para o painel"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar</span>
                </button>
                <h1 className="flex-grow text-center text-xl font-bold text-orange-500">
                    Resgatar Investimento
                </h1>
                <div className="w-20"></div>
            </header>

            <main className="w-full max-w-4xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Form and Simulation */}
                <div className="flex flex-col gap-6">
                    <div className="bg-black border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Simulação de Resgate</h2>
                        <div className="space-y-3 text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Valor a resgatar:</span>
                                <span className="font-bold">{formatCurrency(numericAmountToRescue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Taxa de Resgate (28%):</span>
                                <span className="font-bold text-red-500">- {formatCurrency(simulation.fee)}</span>
                            </div>
                            <hr className="border-gray-700" />
                            <div className="flex justify-between text-xl">
                                <span className="font-bold text-white">Você recebe:</span>
                                <span className="font-bold text-green-400">{formatCurrency(simulation.received)}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-black border border-gray-800 rounded-2xl p-6 space-y-4">
                        <h2 className="text-2xl font-bold mb-2">Solicitar Resgate</h2>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Seu nome completo"
                                className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="usdtAddress" className="block text-sm font-medium text-gray-300 mb-1">Carteira USDT TRC20</label>
                            <input
                                id="usdtAddress"
                                type="text"
                                value={usdtAddress}
                                onChange={(e) => setUsdtAddress(e.target.value)}
                                placeholder="Endereço da sua carteira USDT TRC20"
                                className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                                Valor a Resgatar (Máx: {formatCurrency(financials.totalInvested)})
                            </label>
                            <input
                                id="amount"
                                type="number"
                                value={amountToRescue}
                                onChange={(e) => setAmountToRescue(e.target.value)}
                                placeholder="0.00"
                                max={financials.totalInvested}
                                className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">Motivo do Resgate</label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Ex: Preciso do dinheiro para uma emergência."
                                rows={3}
                                className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        {showSuccessMessage && <p className="text-green-500 text-sm text-center">Solicitação de resgate enviada com sucesso!</p>}

                        <div className="pt-2">
                             <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 disabled:bg-gray-600"
                            >
                                {isSubmitting ? 'Processando...' : 'Solicitar Resgate'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: History */}
                <div className="flex flex-col">
                    <RescueHistory rescues={rescues} />
                </div>
            </main>
        </div>
    );
};

export default RescuePage;