import React, { useState } from 'react';
import { ArrowLeftIcon, WalletIcon, ClockIcon, AlertIcon, SafeIcon } from './Icons';
import type { Financials, Withdrawal } from '../types';
import WithdrawModal from './WithdrawModal';
import WithdrawHistory from './WithdrawHistory';

interface WithdrawPageProps {
  financials: Financials;
  withdrawals: Withdrawal[];
  onNavigateToDashboard: () => void;
  onWithdrawalRequest: (data: Omit<Withdrawal, 'id' | 'timestamp' | 'fee'>) => boolean;
  onNavigateToRescue: () => void;
}

const MIN_WITHDRAWAL = 20;

const WithdrawPage: React.FC<WithdrawPageProps> = ({ financials, withdrawals, onNavigateToDashboard, onWithdrawalRequest, onNavigateToRescue }) => {
  const [modalType, setModalType] = useState<'usdt' | 'pix' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableBalance = financials.balance - financials.totalInvested;

  const handleOpenModal = (type: 'usdt' | 'pix') => {
    setError(null);
    if (availableBalance < MIN_WITHDRAWAL) {
      setError(`Você não possui o valor mínimo de $${MIN_WITHDRAWAL.toFixed(2)} para sacar.`);
      // Hide error after 5 seconds
      setTimeout(() => setError(null), 5000);
      return;
    }
    setModalType(type);
  };
  
  const handleCloseModal = () => {
    setModalType(null);
  };
  
  const handleSubmitWithdrawal = (data: Omit<Withdrawal, 'id' | 'timestamp' | 'fee'>) => {
    const success = onWithdrawalRequest(data);
    if(success) {
      handleCloseModal();
    }
    return success;
  };

  return (
    <>
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
          <h1 className="flex-grow text-center text-xl font-bold text-orange-500">
            Sacar Fundos
          </h1>
          <div className="w-20"></div>
        </header>
        
        <main className="w-full max-w-md z-10 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Escolha o método de saque</h2>
            <p className="text-gray-400 mt-2">Selecione como deseja receber seus fundos</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
                <ClockIcon className="w-4 h-4" />
                <span>Saques disponíveis das 10:00 às 17:00</span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-2">
                <AlertIcon className="w-5 h-5" />
                <span>{error}</span>
            </div>
          )}

          {/* USDT Withdraw Card */}
          <button onClick={() => handleOpenModal('usdt')} className="bg-black border border-gray-800 rounded-2xl p-6 flex items-start text-left transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <div className="p-3 bg-gray-900/50 rounded-lg mr-4 border border-white/10">
                  <WalletIcon className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white">Sacar em USDT</h3>
                  <p className="text-gray-400 text-sm mt-1">Rede Ethereum (TRC20)</p>
                  <p className="text-gray-400 text-sm mt-3">Receba seus fundos diretamente em sua carteira USDT TRC20.</p>
                  <div className="mt-4 bg-gray-900/70 border border-gray-700 rounded-md px-3 py-1.5 text-xs font-medium text-gray-300 inline-block">
                    Valor mínimo: $20.00
                  </div>
              </div>
          </button>

          {/* Pix Withdraw Card */}
          <button onClick={() => handleOpenModal('pix')} className="bg-black border border-gray-800 rounded-2xl p-6 flex items-start text-left transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <div className="p-3 bg-gray-900/50 rounded-lg mr-4 border border-white/10">
                  <WalletIcon className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white">Sacar via PIX</h3>
                  <p className="text-gray-400 text-sm mt-1">Transferência instantânea</p>
                  <p className="text-gray-400 text-sm mt-3">Receba seus fundos via PIX na sua conta bancária.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                      <div className="bg-gray-900/70 border border-gray-700 rounded-md px-3 py-1.5 text-xs font-medium text-gray-300">
                        Valor mínimo: $20.00
                      </div>
                      <div className="bg-red-900/30 border border-red-800/70 rounded-md px-3 py-1.5 text-xs font-medium text-red-400">
                        Taxa: 3% sobre o valor
                      </div>
                  </div>
              </div>
          </button>
          
          {/* Rescue Investment Card */}
          <button onClick={onNavigateToRescue} className="bg-black border border-gray-800 rounded-2xl p-6 flex items-start text-left transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <div className="p-3 bg-gray-900/50 rounded-lg mr-4 border border-white/10">
                  <SafeIcon className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white">Resgatar Investimento</h3>
                  <p className="text-gray-400 text-sm mt-1">Retire seu capital inicial</p>
                  <p className="text-gray-400 text-sm mt-3">Solicite o resgate do seu valor total investido.</p>
                   <div className="mt-4 bg-red-900/30 border border-red-800/70 rounded-md px-3 py-1.5 text-xs font-medium text-red-400 inline-block">
                        Taxa de resgate: 28%
                    </div>
              </div>
          </button>

          {withdrawals.length > 0 && <WithdrawHistory withdrawals={withdrawals} />}

        </main>
      </div>

      {modalType && (
        <WithdrawModal 
            type={modalType}
            availableBalance={availableBalance}
            onClose={handleCloseModal}
            onSubmit={handleSubmitWithdrawal}
        />
      )}
    </>
  );
};

export default WithdrawPage;