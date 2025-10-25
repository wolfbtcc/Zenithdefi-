import React, { useState } from 'react';
import { XIcon } from './Icons';
import type { Withdrawal } from '../types';

interface WithdrawModalProps {
    type: 'usdt' | 'pix';
    availableBalance: number;
    onClose: () => void;
    onSubmit: (data: Omit<Withdrawal, 'id' | 'timestamp' | 'fee'>) => boolean;
}

const MIN_WITHDRAWAL = 20;

const WithdrawModal: React.FC<WithdrawModalProps> = ({ type, availableBalance, onClose, onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [addressOrKey, setAddressOrKey] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const config = {
        usdt: {
            title: 'Sacar em USDT (TRC20)',
            addressLabel: 'Carteira USDT TRC20',
            addressPlaceholder: 'T...',
        },
        pix: {
            title: 'Sacar via PIX',
            addressLabel: 'Chave PIX',
            addressPlaceholder: 'CPF, Email, Telefone ou Chave aleatória',
        }
    };

    const currentConfig = config[type];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const numericAmount = parseFloat(amount);

        if (!fullName || !addressOrKey || !amount) {
            setError('Todos os campos são obrigatórios.');
            setIsSubmitting(false);
            return;
        }

        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Por favor, insira um valor de saque válido.');
            setIsSubmitting(false);
            return;
        }

        if (numericAmount < MIN_WITHDRAWAL) {
            setError(`O valor mínimo para saque é de $${MIN_WITHDRAWAL.toFixed(2)}.`);
            setIsSubmitting(false);
            return;
        }

        if (numericAmount > availableBalance) {
            setError('Saldo insuficiente para realizar este saque.');
            setIsSubmitting(false);
            return;
        }

        const withdrawalData = {
            method: type.toUpperCase() as 'USDT' | 'PIX',
            amount: numericAmount,
            details: {
                fullName,
                ...(type === 'usdt' ? { address: addressOrKey } : { pixKey: addressOrKey }),
            },
        };

        const success = onSubmit(withdrawalData);
        if(!success) {
            // This case should theoretically not be hit if validations are correct
            // but it's good for handling unexpected failures from the parent.
            setError('Ocorreu um erro ao processar o saque. Tente novamente.');
            setIsSubmitting(false);
        }
    };

    const fee = parseFloat(amount) > 0 ? parseFloat(amount) * 0.03 : 0;
    const amountToReceive = parseFloat(amount) > 0 ? parseFloat(amount) - fee : 0;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-black border border-orange-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-orange-500/20 w-full max-w-md animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{currentConfig.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-400 mb-6">Preencha os dados para solicitar seu saque.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Seu nome completo"
                            className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="addressOrKey" className="block text-sm font-medium text-gray-300 mb-1">{currentConfig.addressLabel}</label>
                        <input
                            id="addressOrKey"
                            type="text"
                            value={addressOrKey}
                            onChange={(e) => setAddressOrKey(e.target.value)}
                            placeholder={currentConfig.addressPlaceholder}
                            className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Valor do Saque ($)</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="block w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="text-sm space-y-1 pt-2 text-gray-400">
                        <div className="flex justify-between">
                            <span>Taxa de saque (3%):</span>
                            <span className="font-medium text-red-400">
                                - ${fee.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-base">
                            <span className="text-white">Você recebe:</span>
                            <span className="text-green-400">
                                ${amountToReceive.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transition-all duration-300 disabled:bg-gray-600"
                        >
                            {isSubmitting ? 'Processando...' : 'Solicitar Saque'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default WithdrawModal;