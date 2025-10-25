import React from 'react';
import { ArrowLeftIcon, QrCodeIcon } from './Icons';

interface DepositPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToDepositFlow: (type: 'usdt' | 'pix') => void;
}

const DepositPage: React.FC<DepositPageProps> = ({ onNavigateToDashboard, onNavigateToDepositFlow }) => {

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black pointer-events-none"></div>
      
      <header className="w-full max-w-2xl mx-auto flex items-center z-10 mb-8">
        <button 
          onClick={onNavigateToDashboard} 
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Voltar para o painel"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="flex-grow text-center text-xl font-bold text-white">
          Depositar Fundos
        </h1>
        <div className="w-20"></div>
      </header>
      
      <main className="w-full max-w-md z-10 flex flex-col gap-6">
        <div className="text-center">
          <p className="text-gray-400">Escolha o método de depósito</p>
        </div>
        
        {/* USDT Deposit Card */}
        <div className="bg-black border border-orange-500/20 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50">
            <div className="p-3 bg-gray-900/50 rounded-lg mb-4 border border-white/10">
                <QrCodeIcon className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Depositar em USDT</h3>
            <p className="text-gray-400 mt-2 mb-6 max-w-xs">Depósito via criptomoeda USDT na rede Ethereum.</p>
            <button onClick={() => onNavigateToDepositFlow('usdt')} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-orange-600/20">
                Depositar USDT
            </button>
        </div>

        {/* Pix Deposit Card */}
        <div className="bg-black border border-orange-500/20 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50">
            <div className="p-3 bg-gray-900/50 rounded-lg mb-4 border border-white/10">
                <QrCodeIcon className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Depositar via Pix</h3>
            <p className="text-gray-400 mt-2 mb-6 max-w-xs">Depósito via PIX - Rápido e Seguro.</p>
            <button onClick={() => onNavigateToDepositFlow('pix')} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-orange-600/20">
                Depositar via Pix
            </button>
        </div>
      </main>
    </div>
  );
};

export default DepositPage;