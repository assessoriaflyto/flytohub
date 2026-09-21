import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Search, 
  ExternalLink, 
  FolderOpen, 
  Filter, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BarChart2,
  CalendarCheck,
  Video,
  Check,
  Calendar,
  DollarSign,
  AlertCircle,
  History,
  FileCheck,
  ArrowUpDown,
  PauseCircle,
  PlayCircle,
  XCircle,
  CreditCard,
  Users
} from 'lucide-react';
import { ClientData, ClientStatus, MetaBalanceStatus, ScheduledMeeting, UserAccount, Squad, PaymentMethod } from '../../types/hub';
import { formatDateBR, formatDateTimeBR, formatBRL } from '../../utils/formatters';

interface TrafficDashboardProps {
  clients: ClientData[];
  currentUser?: UserAccount;
  squads?: Squad[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  onUpdateClientRoas: (clientId: string, newRoas: number) => void;
  onUpdateClientStatus?: (clientId: string, status: ClientStatus) => void;
  onToggleRoutineCheck: (
    clientId: string, 
    checkKey: 'weeklyReportSent' | 'weeklyOptimizationDone' | 'videoBriefingDone' | 'videoEditedDone' | 'creativeUploadedDone'
  ) => void;
  onUpdateMetaBalanceStatus: (clientId: string, status: MetaBalanceStatus, rechargeAmount?: number) => void;
  onOpenEditDriveModal: (client: ClientData) => void;
  onOpenScheduleMeetingModal: (client: ClientData) => void;
  onSaveOptimizationNote: (clientId: string, note: string) => void;
  onUpdatePaymentMethod?: (clientId: string, method: PaymentMethod) => void;
}

export const TrafficDashboard: React.FC<TrafficDashboardProps> = ({
  clients,
  currentUser,
  squads,
  selectedClientId,
  onSelectClient,
  onUpdateClientRoas,
  onUpdateClientStatus,
  onToggleRoutineCheck,
  onUpdateMetaBalanceStatus,
  onOpenEditDriveModal,
  onOpenScheduleMeetingModal,
  onSaveOptimizationNote,
  onUpdatePaymentMethod
}) => {
  const isTrafficManager = currentUser?.role === 'TRAFFIC_MANAGER';
  const [selectedSquadId, setSelectedSquadId] = useState<string>(
    isTrafficManager && currentUser?.squadId ? currentUser.squadId : 'ALL'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BELOW_TARGET' | 'MEETING_SCHEDULED' | 'PENDING_ROUTINE'>('ALL');
  const [contractStatusFilter, setContractStatusFilter] = useState<'ALL' | 'ATIVO' | 'PAUSADO' | 'CANCELADO'>('ALL');
  const [sortBy, setSortBy] = useState<'BUDGET_DESC' | 'ROAS_DESC' | 'ROAS_ASC' | 'NAME_ASC'>('BUDGET_DESC');
  
  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRoas, setEditingRoas] = useState<string>('');
  const [tempNote, setTempNote] = useState('');
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [rechargeInput, setRechargeInput] = useState('');

  const activeClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // Filtragem e Ordenação da tabela
  const filteredClients = useMemo(() => {
    const list = clients.filter(c => {
      // 0. Filtro de Squad (Gestor de Tráfego vê apenas seu squad)
      if (isTrafficManager && currentUser?.squadId) {
        if (c.squadId !== currentUser.squadId) return false;
      } else if (selectedSquadId !== 'ALL') {
        if (c.squadId !== selectedSquadId) return false;
      }

      // 1. Busca textual
      const matchesSearch = 
        c.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filtro de Status de Contrato (Ativo, Pausado, Cancelado)
      if (contractStatusFilter !== 'ALL') {
        if (c.status !== contractStatusFilter) return false;
      }

      // 3. Filtros Operacionais
      if (statusFilter === 'BELOW_TARGET') {
        return c.currentRoas < c.targetRoas;
      }
      if (statusFilter === 'MEETING_SCHEDULED') {
        return Boolean(c.scheduledMeeting);
      }
      if (statusFilter === 'PENDING_ROUTINE') {
        const r = c.routine;
        return !r.weeklyReportSent || !r.weeklyOptimizationDone || !r.videoBriefingDone || !r.videoEditedDone || !r.creativeUploadedDone;
      }

      return true;
    });

    // 4. Ordenação
    return [...list].sort((a, b) => {
      if (sortBy === 'BUDGET_DESC') {
        return b.budgetMonthly - a.budgetMonthly;
      }
      if (sortBy === 'ROAS_DESC') {
        return b.currentRoas - a.currentRoas;
      }
      if (sortBy === 'ROAS_ASC') {
        return a.currentRoas - b.currentRoas;
      }
      if (sortBy === 'NAME_ASC') {
        return a.tradeName.localeCompare(b.tradeName);
      }
      return 0;
    });
  }, [clients, isTrafficManager, currentUser, selectedSquadId, searchTerm, statusFilter, contractStatusFilter, sortBy]);

  const handleRowClick = (client: ClientData) => {
    onSelectClient(client.id);
    setEditingRoas(client.currentRoas.toString());
    setTempNote(client.lastOptimizationNote || '');
    setRechargeInput(client.metaBalance.lastRechargeAmount?.toString() || '');
    setIsDrawerOpen(true);
  };

  const handleSaveRoas = (clientId: string) => {
    const val = parseFloat(editingRoas.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      onUpdateClientRoas(clientId, val);
    }
  };

  // Clique na Otimização Semanal (obriga a preencher nota antes de marcar!)
  const handleOptimizationCheckClick = (client: ClientData) => {
    if (client.routine.weeklyOptimizationDone) {
      onToggleRoutineCheck(client.id, 'weeklyOptimizationDone');
    } else {
      onSelectClient(client.id);
      setTempNote(client.lastOptimizationNote || '');
      setShowOptimizationModal(true);
    }
  };

  const handleConfirmOptimizationNote = () => {
    if (!activeClient) return;
    if (!tempNote.trim()) {
      alert('Por favor, digite uma breve observação da otimização para registrar no histórico.');
      return;
    }
    onSaveOptimizationNote(activeClient.id, tempNote.trim());
    onToggleRoutineCheck(activeClient.id, 'weeklyOptimizationDone');
    setShowOptimizationModal(false);
  };

  const handleSaveRechargeAmount = (clientId: string) => {
    const val = parseFloat(rechargeInput.replace(',', '.'));
    if (!isNaN(val) && val >= 0 && activeClient) {
      onUpdateMetaBalanceStatus(clientId, activeClient.metaBalance.status, val);
    }
  };

  const handleStatusChange = (clientId: string, newStatus: ClientStatus) => {
    if (onUpdateClientStatus) {
      onUpdateClientStatus(clientId, newStatus);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Barra de Busca, Ordenação e Filtros */}
      <div className="p-3.5 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl shadow-xs space-y-3 beam-border-slow">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, nicho ou cidade..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Ordenação por Orçamento, ROAS, Nome & Squad Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {squads && squads.length > 0 && !isTrafficManager && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] text-xs">
                <Users className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" />
                <span className="font-bold text-slate-600 dark:text-[#A0AEC0]">Squad:</span>
                <select
                  value={selectedSquadId}
                  onChange={(e) => setSelectedSquadId(e.target.value)}
                  className="bg-transparent font-extrabold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL" className="bg-white dark:bg-[#181A1D]">Todos os Squads</option>
                  {squads.map(sq => (
                    <option key={sq.id} value={sq.id} className="bg-white dark:bg-[#181A1D]">
                      {sq.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isTrafficManager && currentUser?.squadId && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold text-emerald-700 dark:text-[#00FF66]">
                <Users className="w-3.5 h-3.5" />
                <span>Squad: {squads?.find(s => s.id === currentUser.squadId)?.name || 'Meu Squad'}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" />
              <span className="font-bold text-slate-600 dark:text-[#A0AEC0]">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-extrabold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="BUDGET_DESC" className="bg-white dark:bg-[#181A1D]">Maior Orçamento</option>
                <option value="ROAS_DESC" className="bg-white dark:bg-[#181A1D]">Maior ROAS</option>
                <option value="ROAS_ASC" className="bg-white dark:bg-[#181A1D]">Menor ROAS (Atenção)</option>
                <option value="NAME_ASC" className="bg-white dark:bg-[#181A1D]">Nome (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Linha de Filtros de Status e Operacionais */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
          {/* Status do Contrato */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] mr-1">Status:</span>
            <button
              onClick={() => setContractStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                contractStatusFilter === 'ALL'
                  ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({clients.length})
            </button>
            <button
              onClick={() => setContractStatusFilter('ATIVO')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                contractStatusFilter === 'ATIVO'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00FF66] border border-emerald-200 dark:border-emerald-800/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#277e1b] dark:bg-[#00FF66]" />
              <span>Ativos</span>
            </button>
            <button
              onClick={() => setContractStatusFilter('PAUSADO')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                contractStatusFilter === 'PAUSADO'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Pausados</span>
            </button>
            <button
              onClick={() => setContractStatusFilter('CANCELADO')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                contractStatusFilter === 'CANCELADO'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Cancelados</span>
            </button>
          </div>

          {/* Filtros Operacionais */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setStatusFilter(statusFilter === 'MEETING_SCHEDULED' ? 'ALL' : 'MEETING_SCHEDULED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'MEETING_SCHEDULED'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Calls Agendadas</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'BELOW_TARGET' ? 'ALL' : 'BELOW_TARGET')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'BELOW_TARGET'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700/50'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-500" />
              <span>ROAS Crítico</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'PENDING_ROUTINE' ? 'ALL' : 'PENDING_ROUTINE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'PENDING_ROUTINE'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Rotina Pendente</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. TABELA DO GESTOR DE TRÁFEGO */}
      <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Orçamento</th>
                <th className="py-3 px-3">Gasto (Mês)</th>
                <th className="py-3 px-3">Faturamento Atual</th>
                <th className="py-3 px-3">ROAS</th>
                <th className="py-3 px-3">Saldo Meta</th>
                <th className="py-3 px-3">Rotina (Reset Dom 18h)</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#202226] text-xs">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-[#696969]">
                    Nenhum cliente encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isRoasBelow = client.currentRoas < client.targetRoas;
                  const routineDoneCount = [
                    client.routine.weeklyReportSent,
                    client.routine.weeklyOptimizationDone,
                    client.routine.videoBriefingDone,
                    client.routine.videoEditedDone,
                    client.routine.creativeUploadedDone
                  ].filter(Boolean).length;
                  const isRoutineComplete = routineDoneCount === 5;
                  const metaBal = client.metaBalance;

                  return (
                    <tr
                      key={client.id}
                      onClick={() => handleRowClick(client)}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors cursor-pointer group"
                    >
                      {/* Cliente & Segmento */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-[#277e1b] dark:group-hover:text-[#00FF66] transition-colors">
                            {client.tradeName}
                          </span>
                          <a
                            href={client.driveFolderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded transition-colors"
                            title="Abrir pasta no Google Drive"
                          >
                            <FolderOpen className="w-3 h-3 opacity-60 hover:opacity-100" />
                          </a>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block truncate max-w-[200px]">
                          {client.segment}
                        </span>

                        {/* AVISO DESTACADO DE REUNIÃO AGENDADA (Formato: Horário - Data) */}
                        {client.scheduledMeeting && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(client.scheduledMeeting?.meetUrl, '_blank');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 hover:underline cursor-pointer"
                            title={`Link: ${client.scheduledMeeting.meetUrl} - Clique para abrir o Meet`}
                          >
                            <Video className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span>Call: {formatDateTimeBR(client.scheduledMeeting.date)}</span>
                          </div>
                        )}
                      </td>

                      {/* Status do Cliente */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            client.status === 'ATIVO' 
                              ? 'bg-[#277e1b] dark:bg-[#00FF66] animate-pulse' 
                              : client.status === 'PAUSADO'
                              ? 'bg-amber-400 dark:bg-amber-500'
                              : 'bg-rose-500 dark:bg-rose-400'
                          }`} />
                          <span className={`text-xs font-bold tracking-tight ${
                            client.status === 'ATIVO'
                              ? 'text-slate-900 dark:text-white'
                              : client.status === 'PAUSADO'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                      </td>

                      {/* Orçamento */}
                      <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatBRL(client.budgetMonthly)}
                      </td>

                      {/* Gasto (Mês) */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700 dark:text-[#A0AEC0] tabular-nums">
                        {formatBRL(client.monthlyAdSpend)}
                      </td>

                      {/* Faturamento Atual */}
                      <td className="py-3 px-3 whitespace-nowrap font-bold text-[#277e1b] dark:text-[#00FF66] tabular-nums">
                        {formatBRL(client.revenueGenerated)}
                      </td>

                      {/* ROAS com indicador visual */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-black text-sm tabular-nums ${
                            isRoasBelow 
                              ? 'text-rose-600 dark:text-rose-400' 
                              : 'text-[#277e1b] dark:text-[#00FF66]'
                          }`}>
                            {client.currentRoas.toFixed(2)}x
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-[#696969]">
                            meta {client.targetRoas.toFixed(1)}x
                          </span>
                        </div>
                      </td>

                      {/* Saldo Meta (Interativo: Pago / Pendente / Verificar) */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <select
                            value={metaBal.status}
                            onChange={(e) => onUpdateMetaBalanceStatus(client.id, e.target.value as MetaBalanceStatus)}
                            className={`text-xs font-black rounded-lg px-2 py-1 border transition-all cursor-pointer focus:outline-hidden ${
                              metaBal.status === 'PAGO'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#277e1b] dark:text-[#00FF66] border-emerald-200 dark:border-emerald-800/40'
                                : metaBal.status === 'PENDENTE'
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'
                            }`}
                          >
                            <option value="PAGO">Pago</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="VERIFICAR">Verificar</option>
                          </select>
                        </div>
                        {metaBal.lastRechargeAmount > 0 && (
                          <span className="text-[9px] text-slate-500 dark:text-[#696969] block mt-0.5">
                            Recarga: {formatBRL(metaBal.lastRechargeAmount)} ({formatDateBR(metaBal.lastRechargeDate)})
                          </span>
                        )}
                      </td>

                      {/* Rotina Semanal (Checks 1 a 5) */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-bold mr-1 ${
                            isRoutineComplete 
                              ? 'text-[#277e1b] dark:text-[#00FF66]' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {routineDoneCount}/5 checks
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-[#696969]">
                            (Dom 18h)
                          </span>
                        </div>
                      </td>

                      {/* Ação */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleRowClick(client)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-[#A0AEC0] dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#121315] dark:hover:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Métricas</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. GAVETA LATERAL DE INSPEÇÃO DE MÉTRICAS DO GESTOR */}
      {isDrawerOpen && activeClient && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/40 dark:bg-black/75 backdrop-blur-xs animate-fadeIn cursor-pointer"
          onClick={() => {
            setIsDrawerOpen(false);
            onSelectClient(null);
          }}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#181A1D] border-l border-slate-200 dark:border-[#2D3035] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col beam-border-slow animate-slideInRight cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Topo do Drawer */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-[#25282C]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeClient.tradeName}
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className={`w-2 h-2 rounded-full ${
                      activeClient.status === 'ATIVO' 
                        ? 'bg-[#277e1b] dark:bg-[#00FF66] animate-pulse' 
                        : activeClient.status === 'PAUSADO' 
                        ? 'bg-amber-400' 
                        : 'bg-rose-500'
                    }`} />
                    <span className={`text-xs font-bold ${
                      activeClient.status === 'ATIVO'
                        ? 'text-[#277e1b] dark:text-[#00FF66]'
                        : activeClient.status === 'PAUSADO'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>{activeClient.status}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#696969] mt-0.5">{activeClient.segment} &middot; {activeClient.city} - {activeClient.state}</p>
              </div>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onSelectClient(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controle Rápido de Status do Contrato (Pausar / Cancelar / Reativar) */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">Situação do Cliente</span>
                <span className="text-[11px] text-slate-500 dark:text-[#8E959E]">
                  {activeClient.status === 'ATIVO' && 'Campanhas rodando normalmente'}
                  {activeClient.status === 'PAUSADO' && 'Campanhas em pausa temporária'}
                  {activeClient.status === 'CANCELADO' && 'Contrato rescindido / inativo'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {activeClient.status !== 'ATIVO' && (
                  <button
                    onClick={() => handleStatusChange(activeClient.id, 'ATIVO')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Reativar</span>
                  </button>
                )}

                {activeClient.status === 'ATIVO' && (
                  <button
                    onClick={() => handleStatusChange(activeClient.id, 'PAUSADO')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-1 cursor-pointer"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </button>
                )}

                {activeClient.status !== 'CANCELADO' && (
                  <button
                    onClick={() => {
                      const confirmCancel = window.confirm(`Deseja realmente marcar o contrato de "${activeClient.tradeName}" como CANCELADO?`);
                      if (confirmCancel) handleStatusChange(activeClient.id, 'CANCELADO');
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Forma de Pagamento Editável e Fee da Assessoria */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#277e1b]/10 dark:bg-[#00FF66]/10 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66] shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-[#696969] block">
                    Forma de Pagamento (Anúncios)
                  </span>
                  {onUpdatePaymentMethod ? (
                    <select
                      value={activeClient.paymentMethod}
                      onChange={(e) => onUpdatePaymentMethod(activeClient.id, e.target.value as PaymentMethod)}
                      className="mt-1 text-xs font-extrabold bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-lg px-2.5 py-1 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="CARTAO">Cartão de Crédito Corporativo</option>
                      <option value="PIX">PIX / Pré-Pago Direto</option>
                      <option value="BOLETO">Boleto Bancário / Faturado</option>
                      <option value="TRANSFERENCIA">Transferência Bancária</option>
                    </select>
                  ) : (
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {activeClient.paymentMethod === 'CARTAO' && 'Cartão de Crédito Corporativo'}
                      {activeClient.paymentMethod === 'PIX' && 'PIX / Pré-Pago Direto'}
                      {activeClient.paymentMethod === 'BOLETO' && 'Boleto Bancário / Faturado'}
                      {activeClient.paymentMethod === 'TRANSFERENCIA' && 'Transferência Bancária'}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 dark:text-[#696969] block">Fee da Assessoria</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{formatBRL(activeClient.monthlyFee)}/mês</span>
              </div>
            </div>

            {/* Ações Rápidas: Google Meet & Google Drive */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenScheduleMeetingModal(activeClient)}
                className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                    {activeClient.scheduledMeeting ? 'Call Agendada' : 'Agendar Reunião'}
                  </span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 block truncate max-w-[140px]">
                    {activeClient.scheduledMeeting ? formatDateTimeBR(activeClient.scheduledMeeting.date) : 'Google Meet'}
                  </span>
                </div>
                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>

              <a
                href={activeClient.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121315] dark:hover:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Google Drive</span>
                  <span className="text-[10px] text-slate-500 dark:text-[#696969] block truncate max-w-[140px]">
                    Pastas e criativos
                  </span>
                </div>
                <FolderOpen className="w-4 h-4 text-slate-600 dark:text-[#00FF66]" />
              </a>
            </div>

            {/* Edição Rápida de ROAS */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">Atualizar ROAS Atual</span>
                <span className="text-xs font-extrabold text-[#277e1b] dark:text-[#00FF66]">Meta: {activeClient.targetRoas}x</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingRoas}
                  onChange={(e) => setEditingRoas(e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                  placeholder="Ex: 4.80"
                />
                <button
                  onClick={() => handleSaveRoas(activeClient.id)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-all cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>

            {/* Saldo Meta Ads & Recarga Rápida */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">Saldo Meta Ads (Recarga)</span>
                <span className="text-xs text-slate-500 dark:text-[#696969]">
                  Última: {formatDateBR(activeClient.metaBalance.lastRechargeDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rechargeInput}
                  onChange={(e) => setRechargeInput(e.target.value)}
                  placeholder="Valor recarregado (R$)"
                  className="flex-1 p-2 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                />
                <button
                  onClick={() => handleSaveRechargeAmount(activeClient.id)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-800 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all cursor-pointer"
                >
                  Salvar Recarga
                </button>
              </div>
            </div>

            {/* Checklist de Rotina Semanal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Rotina Semanal do Gestor (Reset Dom 18h)
                </h4>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'weeklyReportSent', label: '1. Relatório Semanal Enviado' },
                  { key: 'weeklyOptimizationDone', label: '2. Otimização Semanal Realizada (exige nota)' },
                  { key: 'videoBriefingDone', label: '3. Briefing de Vídeo Alinhado' },
                  { key: 'videoEditedDone', label: '4. Vídeo Editado e Revisado' },
                  { key: 'creativeUploadedDone', label: '5. Criativo Subido nas Campanhas' }
                ].map((item) => {
                  const isChecked = activeClient.routine[item.key as keyof typeof activeClient.routine];
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.key === 'weeklyOptimizationDone') {
                          handleOptimizationCheckClick(activeClient);
                        } else {
                          onToggleRoutineCheck(activeClient.id, item.key as any);
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-[#121315] border-slate-200 dark:border-[#2D3035] text-slate-600 dark:text-[#8E959E] hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-[#4D4D4D]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Histórico de Otimizações */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" />
                <span>Histórico de Atividades & Otimizações</span>
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {activeClient.optimizationLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-800 dark:text-white">{log.author}</span>
                      <span className="text-slate-500 dark:text-[#8E959E]">
                        {log.time} - {formatDateBR(log.date)}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-[#A0AEC0]">{log.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal de confirmação de nota de otimização */}
      {showOptimizationModal && activeClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Registrar Nota de Otimização Semanal</h3>
            <p className="text-xs text-slate-500 dark:text-[#8E959E]">
              Para marcar o check de otimização semanal de <strong>{activeClient.tradeName}</strong>, registre um resumo das ações executadas nas campanhas.
            </p>
            <textarea
              rows={3}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Descreva as otimizações realizadas..."
              className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowOptimizationModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmOptimizationNote}
                className="px-4 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 cursor-pointer"
              >
                Salvar e Marcar Check
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
