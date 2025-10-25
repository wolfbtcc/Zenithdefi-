import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import Footer from './Footer';
import { RocketIcon, ArrowLeftIcon, UserIcon, EmailIcon, LockIcon } from './Icons';

interface AuthPageProps {
  onLogin: (user: User, referrerId: string | null) => void;
  initialMode: 'login' | 'register';
  onNavigateBack: () => void;
}

const PasswordStrengthIndicator: React.FC<{ strength: { level: number; text: string; color: string; } }> = ({ strength }) => {
  if (strength.level === 0) return null;
  
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-full bg-gray-700 rounded-full h-1.5 flex gap-1 p-0.5">
        <div className={`h-full rounded-full transition-all duration-300 ${strength.level >= 1 ? strength.color : ''}`} style={{ width: '33.33%' }}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strength.level >= 2 ? strength.color : ''}`} style={{ width: '33.33%' }}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strength.level >= 3 ? strength.color : ''}`} style={{ width: '33.33%' }}></div>
      </div>
      <span className={`text-xs font-medium w-16 text-right ${
        strength.level === 1 ? 'text-red-400' :
        strength.level === 2 ? 'text-yellow-400' :
        strength.level === 3 ? 'text-green-400' :
        'text-gray-500'
      }`}>
        {strength.text}
      </span>
    </div>
  );
};

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, initialMode, onNavigateBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '', color: '' });
  const [referrerId, setReferrerId] = useState<string | null>(null);

  useEffect(() => {
    // Capture referrer ID from URL on component mount
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferrerId(ref);
    }
  }, []);

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  useEffect(() => {
    if (isLogin) {
      setPasswordStrength({ level: 0, text: '', color: '' });
      return;
    };

    const pass = password;
    let score = 0;
    if (pass.length === 0) {
      setPasswordStrength({ level: 0, text: '', color: '' });
      return;
    }

    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (pass.length < 8) {
       setPasswordStrength({ level: 1, text: 'Fraca', color: 'bg-red-500' });
    } else if (score < 3) {
       setPasswordStrength({ level: 1, text: 'Fraca', color: 'bg-red-500' });
    } else if (score === 3) {
       setPasswordStrength({ level: 2, text: 'Média', color: 'bg-yellow-500' });
    } else {
       setPasswordStrength({ level: 3, text: 'Forte', color: 'bg-green-500' });
    }
  }, [password, isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (!name) {
        setError('O campo nome é obrigatório.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
    }

    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
      return;
    }

    const user: User = { name: isLogin ? 'Usuário' : name, email };
    // Pass referrer ID only on registration
    onLogin(user, isLogin ? null : referrerId);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <button
        onClick={onNavigateBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Voltar para a página inicial"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black pointer-events-none"></div>
      
      <div className="w-full max-w-sm z-10">
        <div className="bg-black border border-orange-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-orange-500/20">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Bem-vindo de volta' : 'Crie sua Conta'}</h1>
            <p className="text-gray-400">
                {isLogin ? 'Acesse para continuar' : 'Comece Hoje.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="animate-fade-in-up">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full bg-[#2C2C2E] border border-gray-700/50 rounded-xl shadow-sm py-3 px-4 pl-12 text-base text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <div className="relative">
                <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="block w-full bg-[#2C2C2E] border border-gray-700/50 rounded-xl shadow-sm py-3 px-4 pl-12 text-base text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full bg-[#2C2C2E] border border-gray-700/50 rounded-xl shadow-sm py-3 px-4 pl-12 text-base text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500"
                />
              </div>
              {!isLogin && <PasswordStrengthIndicator strength={passwordStrength} />}
            </div>

            {!isLogin && (
              <div className="animate-fade-in-up">
                <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha</label>
                <div className="relative">
                  <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full bg-[#2C2C2E] border border-gray-700/50 rounded-xl shadow-sm py-3 px-4 pl-12 text-base text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transition-all duration-300 transform active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30"
              >
                <RocketIcon className="w-5 h-5"/>
                {isLogin ? 'Entrar na Plataforma' : 'Criar conta'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button 
                onClick={toggleAuthMode}
                className="ml-2 font-semibold text-orange-500 hover:text-orange-400 focus:outline-none"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>

        </div>
      </div>
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default AuthPage;