export interface User {
  name: string;
  email: string;
  registrationDate?: string;
  cooldownUntil?: string;
  referredBy?: string; // Email of the referrer
  affiliateId?: string; // URL-friendly unique ID for referrals
}

export type Page = 'landing' | 'auth' | 'dashboard' | 'arbitrage' | 'deposit' | 'depositFlow' | 'withdraw' | 'rescue' | 'affiliate' | 'wallet';

export interface Financials {
  balance: number;
  totalInvested: number;
  todayProfit: number;
  monthProfit: number;
  affiliateEarnings: number;
}

export interface Operation {
  id: string;
  pair: string;
  exchanges: string;
  percentage: number;
  profit: number;
  totalReturn: number;
  timestamp: Date;
}

export interface Withdrawal {
  id:string;
  method: 'USDT' | 'PIX';
  amount: number; // The amount requested by the user to withdraw
  fee: number; // The calculated 3% fee
  timestamp: Date;
  details: {
    fullName: string;
    address?: string; // for USDT
    pixKey?: string; // for PIX
  };
}

export interface InvestmentRescue {
  id: string;
  amountRescued: number; // Amount from totalInvested
  fee: number; // The calculated 28% fee
  amountReceived: number; // amountRescued - fee
  timestamp: Date;
  details: {
    fullName: string;
    reason: string;
    usdtAddress: string;
  };
}