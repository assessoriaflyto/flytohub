import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  MessageSquare, 
  Clock, 
  Filter, 
  Check
} from 'lucide-react';
import { CommercialLead, LeadStatus, LeadSource } from '../../types/hub';
import { formatDateBR, formatBRL } from '../../utils/formatters';

interface CommercialDashboardProps {
  leads: CommercialLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onOpenNewLeadModal: () => void;
  onConvertLeadToClient: (lead: CommercialLead) => void;
}

export const CommercialDashboard: React.FC<CommercialDashboardProps> = ({
  leads,
  onUpdateLeadStatus,
  onOpenNewLeadModal,
  onConvertLeadToClient
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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
    <div className="space-y-5">
      
      {/* 1. Header do Comercial com Indicadores de Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-sm beam-border-slow">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
            <span>Pipeline Comercial & CRM de Oportunidades</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#696969] mt-0.5">
            Gestão de novos contratos, reuniões estratégicas e conversão de propostas
          </p>
        </div>

        <button
          onClick={onOpenNewLeadModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] hover:opacity-95 text-white dark:text-[#07130E] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Lead</span>
        </button>
      </div>

      {/* 2. Cartões de Indicadores de Vendas */}
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
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Novos Fees Mensais</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatBRL(totalProposedFees)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block mt-0.5">Honorários propostos</span>
        </div>

        <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Contratos Fechados</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-[#00FF66] tabular-nums tracking-tight">
            {closedCount}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block mt-0.5">Avançados para Onboarding</span>
        </div>

      </div>

      {/* 3. Filtros do Funil Comercial */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#277e1b] dark:text-[#00FF66]" />
          Etapa:
        </span>
        {['ALL', 'NOVO', 'QUALIFICADO', 'REUNIAO_AGENDADA', 'PROPOSTA_ENVIADA', 'FECHADO', 'PERDIDO'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === st
                ? 'bg-slate-900 dark:bg-[#00FF66] text-white dark:text-[#07130E] shadow-sm'
                : 'text-slate-600 dark:text-[#A0AEC0] bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] hover:bg-slate-50 dark:hover:bg-[#25282C]'
            }`}
          >
            {st === 'ALL' ? 'Todas Etapas' : st}
          </button>
        ))}
      </div>

      {/* 4. Tabela de Leads Comerciais */}
      <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#121315] border-b border-slate-200 dark:border-[#2D3035] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#696969] tracking-wider">
                <th className="py-3.5 px-4">Empresa & Contato</th>
                <th className="py-3.5 px-3">Segmento</th>
                <th className="py-3.5 px-3">Budget / Fee Proposto</th>
                <th className="py-3.5 px-3">Origem</th>
                <th className="py-3.5 px-3">Etapa do Funil</th>
                <th className="py-3.5 px-3">Próximo Passo / Notas</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#25282C] text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-[#696969]">
                    Nenhum lead encontrado nesta etapa.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const statusInfo = getStatusBadge(lead.status);
                  const isClosed = lead.status === 'FECHADO';

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-[#1F2124] transition-colors">
                      
                      {/* Empresa e Contato */}
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 dark:text-white font-bold text-xs block">
                          {lead.companyName}
                        </strong>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">{lead.contactName}</span>
                          <a
                            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#277e1b] dark:text-[#00FF66] hover:underline inline-flex items-center gap-0.5 font-semibold"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>{lead.whatsapp}</span>
                          </a>
                        </div>
                      </td>

                      {/* Segmento */}
                      <td className="py-3.5 px-3 text-slate-600 dark:text-[#A0AEC0]">
                        {lead.segment}
                      </td>

                      {/* Budget / Fee */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white block tabular-nums">
                          {formatBRL(lead.estimatedBudget)}
                        </span>
                        <span className="text-[10px] text-[#277e1b] dark:text-[#00FF66] block font-semibold">
                          Fee: {formatBRL(lead.proposedFee)}/mês
                        </span>
                      </td>

                      {/* Origem */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-[#696969]">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] text-[10px] font-medium">
                          {getSourceLabel(lead.source)}
                        </span>
                      </td>

                      {/* Etapa com Seletor Rápido */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none cursor-pointer transition-colors ${statusInfo.bg}`}
                        >
                          <option value="NOVO" className="bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white">Novo Lead</option>
                          <option value="QUALIFICADO" className="bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white">Qualificado</option>
                          <option value="REUNIAO_AGENDADA" className="bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white">Reunião Agendada</option>
                          <option value="PROPOSTA_ENVIADA" className="bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white">Proposta Enviada</option>
                          <option value="FECHADO" className="bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white">Fechado (Ganho)</option>
                          <option value="PERDIDO" className="bg-white dark:bg-[#1F2124] text-slate-900 dark:text-white">Perdido</option>
                        </select>
                      </td>

                      {/* Próximo Passo */}
                      <td className="py-3.5 px-3">
                        {lead.meetingDate && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Reunião: {formatDateBR(lead.meetingDate)}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0] line-clamp-1">
                          {lead.notes || 'Sem observações registradas'}
                        </span>
                      </td>

                      {/* Ação */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isClosed ? (
                          <button
                            onClick={() => onConvertLeadToClient(lead)}
                            className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Transformar em cliente e iniciar Onboarding"
                          >
                            <Check className="w-3 h-3" />
                            <span>Ativar Onboarding</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateLeadStatus(lead.id, 'FECHADO')}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-700 dark:text-[#00FF66] border border-slate-200 dark:border-[#2D3035] transition-colors cursor-pointer"
                          >
                            Fechar Contrato
                          </button>
                        )}
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
  );
};
