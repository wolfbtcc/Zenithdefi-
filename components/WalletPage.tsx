import React, { useState } from 'react';
import { ArrowLeftIcon, WalletIcon, CheckCircleIcon, XIcon } from './Icons';

interface WalletPageProps {
  account: string | null;
  onConnect: () => Promise<{ success: boolean; error?: string }>;
  onDisconnect: () => void;
  onNavigateBack: () => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ account, onConnect, onDisconnect, onNavigateBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        setError(null);
        setIsLoading(true);
        const result = await onConnect();
        if (!result.success) {
            setError(result.error || 'Falha ao conectar.');
        }
        setIsLoading(false);
    };

    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black pointer-events-none"></div>

            <header className="w-full max-w-2xl mx-auto flex items-center z-10 mb-8">
                <button 
                    onClick={onNavigateBack} 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Voltar para o painel"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar</span>
                </button>
                <h1 className="flex-grow text-center text-xl font-bold text-orange-500">
                    Minha Carteira
                </h1>
                <div className="w-20"></div>
            </header>

            <main className="w-full max-w-md z-10 flex flex-col gap-6">
                <div className="bg-black border border-gray-800 rounded-2xl p-6 text-center">
                    <WalletIcon className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    {account ? (
                        <>
                            <h2 className="text-2xl font-bold text-white">Carteira Conectada</h2>
                            <div className="flex items-center justify-center gap-2 mt-2 text-green-400">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>Conectado</span>
                            </div>
                            <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-400">Endereço da Carteira</p>
                                <p className="font-mono text-lg text-white break-words" title={account}>{truncateAddress(account)}</p>
                            </div>
                            <button
                                onClick={onDisconnect}
                                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Desconectar
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-white">Carteira Desconectada</h2>
                             <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
                                <XIcon className="w-5 h-5" />
                                <span>Desconectado</span>
                            </div>
                            <p className="text-gray-400 mt-6 max-w-xs mx-auto">
                                Nenhuma carteira conectada. Clique abaixo para vincular sua Metamask.
                            </p>
                            <button
                                onClick={handleConnect}
                                disabled={isLoading}
                                className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-600"
                            >
                                {isLoading ? 'Conectando...' : 'Conectar Carteira'}
                            </button>
                        </>
                    )}
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </main>
        </div>
    );
};

export default WalletPage;
