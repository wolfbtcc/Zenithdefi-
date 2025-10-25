import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ClipboardCopyIcon, CheckCircleIcon } from './Icons';

interface DepositFlowPageProps {
  type: 'usdt' | 'pix';
  onNavigateToDeposit: () => void;
  onInvest: (amount: number, proofHash: string) => boolean;
  onNavigateToDashboard: () => void;
}

const MIN_DEPOSIT = 20;
const PROCESSING_TIME_MS = 20000;

const usdtQrCode = 'https://i.im.ge/2025/10/25/nK8u7p.1028.jpeg';


const DepositFlowPage: React.FC<DepositFlowPageProps> = ({ type, onNavigateToDeposit, onInvest, onNavigateToDashboard }) => {

  const depositConfig = {
    usdt: {
      title: 'Depositar USDT',
      qrCode: usdtQrCode,
      walletAddress: '0x7bbcF7B423c4b2Be19E3d7540E7eD959F5e2cF04',
      network: 'Rede: Ethereum Mainnet',
      instructions: [
        'Abra sua corretora',
        'Certifique-se de estar na rede Ethereum Mainnet',
        'Envie o valor exato para o endereço acima',
        'Anexe o comprovante da transação',
      ],
    },
    pix: {
      title: 'Depositar via Pix',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913NOME DO TITULAR6008BRASILIA62070503***6304ABCD',
      walletAddress: '123e4567-e89b-12d3-a456-426614174000',
      network: 'Chave Pix Aleatória',
      instructions: [
        'Abra o app do seu banco',
        'Escolha a opção Pagar com QR Code ou Pix Copia e Cola',
        'Confira os dados e confirme o pagamento',
        'Anexe o comprovante da transação',
      ],
    }
  };

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | string>(MIN_DEPOSIT);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = depositConfig[type];

  useEffect(() => {
    if (step !== 3 || !isProcessing) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / PROCESSING_TIME_MS) * 100);
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        onNavigateToDashboard();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [step, isProcessing, onNavigateToDashboard]);

  const handleNextStep = () => {
    setError('');
    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount) || numericAmount < MIN_DEPOSIT) {
      setError('O valor mínimo para depósito é de $20.00.');
      return;
    }
    setStep(2);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Por favor, anexe o comprovante de pagamento.');
      return;
    }
    
    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount)) {
      setError('Valor de depósito inválido.');
      return;
    }
    
    setIsProcessing(true);
    const proofHash = await hashFile(file);
    const success = onInvest(numericAmount, proofHash);
    
    if (success) {
      setStep(3);
    } else {
      setError('Aviso: Se você está tentando burlar o sistema, sua conta será banida. Cada comprovante deve ser único.');
      setIsProcessing(false);
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  async function hashFile(file: File): Promise<string> {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleBack = () => {
    if (step > 1) {
        setStep(prev => prev - 1);
    } else {
        onNavigateToDeposit();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold mb-4 text-center">Valor do Depósito</h3>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 pl-8 text-xl font-semibold text-center focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="20.00"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <button onClick={handleNextStep} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors">
                Continuar
            </button>
          </>
        );
      case 2:
        return (
            <>
                <div className="bg-white p-2 rounded-lg inline-block self-center">
                    <img src={config.qrCode} alt="QR Code" className="w-40 h-40" />
                </div>
                <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 mt-4 flex items-center justify-between">
                    <span className="truncate text-sm mr-2">{config.walletAddress}</span>
                    <button onClick={() => handleCopyToClipboard(config.walletAddress)} className="text-gray-400 hover:text-white">
                        <ClipboardCopyIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="w-full bg-gray-900 border border-gray-700 text-orange-400 font-semibold rounded-lg p-3 mt-2 text-center text-sm">{config.network}</div>
                
                <div className="text-left w-full mt-6">
                    <h4 className="font-bold">Como Depositar</h4>
                    <ul className="space-y-2 text-gray-400 text-sm mt-2">
                        {config.instructions.map((inst, index) => (
                           <li key={index} className="flex items-start gap-2">
                             <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{index+1}</div>
                             <span>{inst}</span>
                           </li>
                        ))}
                    </ul>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`w-full border border-dashed rounded-lg py-3 mt-6 transition-colors ${file ? 'border-green-500 bg-green-900/50 text-green-400' : 'border-gray-600 hover:border-orange-500 hover:bg-orange-900/30'}`}>
                    {file ? `Comprovante: ${file.name}` : 'Anexar Comprovante'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                
                <button onClick={handleSubmit} disabled={!file || isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {isProcessing ? 'Verificando...' : 'Concluir Pagamento'}
                </button>
            </>
        );
      case 3:
        return (
          <div className="text-center w-full">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Processando Depósito</h3>
            <p className="text-gray-400 mt-2 mb-6">Seu depósito está sendo confirmado. Isso pode levar alguns segundos.</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
            </div>
            <p className="mt-2 text-lg font-mono">{Math.round(progress)}%</p>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black pointer-events-none"></div>

      <header className="w-full max-w-2xl mx-auto flex items-center z-10 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Voltar"
          disabled={step === 3}
          style={{ visibility: step === 3 ? 'hidden' : 'visible' }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="flex-grow text-center text-xl font-bold text-white">
          {step === 3 ? 'Processando' : config.title}
        </h1>
        <div className="w-20" style={{ visibility: step === 3 ? 'hidden' : 'visible' }}></div>
      </header>

      <main className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="bg-black border border-white/10 rounded-2xl p-6 w-full flex flex-col items-center">
            {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default DepositFlowPage;
