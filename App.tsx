
import React, { useState, useCallback, useEffect } from 'react';
import type { User, Page, Financials, Operation, Withdrawal, InvestmentRescue } from './types';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import ArbitragePage from './components/ArbitragePage';
import DepositPage from './components/DepositPage';
import DepositFlowPage from './components/DepositModal';
import WithdrawPage from './components/WithdrawPage';
import RescuePage from './components/RescuePage';
import AffiliatePage from './components/AffiliatePage';


// --- LocalStorage Helper Functions ---

// Central User Registry
const getStoredAllUserEmails = (): string[] => {
    try {
        const stored = localStorage.getItem('all_users');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to parse all user emails from localStorage", error);
        return [];
    }
}

const setStoredAllUserEmails = (emails: string[]) => {
    try {
        localStorage.setItem('all_users', JSON.stringify(emails));
    } catch (error) {
        console.error("Failed to save all user emails to localStorage", error);
    }
}

const getStoredUser = (email: string): User | null => {
    try {
        const stored = localStorage.getItem(`user_${email}`);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
    }
};

const setStoredUser = (email: string, user: User) => {
    try {
        localStorage.setItem(`user_${email}`, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
};


const getStoredFinancials = (email: string): Pick<Financials, 'balance' | 'totalInvested' | 'affiliateEarnings'> => {
    try {
        const stored = localStorage.getItem(`financials_${email}`);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                balance: parsed.balance || 0,
                totalInvested: parsed.totalInvested || 0,
                affiliateEarnings: parsed.affiliateEarnings || 0
            };
        }
    } catch (error) {
        console.error("Failed to parse financials from localStorage", error);
    }
    return { balance: 0, totalInvested: 0, affiliateEarnings: 0 };
};

const setStoredFinancials = (email: string, financials: Financials) => {
    try {
        localStorage.setItem(`financials_${email}`, JSON.stringify(financials));
    } catch (error) {
        console.error("Failed to save financials to localStorage", error);
    }
};

const getStoredProofHashes = (email: string): Set<string> => {
    try {
        const stored = localStorage.getItem(`proofHashes_${email}`);
        if (stored) {
            return new Set(JSON.parse(stored));
        }
    } catch (error) {
        console.error("Failed to parse proof hashes from localStorage", error);
    }
    return new Set();
};

const setStoredProofHashes = (email: string, hashes: Set<string>) => {
    try {
        localStorage.setItem(`proofHashes_${email}`, JSON.stringify(Array.from(hashes)));
    } catch (error) {
        console.error("Failed to save proof hashes to localStorage", error);
    }
};

const getStoredOperations = (email: string): Operation[] => {
    try {
        const stored = localStorage.getItem(`operations_${email}`);
        if (stored) {
            // Re-hydrate dates from strings
            return JSON.parse(stored).map((op: any) => ({
                ...op,
                timestamp: new Date(op.timestamp)
            }));
        }
    } catch (error) {
        console.error("Failed to parse operations from localStorage", error);
    }
    return [];
};

const setStoredOperations = (email: string, operations: Operation[]) => {
    try {
        localStorage.setItem(`operations_${email}`, JSON.stringify(operations));
    } catch (error) {
        console.error("Failed to save operations to localStorage", error);
    }
};

const getStoredWithdrawals = (email: string): Withdrawal[] => {
    try {
        const stored = localStorage.getItem(`withdrawals_${email}`);
        if (stored) {
             return JSON.parse(stored).map((w: any) => ({
                ...w,
                timestamp: new Date(w.timestamp)
            }));
        }
    } catch (error) {
        console.error("Failed to parse withdrawals from localStorage", error);
    }
    return [];
};

const setStoredWithdrawals = (email: string, withdrawals: Withdrawal[]) => {
    try {
        localStorage.setItem(`withdrawals_${email}`, JSON.stringify(withdrawals));
    } catch (error) {
        console.error("Failed to save withdrawals to localStorage", error);
    }
};

const getStoredInvestmentRescues = (email: string): InvestmentRescue[] => {
    try {
        const stored = localStorage.getItem(`rescues_${email}`);
        if (stored) {
             return JSON.parse(stored).map((r: any) => ({
                ...r,
                timestamp: new Date(r.timestamp)
            }));
        }
    } catch (error) {
        console.error("Failed to parse investment rescues from localStorage", error);
    }
    return [];
};

