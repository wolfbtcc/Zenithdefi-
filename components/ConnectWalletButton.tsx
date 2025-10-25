import React, { useState, useEffect, useRef } from 'react';
import { LogoutIcon } from './Icons';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const ConnectWalletButton: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const checkWalletConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } catch (err) {
                console.error("Error checking for wallet connection:", err);
            }
        }
    };

    useEffect(() => {
        checkWalletConnection();

        if (window.ethereum) {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                    setIsOpen(false); // Close dropdown if disconnected from Metamask side
                }
            };
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    const connectWallet = async () => {
        setError(null);
        if (!window.ethereum) {
            setError("MetaMask não está instalado. Por favor, instale a extensão.");
            window.open("https://metamask.io/download/", "_blank");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            }
        } catch (err: any) {
            if (err.code === 4001) {
                setError("Conexão com a carteira rejeitada.");
            } else {
                setError("Ocorreu um erro ao conectar a carteira.");
                console.error(err);
            }
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsOpen(false);
    };

    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div className="relative flex flex-col items-end" ref={dropdownRef}>
            {account ? (
                <>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 text-sm border border-green-500/50 bg-green-900/30 rounded-full px-3 py-1.5 hover:bg-green-900/60 transition-colors"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-white font-mono">{truncateAddress(account)}</span>
                    </button>
                    {isOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-black border border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in-up p-4">
                            <div className="text-white font-mono text-sm break-all" title={account}>
                                {account}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-green-400 text-xs">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                Conectado
                            </div>
                            <hr className="border-gray-700 my-3"/>
                            <button
                                onClick={disconnectWallet}
                                className="w-full text-left flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
                            >
                                <LogoutIcon className="w-5 h-5"/>
                                Desconectar
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 text-sm border border-orange-500/50 bg-orange-900/30 rounded-full px-3 py-1.5 hover:bg-orange-900/60 transition-colors"
                >
                    Conectar Carteira
                </button>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default ConnectWalletButton;
