import React from 'react';
import { 
  BarChart3, 
  Video, 
  Briefcase, 
  Rocket, 
  KeyRound, 
  Layers, 
  Plus, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ExternalLink,
  Bell,
  Settings,
  GraduationCap,
  Megaphone,
  Users,
  Shield
} from 'lucide-react';
import { ActiveTab, ClientData, CommercialLead, CreativeTask, OneOffService, UserAccount, UserRole } from '../../types/hub';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: UserAccount;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenUserProfile: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  clients: ClientData[];
  leads: CommercialLead[];
  creativeTasks: CreativeTask[];
  services: OneOffService[];
  announcementsCount?: number;
  onOpenNewLeadModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'ADMIN': return 'CEO & Diretoria';
    case 'TRAFFIC_MANAGER': return 'Gestor de Tráfego';
    case 'COMMERCIAL': return 'Comercial & CRM';
    case 'SOCIAL_MEDIA': return 'Social Media';
    default: return role;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenUserProfile,
  isDarkMode,
  onToggleDarkMode,
  clients,
  leads,
  creativeTasks,
  services,
  announcementsCount = 0,
  onOpenNewLeadModal,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const isTrafficManager = currentUser.role === 'TRAFFIC_MANAGER';
  const squadClients = clients.filter(c => {
    if (isTrafficManager && currentUser.squadId) {
      return c.squadId === currentUser.squadId;
    }
    return true;
  });

  const activeClientsCount = squadClients.filter(c => c.status === 'ATIVO').length;
  const onboardingClientsCount = squadClients.filter(c => c.status === 'ONBOARDING').length;
  const pendingCreativesCount = creativeTasks.filter(t => t.status !== 'PUBLICADO').length;
  const activeLeadsCount = leads.filter(l => l.status !== 'FECHADO' && l.status !== 'PERDIDO').length;
  const pendingServicesCount = services.filter(s => s.deliveryStatus !== 'ENTREGUE').length;

  const rawNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; count?: number; adminOnly?: boolean }[] = [
    { id: 'TRAFFIC', label: 'Gestor de Tráfego', icon: BarChart3, count: activeClientsCount },
    { id: 'SOCIAL_MEDIA', label: 'Social Media', icon: Video, count: pendingCreativesCount },
    { id: 'COMMERCIAL', label: 'Comercial', icon: Briefcase, count: activeLeadsCount },
    { id: 'ONBOARDING', label: 'Onboarding', icon: Rocket, count: onboardingClientsCount },
    { id: 'ACCESS', label: 'Acessos', icon: KeyRound },
    { id: 'ONE_OFF_SERVICES', label: 'Serviços Avulsos', icon: Layers, count: pendingServicesCount },
    { id: 'PARTNERS', label: 'Parceiros & Indicações', icon: Users },
    { id: 'ANNOUNCEMENTS', label: 'Avisos da Assessoria', icon: Megaphone, count: announcementsCount > 0 ? announcementsCount : undefined },
    { id: 'TRAINING', label: 'Estudos & Treinamentos', icon: GraduationCap },
    { id: 'ADMIN', label: 'Painel do Admin', icon: Shield, adminOnly: true }
  ];

  // Filtra itens com restrição de cargo
  const navItems = rawNavItems.filter(item => {
    if (item.adminOnly && currentUser.role !== 'ADMIN') return false;
    return true;
  });

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#121315]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#2D3035] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img 
            src="/assets/logo-icon.png" 
            alt="Flyto" 
            className="w-7 h-7 object-contain"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Flyto<span className="text-[#277e1b] dark:text-[#00FF66]">HUB</span>
          </span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#1F2124] text-slate-700 dark:text-white"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay Mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Principal (Desktop & Drawer Mobile) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#121315] border-r border-slate-200 dark:border-[#2D3035]
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Topo da Sidebar: Logo & Destaque FlytoHUB Centralizado */}
        <div className="overflow-y-auto flex-1">
          <div className="p-5 pb-4 border-b border-slate-100 dark:border-[#25282C] flex items-center justify-center relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 border border-[#277e1b]/20 dark:border-[#00FF66]/30 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                <img 
                  src="/assets/logo-icon.png" 
                  alt="Flyto" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-tight text-left">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Flyto<span className="text-[#277e1b] dark:text-[#00FF66]">HUB</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#277e1b] dark:bg-[#00FF66] animate-pulse" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8E959E]">
                    {currentUser.role === 'ADMIN' ? 'Painel Executivo' : 'Central Ativa'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botão fechar mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Botão de Entrada Comercial (Disponível se Comercial ou Admin) */}
          {(currentUser.role === 'COMMERCIAL' || currentUser.role === 'ADMIN') && (
            <div className="p-3 border-b border-slate-100 dark:border-[#25282C]">
              <button
                onClick={onOpenNewLeadModal}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Lead</span>
              </button>
            </div>
          )}

          {/* Menu de Navegação */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/25 dark:border-[#00FF66]/30 font-extrabold shadow-xs'
                      : 'text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100/80 dark:hover:bg-[#1F2124] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#277e1b] dark:text-[#00FF66]' : 'text-slate-400 dark:text-[#696969]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                      isActive 
                        ? 'bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]' 
                        : 'bg-slate-100 dark:bg-[#1F2124] text-slate-500 dark:text-[#8E959E]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Caixa de Notificações, Perfil, Alternador de Tema & Site */}
        <div className="p-3 border-t border-slate-100 dark:border-[#25282C] space-y-2.5 shrink-0">
          
          {/* Caixa de Entrada para Notificações & Perfil Executivo */}
          <div 
            onClick={onOpenUserProfile}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#181A1D] border border-slate-200/80 dark:border-[#2D3035] flex items-center justify-between shadow-xs hover:border-emerald-500/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-[#383C42]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="w-2.5 h-2.5 rounded-full bg-[#277e1b] dark:bg-[#00FF66] absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-[#181A1D]" />
              </div>

              <div className="min-w-0">
                <strong className="text-xs font-bold text-slate-900 dark:text-white block truncate leading-tight">
                  {currentUser.name}
                </strong>
                <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block truncate">
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              {/* Notificações / Caixa de Entrada (Ponto verde SOMENTE se unreadNotificationsCount > 0!) */}
              <button
                onClick={onOpenNotifications}
                className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-[#8E959E] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#25282C] transition-colors cursor-pointer"
                title={`Notificações (${unreadNotificationsCount} novas)`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#277e1b] dark:bg-[#00FF66] animate-pulse" />
                )}
              </button>

              {/* Configurações de Perfil */}
              <button
                onClick={onOpenUserProfile}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-[#8E959E] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#25282C] transition-colors cursor-pointer"
                title="Meu Perfil & Configurações"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alternador Light/Dark */}
          <button
            onClick={onToggleDarkMode}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#181A1D] text-slate-700 dark:text-[#A0AEC0] hover:bg-slate-200 dark:hover:bg-[#25282C] transition-colors flex items-center justify-between cursor-pointer border border-transparent dark:border-[#2D3035]"
            title="Alternar entre modo claro e escuro"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#277e1b]" />}
              <span>{isDarkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-[#696969] font-bold uppercase">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* Link para o site da Assessoria */}
          <a
            href="https://assessoriaflyto.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-3 py-1 rounded-lg text-[11px] text-slate-400 dark:text-[#696969] hover:text-[#277e1b] dark:hover:text-[#00FF66] transition-colors flex items-center justify-between"
          >
            <span>assessoriaflyto.com.br</span>
            <ExternalLink className="w-3 h-3" />
          </a>

        </div>

      </aside>
    </>
  );
};
