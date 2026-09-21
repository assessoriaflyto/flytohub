import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Trophy, 
  History, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  Plus, 
  Check, 
  X, 
  ExternalLink, 
  Search, 
  Filter, 
  FileText, 
  Briefcase, 
  Building, 
  Flame, 
  Award,
  Layers,
  Edit2,
  Trash2,
  Play,
  Square
} from 'lucide-react';
import { UserAccount, Squad, GoalEvent, AuditLogEntry, UserRole, UserWarning, AuditModule } from '../../types/hub';
import { formatBRL, formatDateBR } from '../../utils/formatters';

interface AdminDashboardProps {
  currentUser: UserAccount;
  users: UserAccount[];
  squads: Squad[];
  goalEvents: GoalEvent[];
  auditLogs: AuditLogEntry[];
  onApproveUser: (userId: string, role: UserRole, squadId?: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUserSquadAndRole: (userId: string, role: UserRole, squadId?: string) => void;
  onApplyWarning: (userId: string, reason: string) => void;
  onToggleUserSuspension: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onCreateSquad: (newSquad: Omit<Squad, 'id' | 'createdAt'>) => void;
  onDeleteSquad?: (squadId: string) => void;
  onCreateGoalEvent: (newEvent: Omit<GoalEvent, 'id' | 'status'>) => void;
  onDeleteGoalEvent?: (eventId: string) => void;
  onToggleGoalEventStatus?: (eventId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  squads,
  goalEvents,
  auditLogs,
  onApproveUser,
  onRejectUser,
  onUpdateUserSquadAndRole,
  onApplyWarning,
  onToggleUserSuspension,
  onDeleteUser,
  onCreateSquad,
  onDeleteSquad,
  onCreateGoalEvent,
  onDeleteGoalEvent,
  onToggleGoalEventStatus
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'USERS' | 'SQUADS' | 'GOALS' | 'LOGS'>('USERS');

  // Modais de Criação
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedUserForWarning, setSelectedUserForWarning] = useState<UserAccount | null>(null);
  const [warningReason, setWarningReason] = useState('');

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('TRAFFIC_MANAGER');
  const [editSquadId, setEditSquadId] = useState<string>('');

  const [isCreateSquadModalOpen, setIsCreateSquadModalOpen] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [squadDesc, setSquadDesc] = useState('');
  const [squadColor, setSquadColor] = useState('#00FF66');

  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalType, setGoalType] = useState<GoalEvent['targetType']>('VENDAS');
  const [goalTargetValue, setGoalTargetValue] = useState('500000');
  const [goalPrize, setGoalPrize] = useState('R$ 5.000 em Bônus');
  const [goalStart, setGoalStart] = useState('01/10/2026');
  const [goalEnd, setGoalEnd] = useState('31/12/2026');

