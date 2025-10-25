import React, { useState, useMemo } from 'react';
import { RocketIcon, DollarIcon, ChartUpIcon, AlertIcon } from './Icons';
import Footer from './Footer';
import BackgroundGraphics from './BackgroundGraphics';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register') => void;
}

const Header: React.FC<{ onNavigateToAuth: (mode: 'login' | 'register') => void; }> = ({ onNavigateToAuth }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
      <h1 className="text-xl font-bold text-white">Zenith AI</h1>
      <button onClick={() => onNavigateToAuth('login')} className="text-sm border border-gray-700 rounded-full px-4 py-1.5 hover:bg-gray-800 transition-colors">
        Login
      </button>
    </header>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const [investment, setInvestment] = useState<number>(20);

  const simulation = useMemo(() => {
    if (isNaN(investment) || investment < 20) {
      return {
        estimatedReturn: 0,
        netProfit: 0,
        valuation: 0,
      };
    }
    const valuationMultiplier = 3; // 300%
    const estimatedReturn = investment * (1 + valuationMultiplier);
    const netProfit = estimatedReturn - investment;
    
    return {
      estimatedReturn,
      netProfit,
      valuation: valuationMultiplier * 100,
    };
  }, [investment]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <BackgroundGraphics />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff6a00]/20 to-transparent pointer-events-none"></div>
      
      <Header onNavigateToAuth={onNavigateToAuth} />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex flex-col items-center text-center">
        {/* Hero Section */}
        <section className="w-full max-w-2xl mt-12 mb-24 flex flex-col items-center animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight whitespace-pre-line">
            {'Lucre com Arbitragem\nAutomática de Cripto'.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line.includes('Cripto') ? (
                        <>
                            {line.split('Cripto')[0]}
                            <span className="text-[#ff6a00]">Cripto</span>
                            {line.split('Cripto')[1]}
                        </>
                    ) : (
                        line
                    )}
                    <br />
                </React.Fragment>
            ))}
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-lg">
            A Zenith AI analisa automaticamente oportunidades por segundo e opera as melhores arbitragens para você lucrar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <button onClick={() => onNavigateToAuth('register')} className="w-full bg-[#ff6a00] hover:bg-orange-600 transition-all duration-300 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 animate-pulse-neon">
              <RocketIcon className="w-5 h-5" />
              Cadastrar-se Agora
            </button>
            <button onClick={() => onNavigateToAuth('login')} className="w-full bg-black border transition-all duration-300 text-white font-bold py-4 px-6 rounded-full btn-member-neon">
              Já sou Membro
            </button>
          </div>
        </section>

        {/* Simulation Section */}
        <section id="simulate" className="w-full max-w-md my-16 flex flex-col items-center">
          <h3 className="text-3xl font-bold mb-8">
            {'Simule Seu Resultado'.split('Resultado')[0]}
            <span className="text-[#ff6a00]">Resultado</span>
            {'Simule Seu Resultado'.split('Resultado')[1]}
          </h3>
          <div className="w-full bg-black border border-orange-500/20 rounded-2xl p-6 space-y-4 shadow-2xl shadow-orange-500/10">
            <label htmlFor="investment" className="flex items-center gap-2 text-lg text-orange-400">
              <DollarIcon className="w-6 h-6" />
              Digite o valor do investimento
            </label>
            <div className="relative">
              <input
                type="number"
                id="investment"
                value={investment}
                onChange={(e) => setInvestment(parseFloat(e.target.value))}
                className="w-full bg-black border border-orange-500/30 rounded-lg p-4 text-2xl font-semibold focus:ring-2 focus:ring-[#ff6a00] focus:outline-none"
                placeholder="20"
              />
            </div>
            <p className="text-sm text-gray-500">Investimento mínimo: {formatCurrency(20)}</p>
          </div>

          <div className="w-full bg-black border border-orange-500/20 rounded-2xl p-6 mt-6 shadow-2xl shadow-orange-500/10">
            <p className="flex items-center gap-2 text-lg text-orange-400 mb-2">
                <ChartUpIcon className="w-6 h-6" />
                Seu Lucro Estimado
            </p>
            <p className="text-5xl font-bold text-white">{formatCurrency(simulation.estimatedReturn)}</p>
            <p className="text-md text-green-400 mt-1">+{formatCurrency(simulation.netProfit)} de lucro líquido</p>
            <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between text-lg">
                <div>
                    <p className="text-gray-400 text-sm">Investimento</p>
                    <p className="font-semibold">{formatCurrency(investment)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Valorização</p>
                    <p className="font-semibold text-green-400">{simulation.valuation}%</p>
                </div>
            </div>
          </div>
        </section>

        {/* Urgency Section */}
        <section className="w-full max-w-2xl my-16 flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight">
                {'O Mercado Não Espera'.split('Espera')[0]}
                <span className="text-[#ff6a00]">Espera</span>
            </h3>
          <p className="mt-6 text-lg text-gray-400 max-w-lg">
            A cada segundo, nossa IA identifica novas oportunidades de arbitragem. Enquanto você lê isso, outros já estão lucrando automaticamente.
          </p>
          <div className="mt-10 bg-black border border-orange-500/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff6a00] animate-pulse"></div>
              <h4 className="text-xl font-bold text-white">Vagas Limitadas</h4>
            </div>
            <p className="mt-3 text-gray-400">
              Para garantir um desempenho ideal da IA e não saturar as oportunidades, aceitamos apenas um número limitado de novos membros. Garanta sua vaga hoje.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Simple CSS animation for the neon pulse effect
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
  @keyframes pulse-neon {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 7px #ff6a00, 0 0 10px #ff6a00;
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 15px #ff6a00, 0 0 25px #ff6a00, 0 0 35px #ff9c54;
    }
  }

  .animate-pulse-neon {
    animation: pulse-neon 2s infinite ease-in-out;
  }

  .btn-member-neon {
    border-color: #ff6a00;
    box-shadow: 0 0 5px #ff6a00;
    transition: box-shadow 0.3s ease-in-out;
  }
  .btn-member-neon:hover {
    box-shadow: 0 0 15px #ff6a00, 0 0 20px #ff9c54;
  }
`;
document.head.append(pulseStyle);

export default LandingPage;