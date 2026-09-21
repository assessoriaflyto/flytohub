import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Share2, 
  X, 
  Award,
  Calendar,
  AlertCircle,
  ExternalLink,
  Phone
} from 'lucide-react';
import { ReferralDeal, ReferralStatus, UserAccount } from '../../types/hub';
import { formatBRL, formatDateBR } from '../../utils/formatters';

interface PartnersDashboardProps {
  referrals: ReferralDeal[];
  currentUser: UserAccount;
  onAddReferral: (deal: Omit<ReferralDeal, 'id'>) => void;
  onUpdateReferralStatus: (id: string, status: ReferralStatus) => void;
}

export const PartnersDashboard: React.FC<PartnersDashboardProps> = ({
  referrals,
  currentUser,
  onAddReferral,
  onUpdateReferralStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReferralStatus>('ALL');

  // Modal State
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

  // KPIs
  const totalReferrals = referrals.length;
  const closedReferrals = referrals.filter(r => r.status === 'CONTRATO_FECHADO' || r.status === 'COMISSAO_PAGA').length;
  const inNegotiation = referrals.filter(r => r.status === 'EM_NEGOCIACAO' || r.status === 'PENDENTE').length;
  const pendingCommissionsBrl = referrals
    .filter(r => r.status === 'CONTRATO_FECHADO')
    .reduce((acc, r) => acc + r.commissionTotalBrl, 0);
  const paidCommissionsBrl = referrals
    .filter(r => r.status === 'COMISSAO_PAGA')
    .reduce((acc, r) => acc + r.commissionTotalBrl, 0);

  // Filtragem
  const filteredReferrals = referrals.filter(item => {
    const matchText = 
      item.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referredClientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.segment.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchText) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    return true;
  });

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !referredClientName.trim() || !whatsapp.trim()) return;

    const feeNum = parseFloat(contractFee) || 0;
    const commValNum = parseFloat(commissionValue) || 0;
    const totalBrl = commissionType === 'FIXO' 
      ? commValNum 
      : Math.round((feeNum * commValNum) / 100);

    const now = new Date();
    const dateNow = now.toLocaleDateString('pt-BR');

    onAddReferral({
      partnerName: partnerName.trim(),
      partnerType,
      partnerContact: partnerContact.trim(),
      referredClientName: referredClientName.trim(),
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
      segment: segment.trim(),
      contractFee: feeNum,
      commissionType,
      commissionValue: commValNum,
      commissionTotalBrl: totalBrl,
      status: 'PENDENTE',
      date: dateNow,
      notes: notes.trim()
    });

    setIsModalOpen(false);
    setPartnerName('');
    setPartnerContact('');
    setReferredClientName('');
    setContactName('');
    setWhatsapp('');
    setNotes('');
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case 'PENDENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pendente
          </span>
        );
      case 'EM_NEGOCIACAO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" /> Em Negociação
          </span>
        );
      case 'CONTRATO_FECHADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Contrato Fechado (Comissão a Pagar)
          </span>
        );
      case 'COMISSAO_PAGA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Award className="w-3 h-3" /> Comissão Paga
          </span>
        );
      case 'PERDIDO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <X className="w-3 h-3" /> Perdido
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Parceiros & Indicações de Negócios
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Gestão estratégica de parcerias comerciais, co-marketing e bonificações por indicação.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Indicação
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Indicados</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalReferrals}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {inNegotiation} em fase de negociação ativa
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Contratos Fechados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {closedReferrals}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Taxa de conversão de {totalReferrals > 0 ? Math.round((closedReferrals / totalReferrals) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Comissões Pendentes</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatBRL(pendingCommissionsBrl)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Aguardando quitação ou repasse
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Comissões Pagas</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {formatBRL(paidCommissionsBrl)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total repassado aos parceiros Flyto
          </p>
        </div>
      </div>

      {/* Tabela de Indicações */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Controles de Busca e Filtro */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar parceiro ou cliente indicado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('EM_NEGOCIACAO')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'EM_NEGOCIACAO'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Em Negociação
            </button>
            <button
              onClick={() => setStatusFilter('CONTRATO_FECHADO')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'CONTRATO_FECHADO'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Fechados
            </button>
            <button
              onClick={() => setStatusFilter('COMISSAO_PAGA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'COMISSAO_PAGA'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Comissão Paga
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Parceiro Indicador</th>
                <th className="py-3 px-4">Cliente Indicado</th>
                <th className="py-3 px-4">Nicho</th>
                <th className="py-3 px-4">Valor Contrato</th>
                <th className="py-3 px-4">Comissão Devida</th>
                <th className="py-3 px-4">Status & Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Nenhuma indicação encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.partnerName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{item.partnerType.toLowerCase().replace('_', ' ')}</span>
                        {item.partnerContact && (
                          <>
                            <span>·</span>
                            <span>{item.partnerContact}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.referredClientName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{item.contactName}</span>
                        {item.whatsapp && (
                          <a
                            href={`https://wa.me/55${item.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 hover:underline flex items-center gap-0.5 font-medium"
                          >
                            <Phone className="w-3 h-3" />
                            {item.whatsapp}
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.segment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {formatBRL(item.contractFee)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatBRL(item.commissionTotalBrl)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.commissionType === 'PERCENTUAL' ? `${item.commissionValue}%` : 'Fixo'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}

                        {/* Seletor rápido de status */}
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateReferralStatus(item.id, e.target.value as ReferralStatus)}
                          className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="PENDENTE">Pendente</option>
                          <option value="EM_NEGOCIACAO">Em Negociação</option>
                          <option value="CONTRATO_FECHADO">Fechado (Pagar)</option>
                          <option value="COMISSAO_PAGA">Comissão Paga</option>
                          <option value="PERDIDO">Perdido</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Indicação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Cadastrar Nova Indicação
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Registre o parceiro, o cliente indicado e as condições de comissionamento
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Nome do Parceiro *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Ex: Agência Criativa / João Silva"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Tipo do Parceiro *
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PARCEIRO_EXTERNO">Parceiro Externo / Agência</option>
                    <option value="CLIENTE">Cliente Atual Flyto</option>
                    <option value="COLABORADOR">Colaborador / Equipe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Contato do Parceiro
                  </label>
                  <input
                    type="text"
                    value={partnerContact}
                    onChange={(e) => setPartnerContact(e.target.value)}
                    placeholder="Ex: (61) 98888-0000 / @parceiro"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Nome da Empresa Indicada *
                  </label>
                  <input
                    type="text"
                    required
                    value={referredClientName}
                    onChange={(e) => setReferredClientName(e.target.value)}
                    placeholder="Ex: Odonto Prime Brasília"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Contato / Decisor
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Dra. Juliana"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    WhatsApp Decisor *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: (61) 99999-1111"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Nicho / Segmento
                  </label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    placeholder="Ex: Saúde & Clínicas"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Fee Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={contractFee}
                    onChange={(e) => setContractFee(e.target.value)}
                    placeholder="3000"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Comissão
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={commissionType}
                      onChange={(e) => setCommissionType(e.target.value as any)}
                      className="px-2 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="FIXO">R$ Fixo</option>
                      <option value="PERCENTUAL">% Fee</option>
                    </select>
                    <input
                      type="number"
                      value={commissionValue}
                      onChange={(e) => setCommissionValue(e.target.value)}
                      placeholder="500"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Observações & Alinhamento
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Indicação do Dr. Ricardo, ligar citando o nome dele..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition shadow-lg shadow-emerald-500/25"
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
