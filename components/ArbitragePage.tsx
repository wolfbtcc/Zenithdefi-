import React from 'react';
import type { User, Operation } from '../types';
import { ArrowLeftIcon, CheckCircleIcon } from './Icons';
import ArbitrageCard from './ArbitrageCard';
import LiveProfitsCard from './LiveProfitsCard';

interface ArbitragePageProps {
  user: User;
  balance: number;
  onNavigateToDashboard: () => void;
  onExecuteOperation: (opData: Omit<Operation, 'id' | 'timestamp'>) => void;
}

const ArbitragePage: React.FC<ArbitragePageProps> = ({ user, balance, onNavigateToDashboard, onExecuteOperation }) => {

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-black/80 to-black pointer-events-none"></div>
      
      <header className="w-full max-w-2xl mx-auto flex items-center z-10 mb-6">
        <button 
          onClick={onNavigateToDashboard} 
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Voltar para o painel"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Voltar</span>
        </button>
        <h1 className="flex-grow text-center text-xl font-bold text-orange-500">
          Operações de Arbitragem
        </h1>
        <div className="w-16 sm:w-24"></div> {/* Spacer to balance the back button */}
      </header>
      
      <main className="w-full flex-grow flex flex-col items-center justify-center z-10">
        <ArbitrageCard user={user} investmentValue={balance} onExecuteOperation={onExecuteOperation} />
        <LiveProfitsCard />
      </main>

      <footer className="w-full text-center py-4 z-10 mt-6">
        <div className="max-w-md mx-auto bg-black border border-white/10 rounded-2xl p-6 text-left">
          <h3 className="text-xl font-bold text-white mb-4">Como Funciona</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>A Zenith AI monitora continuamente as diferenças de preços entre exchanges.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>Nascida em janeiro de 2025, já movimentou mais de 140 milhões de dólares em operações.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>Quando uma oportunidade lucrativa é encontrada, ela é disponibilizada aqui.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>70% do lucro líquido vai para você, 30% é a taxa da plataforma.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>A operação só é realizada quando você confirma a execução.</span>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default ArbitragePage;
