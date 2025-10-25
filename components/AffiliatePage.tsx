import React, { useState } from 'react';
import { ArrowLeftIcon, LinkIcon, UsersIcon, TrophyIcon, CheckCircleIcon, WhatsAppIcon, DollarIcon } from './Icons';
import type { User, Financials } from '../types';

interface AffiliatePageProps {
  user: User;
  financials: Financials;
  referredUsers: User[];
  onNavigateToDashboard: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
};

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-black border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="bg-orange-900/50 p-3 rounded-lg border border-orange-500/30">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);


const AffiliatePage: React.FC<AffiliatePageProps> = ({ user, financials, referredUsers, onNavigateToDashboard }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${user.affiliateId || ''}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopySuccess('Link copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falha ao copiar.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    const maskName = (name: string) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
        }
        return name;
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black pointer-events-none"></div>

            <header className="w-full max-w-4xl mx-auto flex items-center z-10 mb-8">
                <button 
                    onClick={onNavigateToDashboard} 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Voltar para o painel"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Voltar</span>
                </button>
                <h1 className="flex-grow text-center text-xl sm:text-2xl font-bold text-orange-500">
                    Programa de Afiliados
                </h1>
                <div className="w-16 sm:w-24"></div>
            </header>

            <main className="w-full max-w-4xl z-10 flex flex-col gap-8">
                {/* How it works & Link Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black border border-gray-800 rounded-2xl p-6">
                         <h2 className="text-2xl font-bold text-white mb-3">Como Funciona</h2>
                         <p className="text-gray-400 mb-4">
                            Indique novos usuários para a Zenith AI e ganhe uma comissão de <span className="font-bold text-green-400">25% sobre o lucro líquido</span> de cada operação que eles realizarem. Seus ganhos são residuais e creditados instantaneamente.
                         </p>
                         <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-orange-500"/> Ganhos recorrentes e automáticos.</li>
                            <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-orange-500"/> Sem limite de indicados ou ganhos.</li>
                            <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-orange-500"/> O valor é somado ao seu saldo principal.</li>
                         </ul>
                    </div>
                     <div className="bg-black border border-gray-800 rounded-2xl p-6 flex flex-col justify-center">
                         <h2 className="text-2xl font-bold text-white mb-3">Seu Link de Afiliado</h2>
                         <div className="relative">
                            <input type="text" readOnly value={referralLink} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pr-28 text-sm text-gray-300"/>
                            <button onClick={handleCopyLink} className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md text-sm">
                                {copySuccess || 'Copiar Link'}
                            </button>
                         </div>
                         <p className="text-xs text-gray-500 mt-2">Compartilhe este link. Qualquer usuário que se cadastrar através dele se tornará seu indicado.</p>
                    </div>
                </div>

                {/* Cashback Section */}
                <div className="bg-black border border-green-500/30 rounded-2xl p-6 shadow-lg shadow-green-500/10">
                    <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">PROMOÇÃO DE CASHBACK</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                        {/* Card for the amount */}
                        <div className="md:col-span-2 bg-black border border-green-700/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full shadow-xl shadow-green-500/15">
                            <DollarIcon className="w-10 h-10 text-green-400 mb-2"/>
                            <p className="text-gray-400 text-base">Prêmio de Cashback</p>
                            <p className="text-5xl font-extrabold text-white mt-1">
                                {formatCurrency(500)}
                            </p>
                            <p className="text-sm text-green-500 mt-1">Direto na sua carteira</p>
                        </div>

                        {/* Requirements */}
                        <div className="md:col-span-3">
                            <h3 className="text-lg font-bold text-white mb-3">Requisitos para ganhar:</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div><span>Depósito inicial ≥ 100 USD na Zenith AI.</span></li>
                                <li className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div><span>Convidar 15 novos usuários (ciclo mensal).</span></li>
                                <li className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div><span>Publicar diariamente (1 post/story por 30 dias) mencionando @ZenithAI + seu link.</span></li>
                                <li className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div><span>Enviar comprovantes dos indicados e posts para o suporte.</span></li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-gray-400 mt-6 text-center text-sm">
                        Após aprovação em até 24 horas, você recebe os 500 USD.
                    </p>
                    <a 
                        href="https://wa.link/8aeafx" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-4 w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <WhatsAppIcon className="w-6 h-6" />
                        Enviar Comprovantes via WhatsApp
                    </a>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Total de Indicados" value={referredUsers.length} icon={<UsersIcon className="w-7 h-7 text-orange-400"/>} />
                    <StatCard title="Ganhos de Afiliados" value={formatCurrency(financials.affiliateEarnings)} icon={<TrophyIcon className="w-7 h-7 text-orange-400"/>} />
                </div>

                {/* Referred Users List */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Seus Indicados</h2>
                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        {referredUsers.length > 0 ? (
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="p-3 text-sm font-semibold text-gray-400">Nome</th>
                                            <th className="p-3 text-sm font-semibold text-gray-400 text-right">Data de Cadastro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referredUsers.map(refUser => (
                                            <tr key={refUser.email} className="border-b border-gray-800 hover:bg-gray-900/50">
                                                <td className="p-3 text-white">{maskName(refUser.name)}</td>
                                                <td className="p-3 text-gray-300 text-right">
                                                    {refUser.registrationDate ? new Date(refUser.registrationDate).toLocaleDateString('pt-BR') : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <UsersIcon className="w-12 h-12 mx-auto text-gray-600 mb-2"/>
                                <p className="text-gray-500">Você ainda não tem indicados.</p>
                                <p className="text-gray-600 text-sm">Comece a compartilhar seu link!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AffiliatePage;