  // Filtros de Auditoria
  const [logSearch, setLogSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState<'ALL' | AuditModule>('ALL');

  // Usuários pendentes e ativos
  const pendingUsers = users.filter(u => u.status === 'PENDENTE_APROVACAO');
  const activeUsers = users.filter(u => u.status !== 'PENDENTE_APROVACAO');

  const handleOpenWarning = (user: UserAccount) => {
    setSelectedUserForWarning(user);
    setWarningReason('');
    setIsWarningModalOpen(true);
  };

  const handleConfirmWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForWarning || !warningReason.trim()) return;
    onApplyWarning(selectedUserForWarning.id, warningReason.trim());
    setIsWarningModalOpen(false);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setSelectedUserForEdit(user);
    setEditRole(user.role);
    setEditSquadId(user.squadId || squads[0]?.id || '');
    setIsEditUserModalOpen(true);
  };

  const handleConfirmEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    onUpdateUserSquadAndRole(selectedUserForEdit.id, editRole, editSquadId || undefined);
    setIsEditUserModalOpen(false);
  };

  const handleCreateSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) return;
    onCreateSquad({
      name: squadName.trim(),
      description: squadDesc.trim(),
      color: squadColor
    });
    setSquadName('');
    setSquadDesc('');
    setIsCreateSquadModalOpen(false);
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    onCreateGoalEvent({
      title: goalTitle.trim(),
      description: goalDesc.trim(),
      targetType: goalType,
      targetValue: parseFloat(goalTargetValue) || 100000,
      prize: goalPrize.trim(),
      startDate: goalStart,
      endDate: goalEnd,
      squadScores: squads.map(s => ({ squadId: s.id, currentValue: 0 }))
    });

    setGoalTitle('');
    setGoalDesc('');
    setIsCreateGoalModalOpen(false);
  };

  const filteredLogs = auditLogs.filter(log => {
    const match = 
      log.entityName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.description.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.authorName.toLowerCase().includes(logSearch.toLowerCase());
    if (!match) return false;
    if (logModuleFilter !== 'ALL' && log.module !== logModuleFilter) return false;
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">ADMIN / CEO</span>;
      case 'TRAFFIC_MANAGER':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-[#277e1b] dark:text-[#00FF66] border border-emerald-200 dark:border-emerald-900/40">Gestor de Tráfego</span>;
      case 'COMMERCIAL':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">Comercial / Vendas</span>;
      case 'SOCIAL_MEDIA':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40">Social Media</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header do Painel Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs beam-border-slow">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Painel Administrativo & Diretoria
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                Acesso Irrestrito
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#696969]">
              Gestão de colaboradores, aprovações, squads, metas de gamificação e auditoria do time
            </p>
          </div>
        </div>

        {/* Sub-Abas do Admin */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121315] p-1 rounded-xl border border-slate-200 dark:border-[#25282C] overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('USERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'USERS'
                ? 'bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" />
            <span>Colaboradores ({activeUsers.length})</span>
            {pendingUsers.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('SQUADS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'SQUADS'
                ? 'bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Squads ({squads.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('GOALS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'GOALS'
                ? 'bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Metas & Competição</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('LOGS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'LOGS'
                ? 'bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-500" />
            <span>Logs de Auditoria</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ABA DE COLABORADORES & APROVAÇÕES */}
      {/* ========================================================================= */}
      {activeAdminTab === 'USERS' && (
        <div className="space-y-6">
          
          {/* Fila de Cadastros Pendentes */}
          {pendingUsers.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/50 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-black text-amber-900 dark:text-amber-300">
                  Solicitações de Acesso Pendentes de Validação ({pendingUsers.length})
                </h3>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-400/80">
                Novos membros que se cadastraram pelo portal. Defina o Cargo e o Squad para liberar o acesso:
              </p>

              <div className="space-y-2">
                {pendingUsers.map((u) => (
                  <div 
                    key={u.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#181A1D] border border-amber-200 dark:border-amber-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">{u.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-[#8E959E]">&middot; {u.email}</span>
                        {getRoleBadge(u.role)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8E959E] flex items-center gap-3 mt-1">
                        <span>WhatsApp: {u.phone || '-'}</span>
                        <span>CNPJ/CPF: {u.cnpj || '-'}</span>
                        {u.contractUrl && (
                          <a href={u.contractUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                            <span>Ver Contrato</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRejectUser(u.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Rejeitar</span>
                      </button>

                      <button
                        onClick={() => {
                          // Abre modal para confirmar cargo e squad
                          handleOpenEditUser(u);
                        }}
                        className="px-4 py-1.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Aprovar & Atribuir Squad</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Colaboradores Ativos */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-[#25282C] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Equipe da Assessoria Flyto</h3>
                <p className="text-xs text-slate-500 dark:text-[#696969]">Controle de permissões, contratos e squads de cada membro</p>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-[#A0AEC0]">
                {activeUsers.length} membros ativos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#121315] border-b border-slate-200 dark:border-[#2D3035] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E]">
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-3">Cargo</th>
                    <th className="py-3 px-3">Squad Alocado</th>
                    <th className="py-3 px-3">Contato / CNPJ</th>
                    <th className="py-3 px-3">Contrato / Termos</th>
                    <th className="py-3 px-3">Advertências</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
                  {activeUsers.map((user) => {
                    const squad = squads.find(s => s.id === user.squadId);
                    const isSuspended = user.status === 'SUSPENSO';

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] flex items-center justify-center font-black text-xs text-[#277e1b] dark:text-[#00FF66] shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block">{user.name}</span>
                              <span className="text-[10px] text-slate-400 dark:text-[#696969]">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {squad ? (
                            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: squad.color }} />
                              <span>{squad.name}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-[#696969] italic">Geral / Sem Squad</span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-[#A0AEC0]">
                          <span className="block">{user.phone || '-'}</span>
                          <span className="text-[10px] text-slate-400">{user.cnpj || 'Sem CNPJ'}</span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {user.contractUrl ? (
                            <a
                              href={user.contractUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Contrato</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-[#696969]">Pendente</span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {user.warnings.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200">
                              {user.warnings.length} advertência{user.warnings.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Nenhuma</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#121315] dark:hover:bg-[#1F2124] text-slate-600 dark:text-[#A0AEC0] transition-colors cursor-pointer"
                              title="Alterar Cargo ou Squad"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenWarning(user)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 text-amber-600 transition-colors cursor-pointer"
                              title="Aplicar Advertência Formal"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>

                            {user.role !== 'ADMIN' && (
                              <button
                                onClick={() => onToggleUserSuspension(user.id)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                  isSuspended
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-[#00FF66]'
                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 hover:bg-rose-100'
                                }`}
                              >
                                {isSuspended ? 'Reativar' : 'Suspender'}
                              </button>
                            )}

                            {user.id !== currentUser.id && onDeleteUser && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Deseja realmente excluir permanentemente o colaborador ${user.name}?`)) {
                                    onDeleteUser(user.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 transition-colors cursor-pointer"
                                title="Excluir Colaborador Permanentemente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ABA DE GESTÃO DE SQUADS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'SQUADS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Squads Operacionais da Flyto</h3>
              <p className="text-xs text-slate-500 dark:text-[#696969]">
                Cada gestor de tráfego visualiza exclusivamente os clientes alocados ao seu squad
              </p>
            </div>

            <button
              onClick={() => setIsCreateSquadModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Novo Squad</span>
            </button>
          </div>

          {squads.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Nenhum Squad Cadastrado</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Crie seus squads operacionais (ex: Squad Alpha, Squad Scale) para organizar seus gestores e clientes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {squads.map((squad) => {
                const members = users.filter(u => u.squadId === squad.id);

                return (
                  <div 
                    key={squad.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] space-y-3 shadow-xs relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: squad.color }} />
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{squad.name}</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-[#696969] bg-slate-100 dark:bg-[#121315] px-2 py-0.5 rounded-md">
                          {members.length} membro{members.length > 1 ? 's' : ''}
                        </span>
                        {onDeleteSquad && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja realmente excluir o squad "${squad.name}"?`)) {
                                onDeleteSquad(squad.id);
                              }
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Excluir Squad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#A0AEC0] leading-relaxed">
                      {squad.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-[#25282C]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Membros Alocados:</span>
                      <div className="space-y-1">
                        {members.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">Nenhum gestor alocado</span>
                        ) : (
                          members.map(m => (
                            <div key={m.id} className="text-xs text-slate-700 dark:text-white flex items-center justify-between">
                              <span>{m.name}</span>
                              <span className="text-[10px] text-slate-400">{m.role}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ABA DE COMPETIÇÃO & METAS (GAMIFICAÇÃO) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'GOALS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Batalha de Metas & Competição entre Squads</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#696969]">
                Campanhas de incentivo, bônus e premiações coletivas para engajar a equipe
              </p>
            </div>

            <button
              onClick={() => setIsCreateGoalModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Evento de Meta</span>
            </button>
          </div>

          {goalEvents.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Nenhuma Batalha de Metas Ativa</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Crie um evento de metas acima para premiar os gestores e squads que atingirem o melhor faturamento ou ROAS.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {goalEvents.map((goal) => (
                <div 
                  key={goal.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          goal.status === 'ATIVO' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {goal.status === 'ATIVO' ? 'Campanha em Andamento' : 'Encerrada'}
                        </span>
                        <span className="text-xs text-slate-400">
                          Período: {goal.startDate} até {goal.endDate}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">{goal.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-0.5">{goal.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-left sm:text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">Premiação Prometida</span>
                        <span className="text-xs font-black text-amber-900 dark:text-amber-200">{goal.prize}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        {onToggleGoalEventStatus && (
                          <button
                            onClick={() => onToggleGoalEventStatus(goal.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                              goal.status === 'ATIVO'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-200'
                                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-[#00FF66] hover:bg-emerald-200'
                            }`}
                            title={goal.status === 'ATIVO' ? 'Encerrar Campanha' : 'Iniciar Campanha'}
                          >
                            {goal.status === 'ATIVO' ? (
                              <>
                                <Square className="w-3 h-3 text-amber-600 fill-amber-600" />
                                <span>Encerrar</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                <span>Iniciar</span>
                              </>
                            )}
                          </button>
                        )}

                        {onDeleteGoalEvent && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja realmente excluir a meta "${goal.title}"?`)) {
                                onDeleteGoalEvent(goal.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 transition-colors cursor-pointer flex items-center justify-center"
                            title="Excluir Campanha"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Placar dos Squads */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                    <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block">
                      Ranking Atual por Squad:
                    </span>

                    {goal.squadScores.length === 0 ? (
                      <div className="text-xs text-slate-400 italic">Nenhum score registrado ainda.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {goal.squadScores.map((score, idx) => {
                          const sq = squads.find(s => s.id === score.squadId);
                          const pct = Math.min(100, Math.round((score.currentValue / goal.targetValue) * 100));

                          return (
                            <div 
                              key={score.squadId}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sq?.color }} />
                                  <span>{sq?.name || score.squadId}</span>
                                </span>
                                <span className="font-black text-[#277e1b] dark:text-[#00FF66] tabular-nums">{pct}%</span>
                              </div>

                              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#1F2124] overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-600 to-[#00FF66] rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>Pontuação: <strong>{formatBRL(score.currentValue)}</strong></span>
                                <span>Meta: {formatBRL(goal.targetValue)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ABA DE LOGS DE AUDITORIA (SUPERVISÃO TOTAL) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'LOGS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-purple-500" />
                <span>Auditoria & Supervisão de Atividades da Equipe</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#696969]">
                Visualização irrestrita de todas as alterações feitas por colaboradores e clientes
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">{filteredLogs.length} logs registrados</span>
          </div>

          {/* Busca e Filtros */}
          <div className="p-3.5 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Buscar por colaborador, cliente ou ação..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['ALL', 'GESTOR', 'COMERCIAL', 'ONBOARDING', 'ACESSOS', 'ADMIN', 'AUTH'] as const).map((mod) => (
                <button
                  key={mod}
                  onClick={() => setLogModuleFilter(mod)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    logModuleFilter === mod
                      ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/30'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mod === 'ALL' && 'Todos'}
                  {mod === 'GESTOR' && 'Tráfego'}
                  {mod === 'COMERCIAL' && 'Comercial'}
                  {mod === 'ONBOARDING' && 'Onboarding'}
                  {mod === 'ACESSOS' && 'Acessos'}
                  {mod === 'ADMIN' && 'Admin'}
                  {mod === 'AUTH' && 'Autenticação'}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline de Logs */}
          <div className="space-y-2.5">
            {filteredLogs.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl">
                Nenhum log encontrado para os critérios selecionados.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white">{log.authorName}</span>
                      <span className="text-[10px] text-slate-400">({log.authorRole})</span>
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-black bg-slate-100 dark:bg-[#121315] text-slate-700 dark:text-[#00FF66]">
                        {log.module}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-[#A0AEC0]">
                    <strong className="text-slate-900 dark:text-white">[{log.entityName}]: </strong>
                    {log.description}
                  </p>

                  {log.details && (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#121315] text-[11px] text-slate-500 font-mono">
                      {log.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAIS DO PAINEL ADMIN */}
      {/* ========================================================================= */}
      
      {/* Modal Aplicar Advertência */}
      {isWarningModalOpen && selectedUserForWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Aplicar Advertência Formal</span>
            </h3>
            <p className="text-xs text-slate-500">
              Colaborador: <strong>{selectedUserForWarning.name}</strong> ({selectedUserForWarning.email})
            </p>

            <form onSubmit={handleConfirmWarning} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Motivo / Infração Técnica ou Operacional *</label>
                <textarea
                  rows={3}
                  value={warningReason}
                  onChange={(e) => setWarningReason(e.target.value)}
                  placeholder="Descreva o motivo da advertência..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsWarningModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 text-white hover:opacity-90"
                >
                  Aplicar Advertência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Cargo / Squad */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {selectedUserForEdit.status === 'PENDENTE_APROVACAO' ? 'Aprovar Cadastro de Colaborador' : 'Editar Função & Squad'}
            </h3>
            <p className="text-xs text-slate-500">
              Colaborador: <strong>{selectedUserForEdit.name}</strong> ({selectedUserForEdit.email})
            </p>

            <form onSubmit={handleConfirmEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Função / Cargo</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="TRAFFIC_MANAGER">Gestor de Tráfego</option>
                  <option value="COMMERCIAL">Comercial / Vendas</option>
                  <option value="SOCIAL_MEDIA">Social Media & Criativos</option>
                  <option value="ADMIN">Administrador / Diretoria</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Squad Responsável</label>
                <select
                  value={editSquadId}
                  onChange={(e) => setEditSquadId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Nenhum Squad (Acesso Geral)</option>
                  {squads.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                >
                  Confirmar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar Squad */}
      {isCreateSquadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Criar Novo Squad</h3>

            <form onSubmit={handleCreateSquadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome do Squad *</label>
                <input
                  type="text"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="Ex: Squad Delta (Infoprodutos)"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Descrição / Foco de Contas</label>
                <textarea
                  rows={2}
                  value={squadDesc}
                  onChange={(e) => setSquadDesc(e.target.value)}
                  placeholder="Escopo de clientes e atuação do squad..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Cor Identificadora</label>
                <input
                  type="color"
                  value={squadColor}
                  onChange={(e) => setSquadColor(e.target.value)}
                  className="w-full h-9 p-1 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsCreateSquadModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                >
                  Salvar Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar Evento de Metas */}
      {isCreateGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Criar Evento de Meta & Competição</h3>

            <form onSubmit={handleCreateGoalSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Título da Campanha *</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Ex: Batalha de Vendas Black Friday"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Tipo de Meta</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="VENDAS">Faturamento de Vendas (R$)</option>
                    <option value="ROAS">ROAS Médio da Carteira</option>
                    <option value="RENOVACOES">Retenção e Contratos Fechados</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Alvo da Meta</label>
                  <input
                    type="number"
                    value={goalTargetValue}
                    onChange={(e) => setGoalTargetValue(e.target.value)}
                    placeholder="500000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Premiação Prometida *</label>
                <input
                  type="text"
                  value={goalPrize}
                  onChange={(e) => setGoalPrize(e.target.value)}
                  placeholder="Ex: R$ 5.000 em bônus + Troféu"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Início</label>
                  <input
                    type="text"
                    value={goalStart}
                    onChange={(e) => setGoalStart(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Término</label>
                  <input
                    type="text"
                    value={goalEnd}
                    onChange={(e) => setGoalEnd(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsCreateGoalModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                >
                  Iniciar Campanha de Metas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
