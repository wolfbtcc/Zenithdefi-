import React, { useMemo } from 'react';
import type { User, Financials, Operation } from '../types';
import { ChartUpIcon, DollarIcon } from './Icons';
import Footer from './Footer';
import OperationHistory from './OperationHistory';
import ConnectWalletButton from './ConnectWalletButton';


interface DashboardPageProps {
  user: User;
  financials: Financials;
  operationsHistory: Operation[];
  onLogout: () => void;
  onNavigateToArbitrage: () => void;
  onNavigateToDeposit: () => void;
  onNavigateToWithdraw: () => void;
  onNavigateToAffiliate: () => void;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
    <div className={`bg-black border ${colorClass}/20 rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-${colorClass}/20`}>
        <div>
            <div className={`w-10 h-10 rounded-full bg-${colorClass}/10 flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="text-gray-400 text-base">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
    </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ user, financials, operationsHistory, onLogout, onNavigateToArbitrage, onNavigateToDeposit, onNavigateToWithdraw, onNavigateToAffiliate }) => {

  const getGreetingText = () => {
    try {
        const now = new Date();
        const bstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const hour = bstTime.getHours();

        if (hour >= 5 && hour < 12) return 'Bom dia';
        if (hour >= 12 && hour < 18) return 'Boa tarde';
        return 'Boa noite';
    } catch(e) {
        // Fallback for environments that might not support timeZone
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Bom dia';
        if (hour >= 12 && hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }
  };
  
  const greetingText = useMemo(getGreetingText, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff6a00]/10 to-transparent pointer-events-none"></div>

      <header className="w-full container mx-auto px-4 py-6 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-white">Zenith AI</h1>
        <div className="flex items-center gap-4">
          <ConnectWalletButton />
          <button onClick={onLogout} className="text-sm border border-gray-700 rounded-full px-4 py-1.5 hover:bg-gray-800 transition-colors">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 z-10">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {greetingText},
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase">
            {user.name.split(' ')[0]}!
          </h2>
          <p className="text-gray-400 mt-2">Bem-vindo(a) de volta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
                title="Saldo Disponível (Lucro)"
                value={formatCurrency(financials.balance - financials.totalInvested)}
                icon={<DollarIcon className="w-6 h-6 text-green-400" />}
                colorClass="border-green-500"
            />
            <StatCard 
                title="Lucros de Hoje"
                value={formatCurrency(financials.todayProfit)}
                icon={<ChartUpIcon className="w-6 h-6 text-green-400" />}
                colorClass="border-green-500"
            />
            <StatCard 
                title="Lucro do Mês"
                value={formatCurrency(financials.monthProfit)}
                icon={<ChartUpIcon className="w-6 h-6 text-orange-400" />}
                colorClass="border-orange-500"
            />
            <StatCard 
                title="Total Investido"
                value={formatCurrency(financials.totalInvested)}
                icon={<DollarIcon className="w-6 h-6 text-orange-400" />}
                colorClass="border-orange-500"
            />
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={onNavigateToDeposit} className="w-full bg-[#ff6a00] hover:bg-orange-600 transition-colors text-white font-bold py-6 rounded-2xl text-lg">
                Investir Agora
            </button>
             <button onClick={onNavigateToArbitrage} className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-6 rounded-2xl text-lg">
                Iniciar Operações
            </button>
             <button onClick={onNavigateToWithdraw} className="w-full bg-black border border-orange-500/50 text-orange-500 hover:bg-orange-900/20 hover:text-orange-400 hover:border-orange-500 transition-all duration-300 font-bold py-6 rounded-2xl text-lg shadow-[0_0_5px_rgba(255,106,0,0.5)] hover:shadow-[0_0_15px_rgba(255,106,0,0.7)]">
                Sacar
            </button>
             <button onClick={onNavigateToAffiliate} className="w-full bg-black border border-orange-500/50 text-orange-500 hover:bg-orange-900/20 hover:text-orange-400 hover:border-orange-500 transition-all duration-300 font-bold py-6 rounded-2xl text-lg shadow-[0_0_5px_rgba(255,106,0,0.5)] hover:shadow-[0_0_15px_rgba(255,106,0,0.7)]">
                Zenith Performance
            </button>
        </div>

        {operationsHistory.length > 0 && <OperationHistory operations={operationsHistory} />}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;