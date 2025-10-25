import React from 'react';

interface ConnectWalletButtonProps {
    account: string | null;
    onClick: () => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ account, onClick }) => {
    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-sm border rounded-full px-3 py-1.5 transition-colors ${
                account
                    ? 'border-green-500/50 bg-green-900/30 hover:bg-green-900/60'
                    : 'border-orange-500/50 bg-orange-900/30 hover:bg-orange-900/60'
            }`}
        >
            {account ? (
                <>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-white font-mono">{truncateAddress(account)}</span>
                </>
            ) : (
                'Conectar Carteira'
            )}
        </button>
    );
};

export default ConnectWalletButton;
