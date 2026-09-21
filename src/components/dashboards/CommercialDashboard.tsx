import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  MessageSquare, 
  Clock, 
  Filter, 
  Check,
  TrendingUp,
  DollarSign,
  FolderOpen,
  Globe,
  MapPin,
  ExternalLink,
  Calendar,
  Layers,
  Award,
  Trash2,
  Phone,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CommercialLead, LeadStatus, LeadSource, UserAccount, ClientData, OneOffService } from '../../types/hub';
import { formatDateBR, formatBRL } from '../../utils/formatters';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

interface CommercialDashboardProps {
  leads: CommercialLead[];
  clients?: ClientData[];
  services?: OneOffService[];
  currentUser?: UserAccount;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onOpenNewLeadModal: () => void;
  onConvertLeadToClient: (lead: CommercialLead) => void;
  onDeleteLead?: (leadId: string) => void;
}

const STAGE_FILTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'Todas as Etapas' },
  { key: 'NOVO', label: 'Novo Lead' },
  { key: 'QUALIFICADO', label: 'Qualificado' },
  { key: 'REUNIAO_AGENDADA', label: 'Reunião Agendada' },
  { key: 'PROPOSTA_ENVIADA', label: 'Proposta Enviada' },
  { key: 'FECHADO', label: 'Contrato Fechado' },
  { key: 'PERDIDO', label: 'Perdido' },
];