const setStoredInvestmentRescues = (email: string, rescues: InvestmentRescue[]) => {
    try {
        localStorage.setItem(`rescues_${email}`, JSON.stringify(rescues));
    } catch (error) {
        console.error("Failed to save investment rescues to localStorage", error);
    }
};

// --- End Helper Functions ---

// --- Profit Calculation Helper ---
const calculateProfits = (operations: Operation[], registrationDateStr: string | undefined): Pick<Financials, 'todayProfit' | 'monthProfit'> => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todayProfit = operations
        .filter(op => op.timestamp.getTime() >= startOfToday.getTime())
        .reduce((sum, op) => sum + op.profit, 0);

    let monthProfit = 0;
    if (registrationDateStr) {
        const registrationDate = new Date(registrationDateStr);
        const thirtyDaysLater = new Date(registrationDate);
        thirtyDaysLater.setDate(registrationDate.getDate() + 30);

        monthProfit = operations
            .filter(op => op.timestamp >= registrationDate && op.timestamp < thirtyDaysLater)
            .reduce((sum, op) => sum + op.profit, 0);
    }

    return { todayProfit, monthProfit };
};
// --- End Profit Helper ---


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [financials, setFinancials] = useState<Financials>({
    balance: 0,
    totalInvested: 0,
    todayProfit: 0,
    monthProfit: 0,
    affiliateEarnings: 0,
  });
  const [submittedProofHashes, setSubmittedProofHashes] = useState<Set<string>>(new Set());
  const [depositType, setDepositType] = useState<'usdt' | 'pix' | null>(null);
  const [operationsHistory, setOperationsHistory] = useState<Operation[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [investmentRescues, setInvestmentRescues] = useState<InvestmentRescue[]>([]);
  const [referredUsers, setReferredUsers] = useState<User[]>([]);
  
  useEffect(() => {
    if (user) {
        setStoredUser(user.email, user);
        setStoredFinancials(user.email, financials);
        setStoredOperations(user.email, operationsHistory);
        setStoredWithdrawals(user.email, withdrawals);
        setStoredInvestmentRescues(user.email, investmentRescues);
    }
  }, [user, financials, operationsHistory, withdrawals, investmentRescues]);

    const generateUniqueAffiliateId = (name: string, allUsers: User[]): string => {
        const baseId = name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/ /g, '-')
            .replace(/[^a-z0-9-]/g, ''); // Remove invalid chars
        
        let finalId = baseId;
        let counter = 2;
        
        // Ensure the generated ID is unique among all users
        while (allUsers.some(u => u.affiliateId === finalId)) {
            finalId = `${baseId}-${counter}`;
            counter++;
        }
        
        return finalId;
    };

  const handleLogin = useCallback((loggedInUser: User, referrerId: string | null) => {
    let userToSet: User;
    const existingUser = getStoredUser(loggedInUser.email);
    
    // Get all users to check for affiliate ID uniqueness and find referrer
    const allUserEmails = getStoredAllUserEmails();
    const allUsers = allUserEmails
        .map(email => getStoredUser(email))
        .filter((u): u is User => u !== null);

    if (existingUser) {
        userToSet = { ...existingUser };
        // If an existing user doesn't have an affiliate ID, create one
        if (!userToSet.affiliateId) {
            userToSet.affiliateId = generateUniqueAffiliateId(userToSet.name, allUsers);
            setStoredUser(userToSet.email, userToSet);
        }
    } else {
        // Find referrer email from referrerId
        let referrerEmail: string | null = null;
        if (referrerId) {
            const referrer = allUsers.find(u => u.affiliateId === referrerId);
            if (referrer) {
                referrerEmail = referrer.email;
            }
        }
        
        // First login for this user (i.e., registration)
        userToSet = {
            ...loggedInUser,
            registrationDate: new Date().toISOString(),
            referredBy: referrerEmail || undefined,
            affiliateId: generateUniqueAffiliateId(loggedInUser.name, allUsers),
        };
        setStoredUser(userToSet.email, userToSet);
        
        // Add to central user registry
        if (!allUserEmails.includes(userToSet.email)) {
            setStoredAllUserEmails([...allUserEmails, userToSet.email]);
        }
    }

    setUser(userToSet);

    const { balance, totalInvested, affiliateEarnings } = getStoredFinancials(userToSet.email);
    const storedOperations = getStoredOperations(userToSet.email);
    const storedWithdrawals = getStoredWithdrawals(userToSet.email);
    const storedRescues = getStoredInvestmentRescues(userToSet.email);
    const calculatedProfits = calculateProfits(storedOperations, userToSet.registrationDate);
    
    setFinancials({
        balance,
        totalInvested,
        affiliateEarnings,
        todayProfit: calculatedProfits.todayProfit,
        monthProfit: calculatedProfits.monthProfit,
    });
    
    // Load referred users for the affiliate page
    const myReferrals = allUsers.filter((u) => u.referredBy === userToSet.email);
    setReferredUsers(myReferrals);

    const storedHashes = getStoredProofHashes(userToSet.email);
    setSubmittedProofHashes(storedHashes);
    setOperationsHistory(storedOperations);
    setWithdrawals(storedWithdrawals);
    setInvestmentRescues(storedRescues);

    setCurrentPage('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setFinancials({
      balance: 0,
      totalInvested: 0,
      todayProfit: 0,
      monthProfit: 0,
      affiliateEarnings: 0,
    });
    setSubmittedProofHashes(new Set());
    setOperationsHistory([]);
    setWithdrawals([]);
    setInvestmentRescues([]);
    setReferredUsers([]);
    setCurrentPage('landing');
  }, []);
  
  const handleInvestment = useCallback((amount: number, proofHash: string): boolean => {
    if (submittedProofHashes.has(proofHash)) {
      console.error("Este comprovante já foi utilizado.");
      return false; // Indicate failure
    }

    if (amount > 0 && user) {
      setFinancials(prev => ({
        ...prev,
        balance: prev.balance + amount,
        totalInvested: prev.totalInvested + amount,
      }));
      const newHashes = new Set([...submittedProofHashes, proofHash]);
      setSubmittedProofHashes(newHashes);
      setStoredProofHashes(user.email, newHashes);
      return true; // Indicate success
    }
    return false;
  }, [submittedProofHashes, user]);

  const handleExecuteOperation = useCallback((opData: Omit<Operation, 'id' | 'timestamp'>) => {
    if (user) {
        const newOperation: Operation = {
            ...opData,
            id: crypto.randomUUID(),
            timestamp: new Date()
        };
        
        const newHistory = [...operationsHistory, newOperation];
        setOperationsHistory(newHistory);
        
        const calculatedProfits = calculateProfits(newHistory, user.registrationDate);

        setFinancials(prev => ({
            ...prev,
            balance: prev.balance + opData.profit, // Add full profit to the user's balance
            todayProfit: calculatedProfits.todayProfit,
            monthProfit: calculatedProfits.monthProfit,
        }));

        // Affiliate commission logic
        if (user.referredBy) {
            const referrerEmail = user.referredBy;
            // The commission is a bonus paid by the platform, calculated based on the referee's profit,
            // but NOT deducted from it.
            const commission = opData.profit * 0.25; // 25% of the referee's profit

            // Load and update referrer's data directly from localStorage
            const referrerFinancialsData = getStoredFinancials(referrerEmail);
            const referrerOperations = getStoredOperations(referrerEmail);
            const referrerUser = getStoredUser(referrerEmail);

            const updatedReferrerFinancials: Financials = {
                balance: referrerFinancialsData.balance + commission,
                totalInvested: referrerFinancialsData.totalInvested,
                affiliateEarnings: (referrerFinancialsData.affiliateEarnings || 0) + commission,
                ...calculateProfits(referrerOperations, referrerUser?.registrationDate),
            };
            
            setStoredFinancials(referrerEmail, updatedReferrerFinancials);
        }


        // Set 3-hour cooldown after the very first operation
        if (operationsHistory.length === 0) {
            const cooldownEnds = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
            const updatedUser = { ...user, cooldownUntil: cooldownEnds };
            setUser(updatedUser);
        }

        setCurrentPage('dashboard');
    }
  }, [user, operationsHistory]);

  const handleWithdrawalRequest = useCallback((withdrawalData: Omit<Withdrawal, 'id' | 'timestamp' | 'fee'>): boolean => {
    if (!user) return false;

    const availableBalance = financials.balance - financials.totalInvested;
    if (withdrawalData.amount > availableBalance) {
        console.error("Saldo insuficiente para saque.");
        return false;
    }

    const newWithdrawal: Withdrawal = {
        ...withdrawalData,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        fee: withdrawalData.amount * 0.03,
    };
    
    setWithdrawals(prev => [...prev, newWithdrawal]);
    setFinancials(prev => ({
        ...prev,
        // The total balance is reduced by the withdrawal amount. The profit portion is implicitly reduced.
        balance: prev.balance - withdrawalData.amount,
    }));
    
    return true;
  }, [user, financials]);

  const handleInvestmentRescueRequest = useCallback((rescueData: Omit<InvestmentRescue, 'id' | 'timestamp' | 'fee' | 'amountReceived'>): boolean => {
    if (!user) return false;
    
    if (rescueData.amountRescued > financials.totalInvested) {
        console.error("Valor de resgate excede o total investido.");
        return false;
    }

    const fee = rescueData.amountRescued * 0.28;
    const newRescue: InvestmentRescue = {
        ...rescueData,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        fee: fee,
        amountReceived: rescueData.amountRescued - fee,
    };
    
    setInvestmentRescues(prev => [...prev, newRescue]);
    setFinancials(prev => ({
        ...prev,
        balance: prev.balance - rescueData.amountRescued,
        totalInvested: prev.totalInvested - rescueData.amountRescued,
    }));
    
    return true;
  }, [user, financials]);

  const navigateToAuth = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  }, []);

  const navigateToArbitrage = useCallback(() => {
    setCurrentPage('arbitrage');
  }, []);
  
  const navigateToDashboard = useCallback(() => {
    setCurrentPage('dashboard');
  }, []);

  const navigateToLanding = useCallback(() => {
    setCurrentPage('landing');
  }, []);

  const navigateToDeposit = useCallback(() => {
    setCurrentPage('deposit');
  }, []);

  const navigateToWithdraw = useCallback(() => {
    setCurrentPage('withdraw');
  }, []);

  const navigateToRescue = useCallback(() => {
    setCurrentPage('rescue');
  }, []);
  
  const navigateToAffiliate = useCallback(() => {
    if (user) {
        // Refresh affiliate data from localStorage before navigating
        const allUserEmails = getStoredAllUserEmails();
        const allUsers = allUserEmails
            .map(email => getStoredUser(email))
            .filter((u): u is User => u !== null);
        
        const myReferrals = allUsers.filter((u) => u.referredBy === user.email);
        setReferredUsers(myReferrals);

        // also refresh financials to get latest affiliate earnings
        const { balance, totalInvested, affiliateEarnings } = getStoredFinancials(user.email);
        const storedOperations = getStoredOperations(user.email);
        const calculatedProfits = calculateProfits(storedOperations, user.registrationDate);

        setFinancials({
            balance,
            totalInvested,
            affiliateEarnings,
            todayProfit: calculatedProfits.todayProfit,
            monthProfit: calculatedProfits.monthProfit,
        });
    }
    setCurrentPage('affiliate');
  }, [user]);

  const navigateToDepositFlow = useCallback((type: 'usdt' | 'pix') => {
    setDepositType(type);
    setCurrentPage('depositFlow');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} initialMode={authMode} onNavigateBack={navigateToLanding} />;
      case 'dashboard':
        return user ? <DashboardPage user={user} financials={financials} operationsHistory={operationsHistory} onLogout={handleLogout} onNavigateToArbitrage={navigateToArbitrage} onNavigateToDeposit={navigateToDeposit} onNavigateToWithdraw={navigateToWithdraw} onNavigateToAffiliate={navigateToAffiliate}/> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'arbitrage':
        return user ? <ArbitragePage user={user} balance={financials.balance} onNavigateToDashboard={navigateToDashboard} onExecuteOperation={handleExecuteOperation} /> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'deposit':
        return user ? <DepositPage onNavigateToDashboard={navigateToDashboard} onNavigateToDepositFlow={navigateToDepositFlow} /> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'depositFlow':
        return user && depositType ? <DepositFlowPage type={depositType} onNavigateToDeposit={navigateToDeposit} onInvest={handleInvestment} onNavigateToDashboard={navigateToDashboard} /> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'withdraw':
        return user ? <WithdrawPage financials={financials} withdrawals={withdrawals} onNavigateToDashboard={navigateToDashboard} onWithdrawalRequest={handleWithdrawalRequest} onNavigateToRescue={navigateToRescue} /> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'rescue':
        return user ? <RescuePage financials={financials} rescues={investmentRescues} onNavigateToDashboard={navigateToDashboard} onRescueRequest={handleInvestmentRescueRequest} /> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      case 'affiliate':
        return user ? <AffiliatePage user={user} financials={financials} referredUsers={referredUsers} onNavigateToDashboard={navigateToDashboard} /> : <LandingPage onNavigateToAuth={navigateToAuth} />;
      default:
        return <LandingPage onNavigateToAuth={navigateToAuth} />;
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-['Inter']">
      {renderPage()}
    </div>
  );
};

export default App;
