import React, { useState, useMemo } from 'react';
import { 
  Users, 
  History, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Share2, 
  X, 
  ExternalLink,
  ShieldCheck,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ReferralDeal, AuditLogEntry, ReferralStatus, AuditModule } from '../../types/hub';
import { formatBRL, formatDateBR, formatDateTimeBR } from '../../utils/formatters';

interface AuditAndReferralsDashboardProps {
  referrals: ReferralDeal[];
  auditLogs: AuditLogEntry[];
  onAddReferral: (deal: Omit<ReferralDeal, 'id'>) => void;
  onUpdateReferralStatus: (id: string, status: ReferralStatus) => void;
}

export const AuditAndReferralsDashboard: React.FC<AuditAndReferralsDashboardProps> = ({
  referrals,
  auditLogs,
  onAddReferral,
  onUpdateReferralStatus
}) => {
  const [subTab, setSubTab] = useState<'REFERRALS' | 'AUDIT_LOGS'>('REFERRALS');

  // Filtros de Auditoria
  const [logSearch, setLogSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState<'ALL' | AuditModule>('ALL');

  // Modal de Nova Indicação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerType, setPartnerType] = useState<ReferralDeal['partnerType']>('PARCEIRO_EXTERNO');
  const [partnerContact, setPartnerContact] = useState('');
  const [referredClientName, setReferredClientName] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [segment, setSegment] = useState('E-commerce & Varejo');
  const [contractFee, setContractFee] = useState('3000');
  const [commissionType, setCommissionType] = useState<'FIXO' | 'PERCENTUAL'>('FIXO');
  const [commissionValue, setCommissionValue] = useState('500');
  const [notes, setNotes] = useState('');

  // KPIs de Indicação
  const totalReferrals = referrals.length;
  const closedReferrals = referrals.filter(r => r.status === 'CONTRATO_FECHADO' || r.status === 'COMISSAO_PAGA').length;
  const pendingCommissionsBrl = referrals
    .filter(r => r.status === 'CONTRATO_FECHADO')
    .reduce((acc, r) => acc + r.commissionTotalBrl, 0);
  const paidCommissionsBrl = referrals
    .filter(r => r.status === 'COMISSAO_PAGA')
    .reduce((acc, r) => acc + r.commissionTotalBrl, 0);

  // Filtragem de Logs de Auditoria
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchText = 
        log.entityName.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.description.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.authorName.toLowerCase().includes(logSearch.toLowerCase());
      
      if (!matchText) return false;
      if (logModuleFilter !== 'ALL' && log.module !== logModuleFilter) return false;
      return true;
    });
  }, [auditLogs, logSearch, logModuleFilter]);

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !referredClientName.trim() || !whatsapp.trim()) return;

    const feeNum = parseFloat(contractFee) || 0;
    const commValNum = parseFloat(commissionValue) || 0;
    const totalBrl = commissionType === 'FIXO' 
      ? commValNum 
      : Math.round((feeNum * commValNum) / 100);

    const now = new Date();
    const timeNow = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateNow = now.toLocaleDateString('pt-BR');
    const formattedTimestamp = `${timeNow} - ${dateNow}`;

    onAddReferral({
      partnerName: partnerName.trim(),
      partnerType,
      partnerContact: partnerContact.trim(),
      referredClientName: referredClientName.trim(),
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
      segment,
      contractFee: feeNum,
      commissionType,
      commissionValue: commValNum,
      commissionTotalBrl: totalBrl,
      status: 'EM_NEGOCIACAO',
      date: formattedTimestamp,
      notes: notes.trim()
    });

    // Limpar form
    setPartnerName('');
    setPartnerContact('');
    setReferredClientName('');
    setContactName('');
    setWhatsapp('');
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Header do Módulo & Seletor de Sub-Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs beam-border-slow">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 border border-[#277e1b]/20 dark:border-[#00FF66]/30 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              {subTab === 'REFERRALS' ? <Award className="w-4 h-4" /> : <History className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {subTab === 'REFERRALS' ? 'Sistema de Indicações & Parcerias' : 'Central de Auditoria & Supervisão de Equipe'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#696969]">
                {subTab === 'REFERRALS' 
                  ? 'Controle de indicações de clientes, parceiros externos, colaboradores e comissões'
                  : 'Histórico completo de ações, alterações de saldo, fechamentos e notas para gestão da equipe'}
              </p>
            </div>
          </div>
        </div>

        {/* Alternador de Sub-Abas */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121315] p-1 rounded-xl border border-slate-200 dark:border-[#25282C]">
          <button
            onClick={() => setSubTab('REFERRALS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'REFERRALS'
                ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Indicações ({referrals.length})</span>
          </button>

          <button
            onClick={() => setSubTab('AUDIT_LOGS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'AUDIT_LOGS'
                ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Logs da Equipe ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: SISTEMA DE INDICAÇÕES */}
      {/* ========================================================================= */}
      {subTab === 'REFERRALS' && (
        <div className="space-y-5">
          
          {/* Métricas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#8E959E] block">Total de Indicações</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{totalReferrals}</span>
              <span className="text-[10px] text-slate-400 dark:text-[#696969] mt-0.5 block">Parceiros & Clientes</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#8E959E] block">Contratos Convertidos</span>
              <span className="text-xl font-black text-[#277e1b] dark:text-[#00FF66] mt-1 block">{closedReferrals}</span>
              <span className="text-[10px] text-emerald-600 dark:text-[#00FF66] mt-0.5 block">
                {totalReferrals > 0 ? `${Math.round((closedReferrals / totalReferrals) * 100)}% de taxa de conversão` : '0%'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#8E959E] block">Comissões a Pagar</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{formatBRL(pendingCommissionsBrl)}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 block">Contratos fechados pendentes de repasse</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#8E959E] block">Comissões Pagas</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{formatBRL(paidCommissionsBrl)}</span>
              <span className="text-[10px] text-slate-400 dark:text-[#696969] mt-0.5 block">Total já bonificado aos parceiros</span>
            </div>
          </div>

          {/* Barra de Ação da Tabela de Indicações */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">
              Oportunidades Oriundas de Parcerias & Recomendações:
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Indicação</span>
            </button>
          </div>

          {/* Tabela de Indicações */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                    <th className="py-3 px-4">Indicador / Parceiro</th>
                    <th className="py-3 px-3">Lead / Empresa Indicada</th>
                    <th className="py-3 px-3">Nicho</th>
                    <th className="py-3 px-3">Fee Proposto</th>
                    <th className="py-3 px-3">Comissão Acordada</th>
                    <th className="py-3 px-3">Data da Indicação</th>
                    <th className="py-3 px-4 text-right">Status do Contrato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
                  {referrals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors">
                      {/* Indicador */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white block">{r.partnerName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            r.partnerType === 'PARCEIRO_EXTERNO'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                              : r.partnerType === 'CLIENTE'
                              ? 'bg-emerald-50 text-[#277e1b] dark:bg-emerald-950/40 dark:text-[#00FF66] border-emerald-200 dark:border-emerald-800/40'
                              : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/40'
                          }`}>
                            {r.partnerType === 'PARCEIRO_EXTERNO' && 'Parceiro'}
                            {r.partnerType === 'CLIENTE' && 'Cliente'}
                            {r.partnerType === 'COLABORADOR' && 'Equipe'}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-[#696969]">{r.partnerContact}</span>
                        </div>
                      </td>

                      {/* Lead */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 dark:text-white block">{r.referredClientName}</span>
                        <span className="text-[10px] text-slate-500 dark:text-[#8E959E] block">
                          {r.contactName} &middot; {r.whatsapp}
                        </span>
                      </td>

                      {/* Nicho */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 dark:text-[#A0AEC0]">
                        {r.segment}
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatBRL(r.contractFee)}/mês
                      </td>

                      {/* Comissão */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-extrabold text-[#277e1b] dark:text-[#00FF66] block tabular-nums">
                          {formatBRL(r.commissionTotalBrl)}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-[#696969] block">
                          {r.commissionType === 'FIXO' ? 'Valor Fixo' : `${r.commissionValue}% da 1ª mensalidade`}
                        </span>
                      </td>

                      {/* Data (Horário - Data) */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-[#8E959E]">
                        {r.date}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <select
                          value={r.status}
                          onChange={(e) => onUpdateReferralStatus(r.id, e.target.value as ReferralStatus)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer focus:outline-hidden ${
                            r.status === 'COMISSAO_PAGA'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#277e1b] dark:text-[#00FF66] border-emerald-300 dark:border-emerald-800/50'
                              : r.status === 'CONTRATO_FECHADO'
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                              : r.status === 'EM_NEGOCIACAO'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
                              : 'bg-slate-100 dark:bg-[#1F2124] text-slate-600 dark:text-[#8E959E] border-slate-200 dark:border-[#2D3035]'
                          }`}
                        >
                          <option value="EM_NEGOCIACAO">Em Negociação</option>
                          <option value="CONTRATO_FECHADO">Contrato Fechado</option>
                          <option value="COMISSAO_PAGA">Comissão Paga</option>
                          <option value="PERDIDO">Perdido / Desistiu</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: LOGS DE AUDITORIA & SUPERVISÃO DA EQUIPE */}
      {/* ========================================================================= */}
      {subTab === 'AUDIT_LOGS' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros de Auditoria */}
          <div className="p-3.5 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Buscar por responsável, cliente ou descrição da alteração..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            {/* Filtro de Módulos */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#277e1b] dark:text-[#00FF66]" />
                Módulo:
              </span>
              {(['ALL', 'GESTOR', 'COMERCIAL', 'ONBOARDING', 'ACESSOS', 'INDICACOES'] as const).map((mod) => (
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
                  {mod === 'INDICACOES' && 'Indicações'}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline de Auditoria */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
              <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">
                Linha do Tempo de Ações do Time (Ordenado cronologicamente):
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#696969]">
                {filteredAuditLogs.length} eventos registrados
              </span>
            </div>

            <div className="space-y-3">
              {filteredAuditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 dark:text-[#696969] text-xs">
                  Nenhum log encontrado para os critérios de busca selecionados.
                </div>
              ) : (
                filteredAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] space-y-1.5 transition-all hover:border-slate-300 dark:hover:border-[#3A3E45]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {log.authorName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200/80 dark:bg-[#1F2124] text-slate-600 dark:text-[#A0AEC0] font-semibold">
                          {log.authorRole}
                        </span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          log.actionType === 'STATUS'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                            : log.actionType === 'CRIACAO'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-[#00FF66]'
                            : log.actionType === 'REUNIAO'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                            : 'bg-slate-200 text-slate-800 dark:bg-[#25282C] dark:text-[#A0AEC0]'
                        }`}>
                          {log.actionType}
                        </span>
                      </div>

                      {/* Horário - Data */}
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#8E959E]">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 dark:text-slate-200">
                      <strong className="text-slate-900 dark:text-white">[{log.entityName}]: </strong>
                      {log.description}
                    </div>

                    {log.details && (
                      <div className="text-[11px] text-slate-500 dark:text-[#8E959E] bg-white dark:bg-[#181A1D] p-2 rounded-lg border border-slate-200/70 dark:border-[#25282C]">
                        {log.details}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* MODAL: CADASTRAR NOVA INDICAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Registrar Nova Indicação</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#696969]">Cadastre quem recomendou o lead e as condições de comissão</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome do Indicador / Parceiro *</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Nome do parceiro..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Tipo de Indicador</label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="PARCEIRO_EXTERNO">Parceiro Externo / Agência</option>
                    <option value="CLIENTE">Cliente da Base</option>
                    <option value="COLABORADOR">Colaborador da Equipe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">WhatsApp do Parceiro</label>
                  <input
                    type="text"
                    value={partnerContact}
                    onChange={(e) => setPartnerContact(e.target.value)}
                    placeholder="DDD + WhatsApp..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome da Empresa Indicada *</label>
                  <input
                    type="text"
                    value={referredClientName}
                    onChange={(e) => setReferredClientName(e.target.value)}
                    placeholder="Nome da empresa indicada..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Decisor / Contato Indicado</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome do contato..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">WhatsApp do Lead Indicado *</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="DDD + WhatsApp do lead..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Fee Previsto (R$)</label>
                  <input
                    type="number"
                    value={contractFee}
                    onChange={(e) => setContractFee(e.target.value)}
                    placeholder="0,00"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Tipo de Comissão</label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="FIXO">Valor Fixo (R$)</option>
                    <option value="PERCENTUAL">Percentual (%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    {commissionType === 'FIXO' ? 'Valor (R$)' : 'Percentual (%)'}
                  </label>
                  <input
                    type="number"
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Observações do Acordo</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalhes ou condições da parceria..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all shadow-xs cursor-pointer"
                >
                  Salvar Indicação
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