export const CommercialDashboard: React.FC<CommercialDashboardProps> = ({
  leads,
  clients = [],
  services = [],
  currentUser,
  onUpdateLeadStatus,
  onOpenNewLeadModal,
  onConvertLeadToClient,
  onDeleteLead
}) => {
  const [activeCommercialSubTab, setActiveCommercialSubTab] = useState<'PIPELINE' | 'CASES' | 'REVENUE'>('PIPELINE');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtros de Cases / Portfólio
  const [caseSearch, setCaseSearch] = useState('');
  const [caseSegmentFilter, setCaseSegmentFilter] = useState<string>('ALL');

  // Modal de Exclusão Segura
  const [leadToDelete, setLeadToDelete] = useState<CommercialLead | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const canManageCommercial = !currentUser || currentUser.role === 'COMMERCIAL' || currentUser.role === 'ADMIN';

  // Leads filtrados
  const filteredLeads = leads.filter(l => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    return true;
  });

  // Métricas do Funil Comercial
  const totalPipelineBudget = leads
    .filter(l => l.status !== 'PERDIDO')
    .reduce((acc, l) => acc + (l.estimatedBudget || 0), 0);

  const totalProposedFees = leads
    .filter(l => l.status !== 'PERDIDO')
    .reduce((acc, l) => acc + (l.proposedFee || 0), 0);

  const closedCount = leads.filter(l => l.status === 'FECHADO').length;
  const activeLeadsCount = leads.filter(l => l.status !== 'PERDIDO' && l.status !== 'FECHADO').length;

  // Métricas Consolidadas de Faturamento (Mensalidades + Serviços Avulsos)
  const totalMonthlyFeeMRR = clients
    .filter(c => c.status === 'ATIVO' || c.status === 'ONBOARDING')
    .reduce((acc, c) => acc + (c.monthlyFee || 0), 0);

  const totalServicesRevenue = services
    .reduce((acc, s) => acc + (s.price || 0), 0);

  const totalRevenueConsolidated = totalMonthlyFeeMRR + totalServicesRevenue;

  // Lista de Segmentos Únicos para Filtro de Cases
  const uniqueSegments = Array.from(new Set(clients.map(c => c.segment).filter(Boolean)));

  const filteredClientsForCases = clients.filter(c => {
    const matchesSearch = 
      c.tradeName.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(caseSearch.toLowerCase()) ||
      c.segment.toLowerCase().includes(caseSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (caseSegmentFilter !== 'ALL' && c.segment !== caseSegmentFilter) return false;
    return true;
  });

  const handleOpenDelete = (lead: CommercialLead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (leadToDelete && onDeleteLead) {
      onDeleteLead(leadToDelete.id);
      setLeadToDelete(null);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NOVO':
        return { 
          label: 'Novo Lead', 
          bg: 'bg-slate-100 dark:bg-[#1F2124] text-slate-700 dark:text-[#A0AEC0] border-slate-200 dark:border-[#2D3035]' 
        };
      case 'QUALIFICADO':
        return { 
          label: 'Qualificado', 
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50' 
        };
      case 'REUNIAO_AGENDADA':
        return { 
          label: 'Reunião Agendada', 
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50' 
        };
      case 'PROPOSTA_ENVIADA':
        return { 
          label: 'Proposta Enviada', 
          bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50' 
        };
      case 'FECHADO':
        return { 
          label: 'Fechado (Ganho)', 
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00FF66] border-emerald-200 dark:border-emerald-700/50' 
        };
      case 'PERDIDO':
        return { 
          label: 'Perdido', 
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700/50' 
        };
    }
  };

  const getSourceLabel = (src: LeadSource) => {
    switch (src) {
      case 'TRAFEGO_PAGO': return 'Tráfego Pago';
      case 'INDICACAO': return 'Indicação';
      case 'INSTAGRAM': return 'Instagram';
      case 'OUTBOUND': return 'Outbound';
      case 'EVENTO': return 'Evento';
      case 'SITE': return 'Site Flyto';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Header do Comercial com Seletor de Sub-Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-5 shadow-xs beam-border-slow">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
            <span>Comercial & Expansão da Assessoria</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-0.5">
            CRM de vendas, cases de sucesso para apresentação e consolidação total de receitas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternador de Visualização */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#121315] rounded-2xl border border-slate-200 dark:border-[#2D3035]">
            <button
              onClick={() => setActiveCommercialSubTab('PIPELINE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCommercialSubTab === 'PIPELINE'
                  ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pipeline CRM
            </button>
            <button
              onClick={() => setActiveCommercialSubTab('CASES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCommercialSubTab === 'CASES'
                  ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cases & Portfólio ({clients.length})
            </button>
            <button
              onClick={() => setActiveCommercialSubTab('REVENUE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCommercialSubTab === 'REVENUE'
                  ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Faturamento Consolidado
            </button>
          </div>

          {canManageCommercial && (
            <button
              onClick={onOpenNewLeadModal}
              className="px-4 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] hover:opacity-95 text-white dark:text-[#07130E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-ABA 1: PIPELINE & CRM DE LEADS */}
      {/* ========================================================================= */}
      {activeCommercialSubTab === 'PIPELINE' && (
        <div className="space-y-4">
          {/* Cartões de Indicadores de Vendas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Em Negociação</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {activeLeadsCount}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block mt-0.5">Oportunidades ativas</span>
            </div>

            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Mídia em Pipeline</span>
              <span className="text-2xl font-black text-[#277e1b] dark:text-[#00FF66] tabular-nums tracking-tight">
                {formatBRL(totalPipelineBudget)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block mt-0.5">Budget total de anúncios</span>
            </div>

            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Fees Propostos</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatBRL(totalProposedFees)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block mt-0.5">Potencial mensal de novas contas</span>
            </div>

            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Fechamentos</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-[#00FF66] tabular-nums tracking-tight">
                {closedCount}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block mt-0.5">Contratos convertidos</span>
            </div>
          </div>

          {/* Filtros de Estágio do Funil */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STAGE_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === f.key
                    ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/30'
                    : 'bg-white dark:bg-[#181A1D] text-slate-500 dark:text-[#8E959E] border border-slate-200 dark:border-[#2D3035] hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabela de Leads */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                    <th className="py-3 px-4">Empresa / Lead</th>
                    <th className="py-3 px-3">Contato / WhatsApp</th>
                    <th className="py-3 px-3">Nicho</th>
                    <th className="py-3 px-3">Budget Anúncios</th>
                    <th className="py-3 px-3">Fee Proposto</th>
                    <th className="py-3 px-3">Origem</th>
                    <th className="py-3 px-3">Status do Funil</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-[#696969]">
                        Nenhum lead encontrado para este filtro. Cadastre uma oportunidade no botão acima.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const badge = getStatusBadge(lead.status);
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {lead.companyName}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              {lead.city && <span>{lead.city}/{lead.state || 'DF'}</span>}
                              {lead.websiteUrl && (
                                <a
                                  href={lead.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#277e1b] dark:text-[#00FF66] hover:underline flex items-center gap-0.5 font-bold"
                                >
                                  <Globe className="w-2.5 h-2.5" />
                                  <span>Site</span>
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-slate-800 dark:text-white block">{lead.contactName}</span>
                            <a
                              href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#277e1b] dark:text-[#00FF66] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{lead.whatsapp}</span>
                            </a>
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-[#121315] text-slate-700 dark:text-slate-300">
                              {lead.segment}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap font-black text-slate-900 dark:text-white">
                            {formatBRL(lead.estimatedBudget || 0)}
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap font-black text-[#277e1b] dark:text-[#00FF66]">
                            {formatBRL(lead.proposedFee || 0)}/mês
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                            {getSourceLabel(lead.source)}
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer focus:outline-hidden ${badge.bg}`}
                            >
                              <option value="NOVO">Novo Lead</option>
                              <option value="QUALIFICADO">Qualificado</option>
                              <option value="REUNIAO_AGENDADA">Reunião Agendada</option>
                              <option value="PROPOSTA_ENVIADA">Proposta Enviada</option>
                              <option value="FECHADO">Fechado (Ganho)</option>
                              <option value="PERDIDO">Perdido</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {lead.status === 'FECHADO' && (
                                <button
                                  onClick={() => onConvertLeadToClient(lead)}
                                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                                  title="Iniciar Implantação e Onboarding"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Ativar Cliente</span>
                                </button>
                              )}

                              {onDeleteLead && (
                                <button
                                  onClick={() => handleOpenDelete(lead)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 transition-colors cursor-pointer"
                                  title="Excluir Oportunidade com Segurança"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 2: CASES DE SUCESSO & PORTFÓLIO DE CLIENTES */}
      {/* ========================================================================= */}
      {activeCommercialSubTab === 'CASES' && (
        <div className="space-y-4">
          {/* Barra de Busca e Filtro por Nicho */}
          <div className="p-4 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={caseSearch}
                onChange={(e) => setCaseSearch(e.target.value)}
                placeholder="Buscar por cliente, nicho, cidade ou estado..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Nicho:</span>
              <select
                value={caseSegmentFilter}
                onChange={(e) => setCaseSegmentFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Todos os Nichos</option>
                {uniqueSegments.map(seg => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabela de Portfólio e Cases para o Comercial */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                    <th className="py-3.5 px-4">Cliente / Empresa</th>
                    <th className="py-3.5 px-3">Nicho</th>
                    <th className="py-3.5 px-3">Localização</th>
                    <th className="py-3.5 px-3">Links Rápidos</th>
                    <th className="py-3.5 px-3">ROAS & Performance</th>
                    <th className="py-3.5 px-3">Período de Contrato</th>
                    <th className="py-3.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
                  {filteredClientsForCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-slate-400 dark:text-[#696969]">
                        Nenhum cliente cadastrado no portfólio ainda. Assim que você converter um lead ou cadastrar clientes, eles aparecerão aqui com todos os links e dados de case!
                      </td>
                    </tr>
                  ) : (
                    filteredClientsForCases.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <strong className="font-black text-slate-900 dark:text-white block text-xs">
                            {client.tradeName}
                          </strong>
                          <span className="text-[10px] text-slate-400 block">{client.owners} &middot; {client.phone}</span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66]">
                            {client.segment}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>{client.city} - {client.state}</span>
                          </div>
                          {client.address && (
                            <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                              {client.address}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {client.driveFolderUrl && (
                              <a
                                href={client.driveFolderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] inline-flex items-center gap-1 transition-colors"
                              >
                                <FolderOpen className="w-3 h-3" />
                                <span>Drive</span>
                              </a>
                            )}

                            {client.websiteUrl ? (
                              <a
                                href={client.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-[#277e1b] dark:text-[#00FF66] font-bold text-[10px] inline-flex items-center gap-1 transition-colors"
                              >
                                <Globe className="w-3 h-3" />
                                <span>Site / Insta</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Sem site</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap font-mono">
                          <div className="font-black text-[#277e1b] dark:text-[#00FF66] text-xs">
                            {client.currentRoas > 0 ? `${client.currentRoas.toFixed(2)}x ROAS` : 'Em Otimização'}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Faturado: {formatBRL(client.revenueGenerated || 0)}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-[#8E959E] font-mono text-[11px]">
                          <div>Início: <strong>{formatDateBR(client.contractStartDate)}</strong></div>
                          <div>Fim: <strong>{formatDateBR(client.contractEndDate)}</strong></div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            client.status === 'ATIVO' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#00FF66]' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 3: FATURAMENTO CONSOLIDADO & ENTRADAS */}
      {/* ========================================================================= */}
      {activeCommercialSubTab === 'REVENUE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Receita Recorrente (MRR)</span>
              <span className="text-2xl font-black text-[#277e1b] dark:text-[#00FF66] tabular-nums tracking-tight">
                {formatBRL(totalMonthlyFeeMRR)}/mês
              </span>
              <span className="text-xs text-slate-500 dark:text-[#8E959E] block mt-0.5">Mensalidades de contratos ativos</span>
            </div>

            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Projetos & Serviços Avulsos</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums tracking-tight">
                {formatBRL(totalServicesRevenue)}
              </span>
              <span className="text-xs text-slate-500 dark:text-[#8E959E] block mt-0.5">Landing pages, sites, apps e integrações</span>
            </div>

            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Faturamento Total Consolidado</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatBRL(totalRevenueConsolidated)}
              </span>
              <span className="text-xs text-slate-500 dark:text-[#8E959E] block mt-0.5">Tudo o que entra na assessoria</span>
            </div>
          </div>

          {/* Tabela Unificada de Todas as Entradas */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-[#25282C]">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Discriminação de Todas as Entradas Financeiras
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                    <th className="py-3 px-4">Fonte / Cliente</th>
                    <th className="py-3 px-3">Tipo de Entrada</th>
                    <th className="py-3 px-3">Valor</th>
                    <th className="py-3 px-3">Forma / Status</th>
                    <th className="py-3 px-3">Data / Ciclo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
                  {clients.length === 0 && services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Nenhum faturamento registrado no momento.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {clients.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124]">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {c.tradeName}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-[#277e1b] dark:bg-emerald-950/40 dark:text-[#00FF66]">
                              Mensalidade Recorrente
                            </span>
                          </td>
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white font-mono">
                            {formatBRL(c.monthlyFee)}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                            {c.paymentMethod} &middot; <span className="text-[#277e1b] dark:text-[#00FF66] font-bold">Ativo</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                            {c.billingCycle} (Início: {formatDateBR(c.contractStartDate)})
                          </td>
                        </tr>
                      ))}

                      {services.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124]">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {s.clientName} <span className="text-[10px] text-slate-400 font-normal">({s.title})</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              Serviço Avulso
                            </span>
                          </td>
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white font-mono">
                            {formatBRL(s.price)}
                          </td>
                          <td className="py-3 px-3 font-bold text-[10px]">
                            {s.paymentStatus === 'PAGO' ? (
                              <span className="text-[#277e1b] dark:text-[#00FF66]">100% Pago</span>
                            ) : s.paymentStatus === 'ENTRADA_50' ? (
                              <span className="text-amber-600">50% Entrada</span>
                            ) : (
                              <span className="text-rose-600">Pendente</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                            Entrega: {formatDateBR(s.deliveryDate)}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão Segura */}
      {leadToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Excluir Lead Comercial"
          itemName={leadToDelete.companyName}
          itemTypeDescription="a oportunidade comercial do CRM"
          onClose={() => {
            setIsDeleteModalOpen(false);
            setLeadToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

    </div>
  );
};
