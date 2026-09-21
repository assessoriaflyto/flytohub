import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sun, 
  Moon,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types/hub';

interface LoginViewProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterPendingUser: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cnpj?: string;
    role: UserRole;
    contractUrl?: string;
  }) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLoginSuccess,
  onRegisterPendingUser,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCnpj, setRegCnpj] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('TRAFFIC_MANAGER');
  const [regContractUrl, setRegContractUrl] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Modal Esqueci Senha
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const user = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    if (!user) {
      setLoginError('E-mail não encontrado no sistema.');
      return;
    }

    if (user.password !== loginPassword) {
      setLoginError('Senha incorreta. Verifique suas credenciais.');
      return;
    }

    if (user.status === 'PENDENTE_APROVACAO') {
      setLoginError('Seu cadastro ainda está PENDENTE DE APROVAÇÃO pela diretoria. Aguarde a liberação do Admin.');
      return;
    }

    if (user.status === 'SUSPENSO') {
      setLoginError('Esta conta foi suspensa temporariamente. Entre em contato com a diretoria da Flyto.');
      return;
    }

    onLoginSuccess(user);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim()) return;

    // Verifica se já existe
    const exists = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (exists) {
      alert('Este e-mail já está cadastrado no sistema.');
      return;
    }

    onRegisterPendingUser({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      phone: regPhone.trim(),
      cnpj: regCnpj.trim() || undefined,
      role: regRole,
      contractUrl: regContractUrl.trim() || undefined
    });

    setRegisterSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F1012] text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Grid Quadriculado Flyto & Marca d'água */}
      <div className="fixed inset-0 bg-ambient-grid pointer-events-none z-0" />
      <div className="fixed inset-0 bg-watermark-logo-center pointer-events-none z-0" />

      {/* Topo: Alternador Light/Dark */}
      <div className="relative z-10 p-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#181A1D] border border-emerald-200 dark:border-[#2D3035] flex items-center justify-center p-1.5 shadow-xs">
            <img 
              src="/assets/logo-icon.png" 
              alt="Flyto" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Flyto<span className="text-[#277e1b] dark:text-[#00FF66]">HUB</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#696969] block -mt-0.5">
              Sistema Operacional Executivo
            </span>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] text-slate-600 dark:text-[#A0AEC0] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Alternar modo claro e escuro"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#277e1b]" />}
        </button>
      </div>

      {/* Container Central de Login & Cadastro */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white/95 dark:bg-[#181A1D]/95 backdrop-blur-md border border-slate-200 dark:border-[#2D3035] rounded-3xl p-7 shadow-2xl space-y-5 beam-border-slow animate-fadeIn">
          
          {/* Cabeçalho do Card */}
          <div className="text-center space-y-1.5 pb-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#1F2124] border border-emerald-200 dark:border-[#2D3035] mx-auto flex items-center justify-center shadow-xs">
              <img 
                src="/assets/logo-icon.png" 
                alt="Flyto" 
                className="w-7 h-7 object-contain"
              />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
              Portal de Acesso Flyto<span className="text-[#277e1b] dark:text-[#00FF66]">HUB</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#696969]">
              Autenticação segura para gestores, comercial e diretoria
            </p>
          </div>

          {/* Abas: Entrar vs Solicitar Cadastro */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#121315] rounded-xl border border-slate-200 dark:border-[#25282C] text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('LOGIN');
                setLoginError(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'LOGIN'
                  ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Acessar Conta
            </button>
            <button
              onClick={() => {
                setActiveTab('REGISTER');
                setRegisterSuccess(false);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'REGISTER'
                  ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Novo Colaborador
            </button>
          </div>

          {/* FORMULÁRIO 1: LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@assessoriaflyto.com.br"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0]">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-[11px] font-bold text-[#277e1b] dark:text-[#00FF66] hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botão de Entrar */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Entrar no FlytoHUB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORMULÁRIO 2: NOVO COLABORADOR (APROVAÇÃO ADMIN) */}
          {activeTab === 'REGISTER' && (
            <div>
              {registerSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3 animate-fadeIn">
                  <div className="w-10 h-10 rounded-xl bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Solicitação Enviada com Sucesso!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#A0AEC0] leading-relaxed">
                    Sua conta foi registrada e agora está na fila de aprovação da diretoria.
                    Assim que o administrador aprovar seu acesso e definir o seu Squad, você poderá entrar no sistema.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('LOGIN');
                      setRegisterSuccess(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] cursor-pointer"
                  >
                    Voltar ao Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3 text-xs">
                  
                  <div>
                    <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome Completo *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Nome completo..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">E-mail *</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@..."
                        className="w-full p-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Senha *</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Senha..."
                        className="w-full p-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">WhatsApp *</label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="DDD + Número..."
                        className="w-full p-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">CNPJ / CPF</label>
                      <input
                        type="text"
                        value={regCnpj}
                        onChange={(e) => setRegCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full p-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Função / Cargo</label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                      >
                        <option value="TRAFFIC_MANAGER">Gestor de Tráfego</option>
                        <option value="COMMERCIAL">Comercial / Vendas</option>
                        <option value="SOCIAL_MEDIA">Social Media & Criativos</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Link do Contrato</label>
                      <input
                        type="url"
                        value={regContractUrl}
                        onChange={(e) => setRegContractUrl(e.target.value)}
                        placeholder="Link Google Drive / PDF..."
                        className="w-full p-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300">
                    Ao registrar, seu cadastro ficará pendente de validação pelo Admin para ativação oficial.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all shadow-xs cursor-pointer"
                  >
                    Enviar Solicitação de Cadastro
                  </button>

                </form>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Rodapé institucional */}
      <div className="relative z-10 p-4 text-center text-xs text-slate-400 dark:text-[#696969]">
        Flyto Assessoria de Performance &middot; Brasília - DF &middot; assessoriaflyto.com.br
      </div>

      {/* Modal Esqueci a Senha */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 space-y-3 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Redefinição de Senha</h3>
            <p className="text-xs text-slate-500 dark:text-[#8E959E]">
              Digite seu e-mail corporativo cadastrado para receber as instruções de recuperação.
            </p>
            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#277e1b] dark:text-[#00FF66] text-xs font-bold text-center">
                Instruções enviadas! Verifique sua caixa de entrada.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu-email@assessoriaflyto.com.br"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => setForgotSuccess(true)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                  >
                    Enviar Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
