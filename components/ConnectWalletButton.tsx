import React, { useState, useEffect } from 'react';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const ConnectWalletButton: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div className="flex flex-col items-end">
            {account ? (
                <div className="flex items-center gap-2 text-sm border border-green-500/50 bg-green-900/30 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-white font-mono" title={account}>{truncateAddress(account)}</span>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 text-sm border border-orange-500/50 bg-orange-900/30 rounded-full px-3 py-1.5 hover:bg-orange-900/60 transition-colors"
                >
                    Conectar Carteira
                </button>
            )}
            {error && <p className="text-red-500 text-xs mt-1 absolute top-full">{error}</p>}
        </div>
    );
};

export default ConnectWalletButton;
