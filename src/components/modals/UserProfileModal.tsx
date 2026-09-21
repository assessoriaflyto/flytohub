import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Camera, 
  Phone, 
  ShieldCheck, 
  Users, 
  LogOut,
  Check
} from 'lucide-react';
import { UserAccount, Squad } from '../../types/hub';

interface UserProfileModalProps {
  isOpen: boolean;
  user: UserAccount;
  squads: Squad[];
  onClose: () => void;
  onUpdateProfile: (updatedUser: Partial<UserAccount>) => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  squads,
  onClose,
  onUpdateProfile,
  onLogout
}) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [instagramHandle, setInstagramHandle] = useState(user.instagramHandle || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '');

  // Password reset section
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSquad = squads.find(s => s.id === user.squadId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<UserAccount> = {
      name: name.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      phone: phone.trim(),
      instagramHandle: instagramHandle.trim(),
      linkedinUrl: linkedinUrl.trim()
    };

    if (newPassword.trim()) {
      if (newPassword !== confirmPassword) {
        setPasswordFeedback('As senhas não coincidem!');
        return;
      }
      if (newPassword.length < 6) {
        setPasswordFeedback('A senha deve conter no mínimo 6 dígitos.');
        return;
      }
      updates.password = newPassword.trim();
    }

    onUpdateProfile(updates);
    setPasswordFeedback('Perfil atualizado com sucesso!');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'Administrador / CEO';
      case 'TRAFFIC_MANAGER': return 'Gestor de Tráfego';
      case 'COMMERCIAL': return 'Comercial & Vendas';
      case 'SOCIAL_MEDIA': return 'Social Media & Criativos';
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-6 space-y-4 shadow-2xl beam-border-slow">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#1F2124] border border-emerald-200 dark:border-[#2D3035] flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Meu Perfil & Configurações</h3>
              <p className="text-[11px] text-slate-500 dark:text-[#696969]">Gerencie seus dados pessoais, redes sociais e credenciais</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:text-[#696969] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações de Cargo e Squad */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" />
            <span className="font-bold text-slate-700 dark:text-[#A0AEC0]">Função:</span>
            <span className="font-extrabold text-slate-900 dark:text-white bg-white dark:bg-[#1F2124] px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-[#2D3035]">
              {getRoleLabel(user.role)}
            </span>
          </div>

          {currentSquad && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-700 dark:text-[#A0AEC0]">Squad:</span>
              <span className="font-extrabold text-slate-900 dark:text-white bg-white dark:bg-[#1F2124] px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-[#2D3035]">
                {currentSquad.name}
              </span>
            </div>
          )}
        </div>

        {/* Formulário de Edição */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">WhatsApp / Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">URL da Foto de Perfil</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://exemplo.com/minha-foto.png ou /assets/..."
              className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Instagram (@usuario)</label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@meu.perfil"
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">LinkedIn (URL)</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Redefinição de Senha */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#25282C] space-y-2">
            <span className="font-bold text-slate-700 dark:text-[#A0AEC0] block">
              Trocar Senha de Acesso (Opcional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar nova senha..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
            {passwordFeedback && (
              <span className={`text-[11px] font-bold block ${passwordFeedback.includes('sucesso') ? 'text-[#277e1b] dark:text-[#00FF66]' : 'text-rose-500'}`}>
                {passwordFeedback}
              </span>
            )}
          </div>

          {/* Rodapé com Logout e Salvar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#25282C]">
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all shadow-xs cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
