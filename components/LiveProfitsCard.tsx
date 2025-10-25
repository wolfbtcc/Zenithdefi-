import React, { useState, useEffect, useCallback } from 'react';
import { ChartUpIcon } from './Icons';

// Data for notifications
const profitData = [
    { name: 'Lucas S.', country: '🇧🇷', countryName: 'Brasil' },
    { name: 'John D.', country: '🇺🇸', countryName: 'EUA' },
    { name: 'Kenji T.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Priya K.', country: '🇮🇳', countryName: 'Índia' },
    { name: 'Müller G.', country: '🇩🇪', countryName: 'Alemanha' },
    { name: 'Sophie L.', country: '🇫🇷', countryName: 'França' },
    { name: 'Carlos R.', country: '🇪🇸', countryName: 'Espanha' },
    { name: 'Wei L.', country: '🇨🇳', countryName: 'China' },
    { name: 'Isabella F.', country: '🇮🇹', countryName: 'Itália' },
    { name: 'Liam O.', country: '🇦🇺', countryName: 'Austrália' },
    { name: 'Fatima A.', country: '🇦🇪', countryName: 'E.A.U' },
    { name: 'David C.', country: '🇨🇦', countryName: 'Canadá' },
    { name: 'Olga V.', country: '🇷🇺', countryName: 'Rússia' },
    { name: 'Javier M.', country: '🇲🇽', countryName: 'México' },
    { name: 'Aisha N.', country: '🇳🇬', countryName: 'Nigéria' },
    { name: 'Chloe K.', country: '🇰🇷', countryName: 'Coréia do Sul' },
    { name: 'Marco B.', country: '🇦🇷', countryName: 'Argentina' },
    { name: 'Hassan A.', country: '🇸🇦', countryName: 'Arábia Saudita' },
    { name: 'Yuki S.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Elena P.', country: '🇬🇷', countryName: 'Grécia' },
    { name: 'Ahmed M.', country: '🇪🇬', countryName: 'Egito' },
    { name: 'Freja N.', country: '🇩🇰', countryName: 'Dinamarca' },
    { name: 'Daniel L.', country: '🇬🇧', countryName: 'Reino Unido' },
    { name: 'Anika S.', country: '🇧🇩', countryName: 'Bangladesh' },
    { name: 'Mateo G.', country: '🇨🇴', countryName: 'Colômbia' },
    { name: 'Sofia R.', country: '🇵🇹', countryName: 'Portugal' },
    { name: 'Ivan D.', country: '🇺🇦', countryName: 'Ucrânia' },
    { name: 'Noor H.', country: '🇵🇰', countryName: 'Paquistão' },
    { name: 'Erik S.', country: '🇸🇪', countryName: 'Suécia' },
    { name: 'Maria V.', country: '🇻🇪', countryName: 'Venezuela' },
    { name: 'Chen M.', country: '🇹🇼', countryName: 'Taiwan' },
    { name: 'Gabriel A.', country: '🇧🇷', countryName: 'Brasil' },
    { name: 'Emily W.', country: '🇺🇸', countryName: 'EUA' },
    { name: 'Haruto N.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Aditi R.', country: '🇮🇳', countryName: 'Índia' },
    { name: 'Leon K.', country: '🇩🇪', countryName: 'Alemanha' },
    { name: 'Camille D.', country: '🇫🇷', countryName: 'França' },
    { name: 'Mateo S.', country: '🇪🇸', countryName: 'Espanha' },
    { name: 'Lin Y.', country: '🇨🇳', countryName: 'China' },
    { name: 'Giulia M.', country: '🇮🇹', countryName: 'Itália' },
    { name: 'Oscar J.', country: '🇦🇺', countryName: 'Austrália' },
    { name: 'Layla K.', country: '🇦🇪', countryName: 'E.A.U' },
    { name: 'Noah T.', country: '🇨🇦', countryName: 'Canadá' },
    { name: 'Anastasia I.', country: '🇷🇺', countryName: 'Rússia' },
    { name: 'Santiago H.', country: '🇲🇽', countryName: 'México' },
    { name: 'Zainab B.', country: '🇳🇬', countryName: 'Nigéria' },
    { name: 'Ji-hoon P.', country: '🇰🇷', countryName: 'Coréia do Sul' },
    { name: 'Valentina R.', country: '🇦🇷', countryName: 'Argentina' },
    { name: 'Youssef E.', country: '🇸🇦', countryName: 'Arábia Saudita' },
    { name: 'Sakura I.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Niko P.', country: '🇬🇷', countryName: 'Grécia' },
    { name: 'Omar S.', country: '🇪🇬', countryName: 'Egito' },
    { name: 'Ida J.', country: '🇩🇰', countryName: 'Dinamarca' },
    { name: 'Harry P.', country: '🇬🇧', countryName: 'Reino Unido' },
    { name: 'Farah A.', country: '🇧🇩', countryName: 'Bangladesh' },
    { name: 'Isabella G.', country: '🇨🇴', countryName: 'Colômbia' },
    { name: 'Tiago S.', country: '🇵🇹', countryName: 'Portugal' },
    { name: 'Kateryna M.', country: '🇺🇦', countryName: 'Ucrânia' },
    { name: 'Imran K.', country: '🇵🇰', countryName: 'Paquistão' },
    { name: 'Elsa L.', country: '🇸🇪', countryName: 'Suécia' },
    { name: 'Ana M.', country: '🇻🇪', countryName: 'Venezuela' },
    { name: 'Min-jun K.', country: '🇹🇼', countryName: 'Taiwan' },
    { name: 'Laura C.', country: '🇧🇷', countryName: 'Brasil' },
    { name: 'Michael B.', country: '🇺🇸', countryName: 'EUA' },
    { name: 'Rin T.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Arjun S.', country: '🇮🇳', countryName: 'Índia' },
    { name: 'Hanna S.', country: '🇩🇪', countryName: 'Alemanha' },
    { name: 'Louis M.', country: '🇫🇷', countryName: 'França' },
    { name: 'Lucia F.', country: '🇪🇸', countryName: 'Espanha' },
    { name: 'Zhang W.', country: '🇨🇳', countryName: 'China' },
    { name: 'Leonardo C.', country: '🇮🇹', countryName: 'Itália' },
    { name: 'Mia W.', country: '🇦🇺', countryName: 'Austrália' },
    { name: 'Amara A.', country: '🇦🇪', countryName: 'E.A.U' },
    { name: 'Benjamin M.', country: '🇨🇦', countryName: 'Canadá' },
    { name: 'Svetlana K.', country: '🇷🇺', countryName: 'Rússia' },
    { name: 'Valeria L.', country: '🇲🇽', countryName: 'México' },
    { name: 'Chiamaka O.', country: '🇳🇬', countryName: 'Nigéria' },
    { name: 'Seo-yeon L.', country: '🇰🇷', countryName: 'Coréia do Sul' },
    { name: 'Agustin F.', country: '🇦🇷', countryName: 'Argentina' },
    { name: 'Khaled A.', country: '🇸🇦', countryName: 'Arábia Saudita' },
    { name: 'Mei Y.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Dimitri A.', country: '🇬🇷', countryName: 'Grécia' },
    { name: 'Nadia H.', country: '🇪🇬', countryName: 'Egito' },
    { name: 'Mads P.', country: '🇩🇰', countryName: 'Dinamarca' },
    { name: 'Charlotte H.', country: '🇬🇧', countryName: 'Reino Unido' },
    { name: 'Rohan I.', country: '🇧🇩', countryName: 'Bangladesh' },
    { name: 'Camila V.', country: '🇨🇴', countryName: 'Colômbia' },
    { name: 'Diogo A.', country: '🇵🇹', countryName: 'Portugal' },
    { name: 'Viktor S.', country: '🇺🇦', countryName: 'Ucrânia' },
    { name: 'Sana R.', country: '🇵🇰', countryName: 'Paquistão' },
    { name: 'Astrid B.', country: '🇸🇪', countryName: 'Suécia' },
    { name: 'Ricardo P.', country: '🇻🇪', countryName: 'Venezuela' },
    { name: 'Yi-ting L.', country: '🇹🇼', countryName: 'Taiwan' },
    { name: 'Beatriz L.', country: '🇧🇷', countryName: 'Brasil' },
    { name: 'James J.', country: '🇺🇸', countryName: 'EUA' },
    { name: 'Kaito Y.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Anaya M.', country: '🇮🇳', countryName: 'Índia' },
    { name: 'Felix W.', country: '🇩🇪', countryName: 'Alemanha' },
    { name: 'Manon G.', country: '🇫🇷', countryName: 'França' },
    { name: 'Pablo M.', country: '🇪🇸', countryName: 'Espanha' },
    { name: 'Liu J.', country: '🇨🇳', countryName: 'China' },
    { name: 'Francesco R.', country: '🇮🇹', countryName: 'Itália' },
    { name: 'Zoe T.', country: '🇦🇺', countryName: 'Austrália' },
    { name: 'Omar Al J.', country: '🇦🇪', countryName: 'E.A.U' },
    { name: 'Lucas G.', country: '🇨🇦', countryName: 'Canadá' },
    { name: 'Natalia P.', country: '🇷🇺', countryName: 'Rússia' },
    { name: 'Regina V.', country: '🇲🇽', countryName: 'México' },
    { name: 'Emeka A.', country: '🇳🇬', countryName: 'Nigéria' },
    { name: 'Min-soo C.', country: '🇰🇷', countryName: 'Coréia do Sul' },
    { name: 'Martina G.', country: '🇦🇷', countryName: 'Argentina' },
    { name: 'Abdullah S.', country: '🇸🇦', countryName: 'Arábia Saudita' },
    { name: 'Hina K.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Alexios K.', country: '🇬🇷', countryName: 'Grécia' },
    { name: 'Salma I.', country: '🇪🇬', countryName: 'Egito' },
    { name: 'Aksel N.', country: '🇩🇰', countryName: 'Dinamarca' },
    { name: 'Oliver S.', country: '🇬🇧', countryName: 'Reino Unido' },
    { name: 'Ishaan C.', country: '🇧🇩', countryName: 'Bangladesh' },
    { name: 'Daniela M.', country: '🇨🇴', countryName: 'Colômbia' },
    { name: 'Rui P.', country: '🇵🇹', countryName: 'Portugal' },
    { name: 'Andriy K.', country: '🇺🇦', countryName: 'Ucrânia' },
    { name: 'Ayesha K.', country: '🇵🇰', countryName: 'Paquistão' },
    { name: 'Linnea E.', country: '🇸🇪', countryName: 'Suécia' },
    { name: 'Carlos M.', country: '🇻🇪', countryName: 'Venezuela' },
    { name: 'Chih-hao W.', country: '🇹🇼', countryName: 'Taiwan' },
    { name: 'Fernanda O.', country: '🇧🇷', countryName: 'Brasil' },
    { name: 'William S.', country: '🇺🇸', countryName: 'EUA' },
    { name: 'Yui M.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Vivaan P.', country: '🇮🇳', countryName: 'Índia' },
    { name: 'Lina M.', country: '🇩🇪', countryName: 'Alemanha' },
    { name: 'Antoine R.', country: '🇫🇷', countryName: 'França' },
    { name: 'Sofia N.', country: '🇪🇸', countryName: 'Espanha' },
    { name: 'Wang X.', country: '🇨🇳', countryName: 'China' },
    { name: 'Alessandro B.', country: '🇮🇹', countryName: 'Itália' },
    { name: 'Isla K.', country: '🇦🇺', countryName: 'Austrália' },
    { name: 'Zayed H.', country: '🇦🇪', countryName: 'E.A.U' },
    { name: 'Chloe L.', country: '🇨🇦', countryName: 'Canadá' },
    { name: 'Dmitry S.', country: '🇷🇺', countryName: 'Rússia' },
    { name: 'Fernanda G.', country: '🇲🇽', countryName: 'México' },
    { name: 'Ngozi E.', country: '🇳🇬', countryName: 'Nigéria' },
    { name: 'Hae-won S.', country: '🇰🇷', countryName: 'Coréia do Sul' },
    { name: 'Leo M.', country: '🇦🇷', countryName: 'Argentina' },
    { name: 'Reem F.', country: '🇸🇦', countryName: 'Arábia Saudita' },
    { name: 'Ren O.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Eleni V.', country: '🇬🇷', countryName: 'Grécia' },
    { name: 'Karim Z.', country: '🇪🇬', countryName: 'Egito' },
    { name: 'Sofie L.', country: '🇩🇰', countryName: 'Dinamarca' },
    { name: 'George C.', country: '🇬🇧', countryName: 'Reino Unido' },
    { name: 'Anika T.', country: '🇧🇩', countryName: 'Bangladesh' },
    { name: 'Juan P.', country: '🇨🇴', countryName: 'Colômbia' },
    { name: 'Ines F.', country: '🇵🇹', countryName: 'Portugal' },
    { name: 'Taras P.', country: '🇺🇦', countryName: 'Ucrânia' },
    { name: 'Fatima Z.', country: '🇵🇰', countryName: 'Paquistão' },
    { name: 'Oskar N.', country: '🇸🇪', countryName: 'Suécia' },
    { name: 'Gabriela R.', country: '🇻🇪', countryName: 'Venezuela' },
    { name: 'Jia-lin C.', country: '🇹🇼', countryName: 'Taiwan' },
    { name: 'Rafael P.', country: '🇧🇷', countryName: 'Brasil' },
    { name: 'Ava M.', country: '🇺🇸', countryName: 'EUA' },
    { name: 'Sota F.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Kiara V.', country: '🇮🇳', countryName: 'Índia' },
    { name: 'Anton S.', country: '🇩🇪', countryName: 'Alemanha' },
    { name: 'Lea P.', country: '🇫🇷', countryName: 'França' },
    { name: 'Hugo G.', country: '🇪🇸', countryName: 'Espanha' },
    { name: 'Zhao L.', country: '🇨🇳', countryName: 'China' },
    { name: 'Riccardo L.', country: '🇮🇹', countryName: 'Itália' },
    { name: 'Matilda R.', country: '🇦🇺', countryName: 'Austrália' },
    { name: 'Saif M.', country: '🇦🇪', countryName: 'E.A.U' },
    { name: 'Mia C.', country: '🇨🇦', countryName: 'Canadá' },
    { name: 'Ekaterina V.', country: '🇷🇺', countryName: 'Rússia' },
    { name: 'Camila R.', country: '🇲🇽', countryName: 'México' },
    { name: 'Adekunle A.', country: '🇳🇬', countryName: 'Nigéria' },
    { name: 'Ji-woo K.', country: '🇰🇷', countryName: 'Coréia do Sul' },
    { name: 'Benjamin D.', country: '🇦🇷', countryName: 'Argentina' },
    { name: 'Layan R.', country: '🇸🇦', countryName: 'Arábia Saudita' },
    { name: 'Yuto H.', country: '🇯🇵', countryName: 'Japão' },
    { name: 'Zoe G.', country: '🇬🇷', countryName: 'Grécia' },
    { name: 'Yara T.', country: '🇪🇬', countryName: 'Egito' },
    { name: 'Villads K.', country: '🇩🇰', countryName: 'Dinamarca' },
    { name: 'Amelia E.', country: '🇬🇧', countryName: 'Reino Unido' },
    { name: 'Aryan H.', country: '🇧🇩', countryName: 'Bangladesh' },
    { name: 'Sebastian L.', country: '🇨🇴', countryName: 'Colômbia' },
    { name: 'Leonor M.', country: '🇵🇹', countryName: 'Portugal' },
    { name: 'Yaroslava B.', country: '🇺🇦', countryName: 'Ucrânia' },
    { name: 'Ali H.', country: '🇵🇰', countryName: 'Paquistão' },
    { name: 'Maja S.', country: '🇸🇪', countryName: 'Suécia' },
    { name: 'Andres G.', country: '🇻🇪', countryName: 'Venezuela' },
    { name: 'Hsin-yi H.', country: '🇹🇼', countryName: 'Taiwan' },
];

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

const LiveProfitsCard: React.FC = () => {
    const [currentProfit, setCurrentProfit] = useState<{ name: string; country: string; countryName: string; profit: number } | null>(null);
    const [animationKey, setAnimationKey] = useState(0);
    const [shuffledUsers, setShuffledUsers] = useState(() => shuffleArray(profitData));
    const [currentIndex, setCurrentIndex] = useState(0);

    const showNextProfit = useCallback(() => {
        let nextIndex = currentIndex;
        let currentShuffledList = shuffledUsers;
        
        // If we've shown everyone, reshuffle and start over
        if (nextIndex >= currentShuffledList.length) {
            const newList = shuffleArray(profitData);
            setShuffledUsers(newList);
            currentShuffledList = newList;
            nextIndex = 0;
        }
        
        const user = currentShuffledList[nextIndex];

        // Generate a profit value, skewed towards smaller amounts for realism
        const minProfit = 5.45;
        const maxProfit = 3456.12;
        const randomFactor = Math.random() * Math.random(); // This skews results toward the lower end
        const randomProfit = minProfit + randomFactor * (maxProfit - minProfit);
        
        setCurrentProfit({
            ...user,
            profit: randomProfit
        });
        
        setAnimationKey(prev => prev + 1);
        setCurrentIndex(nextIndex + 1);
    }, [currentIndex, shuffledUsers]);

    useEffect(() => {
        // Initial profit after a small delay
        const initialTimeout = setTimeout(showNextProfit, 500); 
        const interval = setInterval(showNextProfit, 10000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [showNextProfit]);

    if (!currentProfit) return null;

    return (
        <div key={animationKey} className="w-full max-w-sm sm:max-w-md mx-auto mt-6">
            <div className="bg-black border rounded-2xl p-4 animate-slide-in-3d animate-pulse-border-orange" style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                         <div className="text-2xl">{currentProfit.country}</div>
                         <div>
                            <p className="font-semibold text-white">{currentProfit.name}</p>
                            <p className="text-xs text-gray-400">{currentProfit.countryName}</p>
                         </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-green-400 flex items-center gap-1">
                           <ChartUpIcon className="w-4 h-4" />
                           {formatCurrency(currentProfit.profit)}
                        </p>
                        <p className="text-xs text-gray-500">Lucro Recente</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Add animation styles to the document head
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-3d {
    from {
      opacity: 0;
      transform: perspective(600px) rotateX(-15deg) translateY(15px);
    }
    to {
      opacity: 1;
      transform: perspective(600px) rotateX(0deg) translateY(0);
    }
  }
  .animate-slide-in-3d {
    animation: slide-in-3d 0.7s ease-out forwards;
  }

  @keyframes pulse-border-orange {
    0%, 100% {
      border-color: rgba(255, 106, 0, 0.6);
      box-shadow: 0 0 8px rgba(255, 106, 0, 0.4), 0 0 12px rgba(255, 106, 0, 0.3);
    }
    50% {
      border-color: rgba(255, 106, 0, 1);
      box-shadow: 0 0 18px rgba(255, 106, 0, 0.7), 0 0 30px rgba(255, 106, 0, 0.5);
    }
  }
  .animate-pulse-border-orange {
    animation: pulse-border-orange 2.5s infinite ease-in-out;
  }
`;
document.head.append(style);

export default LiveProfitsCard;
