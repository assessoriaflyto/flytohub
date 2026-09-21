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
  Phone,
  Edit2,
  Trash2
} from 'lucide-react';
import { ReferralDeal, ReferralStatus, UserAccount } from '../../types/hub';
import { formatBRL, formatDateBR } from '../../utils/formatters';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

interface PartnersDashboardProps {
  referrals: ReferralDeal[];
  currentUser: UserAccount;
  onAddReferral: (deal: Omit<ReferralDeal, 'id'>) => void;
  onUpdateReferral?: (id: string, updated: Partial<ReferralDeal>) => void;
  onUpdateReferralStatus: (id: string, status: ReferralStatus) => void;
  onDeleteReferral?: (id: string) => void;
}

export const PartnersDashboard: React.FC<PartnersDashboardProps> = ({
  referrals,
  currentUser,
  onAddReferral,
  onUpdateReferral,
  onUpdateReferralStatus,
  onDeleteReferral
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReferralStatus>('ALL');

  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<ReferralDeal | null>(null);
  
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

  // Modal de Exclusão Segura
  const [referralToDelete, setReferralToDelete] = useState<ReferralDeal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleOpenCreateModal = () => {
    setEditingReferral(null);
    setPartnerName('');
    setPartnerType('PARCEIRO_EXTERNO');
    setPartnerContact('');
    setReferredClientName('');
    setContactName('');
    setWhatsapp('');
    setSegment('E-commerce & Varejo');
    setContractFee('3000');
    setCommissionType('FIXO');
    setCommissionValue('500');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ReferralDeal) => {
    setEditingReferral(item);
    setPartnerName(item.partnerName);
    setPartnerType(item.partnerType);
    setPartnerContact(item.partnerContact || '');
    setReferredClientName(item.referredClientName);
    setContactName(item.contactName || '');
    setWhatsapp(item.whatsapp || '');
    setSegment(item.segment || 'E-commerce & Varejo');
    setContractFee(item.contractFee.toString());
    setCommissionType(item.commissionType);
    setCommissionValue(item.commissionValue.toString());
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item: ReferralDeal) => {
    setReferralToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (referralToDelete && onDeleteReferral) {
      onDeleteReferral(referralToDelete.id);
      setReferralToDelete(null);
    }
  };

  const handleSaveReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !referredClientName.trim()) return;

    const feeNum = parseFloat(contractFee.replace(',', '.')) || 0;
    const commValNum = parseFloat(commissionValue.replace(',', '.')) || 0;
    const totalBrl = commissionType === 'FIXO' 
      ? commValNum 
      : Math.round((feeNum * commValNum) / 100);

    const now = new Date();
    const dateNow = now.toLocaleDateString('pt-BR');

    if (editingReferral && onUpdateReferral) {
      onUpdateReferral(editingReferral.id, {
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
        notes: notes.trim()
      });
    } else {
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
    }

    setIsModalOpen(false);
    setEditingReferral(null);
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case 'PENDENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pendente
          </span>
        );
      case 'EM_NEGOCIACAO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" /> Em Negociação
          </span>
        );
      case 'CONTRATO_FECHADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Fechado (Pagar)
          </span>
        );
      case 'COMISSAO_PAGA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Award className="w-3 h-3" /> Comissão Paga
          </span>
        );
      case 'PERDIDO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <X className="w-3 h-3" /> Perdido
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#181A1D] p-5 rounded-3xl border border-slate-200 dark:border-[#2D3035] shadow-xs beam-border-slow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66] shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Parceiros & Indicações de Negócios
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-0.5">
              Gestão de parcerias, co-marketing, comissionamento e bonificações por indicação
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] hover:opacity-95 text-white dark:text-[#07130E] transition shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Indicação</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#181A1D] p-5 rounded-2xl border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Indicados</span>
            <Users className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalReferrals}
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-1">
            {inNegotiation} em negociação ativa
          </p>
        </div>

        <div className="bg-white dark:bg-[#181A1D] p-5 rounded-2xl border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Contratos Fechados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-[#277e1b] dark:text-[#00FF66]">
            {closedReferrals}
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-1">
            Taxa de conversão de {totalReferrals > 0 ? Math.round((closedReferrals / totalReferrals) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white dark:bg-[#181A1D] p-5 rounded-2xl border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Comissões a Pagar</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatBRL(pendingCommissionsBrl)}
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-1">
            Bonificações pendentes de repasse
          </p>
        </div>

        <div className="bg-white dark:bg-[#181A1D] p-5 rounded-2xl border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Já Pago</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {formatBRL(paidCommissionsBrl)}
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-1">
            Comissões pagas aos parceiros
          </p>
        </div>
      </div>

      {/* Tabela de Indicações */}
      <div className="bg-white dark:bg-[#181A1D] rounded-3xl border border-slate-200 dark:border-[#2D3035] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-[#25282C] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar parceiro, indicado ou nicho..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['ALL', 'PENDENTE', 'EM_NEGOCIACAO', 'CONTRATO_FECHADO', 'COMISSAO_PAGA', 'PERDIDO'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'Todos' : st === 'CONTRATO_FECHADO' ? 'Fechado' : st === 'COMISSAO_PAGA' ? 'Comissão Paga' : st === 'EM_NEGOCIACAO' ? 'Em Negociação' : st === 'PENDENTE' ? 'Pendente' : 'Perdido'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                <th className="py-3.5 px-4">Parceiro Indicador</th>
                <th className="py-3.5 px-4">Cliente Indicado</th>
                <th className="py-3.5 px-4">Nicho</th>
                <th className="py-3.5 px-4">Valor Contrato</th>
                <th className="py-3.5 px-4">Comissão Devida</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-[#696969]">
                    Nenhuma indicação registrada com estes filtros.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {item.partnerName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.partnerType === 'PARCEIRO_EXTERNO' ? 'Parceiro Externo' : item.partnerType === 'CLIENTE' ? 'Cliente Flyto' : 'Colaborador Interno'}
                        {item.partnerContact && ` &middot; ${item.partnerContact}`}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {item.referredClientName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{item.contactName}</span>
                        {item.whatsapp && (
                          <a
                            href={`https://wa.me/55${item.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#277e1b] dark:text-[#00FF66] hover:underline flex items-center gap-0.5 font-medium"
                          >
                            <Phone className="w-3 h-3" />
                            {item.whatsapp}
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#121315] text-slate-700 dark:text-slate-300">
                        {item.segment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-black text-slate-900 dark:text-white">
                      {formatBRL(item.contractFee)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-black text-[#277e1b] dark:text-[#00FF66]">
                        {formatBRL(item.commissionTotalBrl)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.commissionType === 'PERCENTUAL' ? `${item.commissionValue}%` : 'Fixo'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}

                        {/* Seletor rápido de status */}
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateReferralStatus(item.id, e.target.value as ReferralStatus)}
                          className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 dark:border-[#2D3035] bg-white dark:bg-[#121315] text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                        >
                          <option value="PENDENTE">Pendente</option>
                          <option value="EM_NEGOCIACAO">Em Negociação</option>
                          <option value="CONTRATO_FECHADO">Fechado (Pagar)</option>
                          <option value="COMISSAO_PAGA">Comissão Paga</option>
                          <option value="PERDIDO">Perdido</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#121315] dark:hover:bg-[#1F2124] text-slate-600 dark:text-[#A0AEC0] transition-colors cursor-pointer"
                          title="Editar Indicação"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        
                        {onDeleteReferral && (
                          <button
                            onClick={() => handleOpenDelete(item)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 transition-colors cursor-pointer"
                            title="Excluir Indicação com Segurança"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova / Editar Indicação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-[#181A1D] rounded-3xl border border-slate-200 dark:border-[#2D3035] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#25282C] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 text-[#277e1b] dark:text-[#00FF66] flex items-center justify-center font-bold">
                  {editingReferral ? <Edit2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingReferral ? 'Editar Indicação' : 'Cadastrar Nova Indicação'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8E959E]">
                    Registre o parceiro, o cliente indicado e as condições de comissionamento
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingReferral(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1F2124] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReferral} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Nome do Parceiro *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Ex: Agência Criativa / João Silva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Tipo do Parceiro *
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66] cursor-pointer"
                  >
                    <option value="PARCEIRO_EXTERNO">Parceiro Externo / Agência</option>
                    <option value="CLIENTE">Cliente Atual Flyto</option>
                    <option value="COLABORADOR">Colaborador / Equipe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Contato do Parceiro
                  </label>
                  <input
                    type="text"
                    value={partnerContact}
                    onChange={(e) => setPartnerContact(e.target.value)}
                    placeholder="Ex: (61) 98888-0000 / @parceiro"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Nome da Empresa Indicada *
                  </label>
                  <input
                    type="text"
                    required
                    value={referredClientName}
                    onChange={(e) => setReferredClientName(e.target.value)}
                    placeholder="Ex: Odonto Prime Brasília"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Pessoa de Contato
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Dra. Vanessa Lins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    WhatsApp da Empresa *
                  </label>
                  <input
                    type="text"
                    inputMode="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9()+-\s]/g, ''))}
                    placeholder="(61) 99123-4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Nicho / Segmento
                  </label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    placeholder="Ex: Clínica Odontológica"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Fee Previsto (R$)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={contractFee}
                    onChange={(e) => setContractFee(e.target.value.replace(/[^0-9.,]/g, ''))}
                    placeholder="3500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                    Tipo de Comissão
                  </label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66] cursor-pointer"
                  >
                    <option value="FIXO">Valor Fixo (R$)</option>
                    <option value="PERCENTUAL">Percentual (%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                  Valor / Percentual da Comissão ({commissionType === 'FIXO' ? 'R$' : '%'})
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(e.target.value.replace(/[^0-9.,]/g, ''))}
                  placeholder={commissionType === 'FIXO' ? 'Ex: 500' : 'Ex: 15'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
                  Observações / Pauta
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contexto da indicação, necessidades do cliente..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2D3035] bg-slate-50 dark:bg-[#121315] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#277e1b] dark:focus:border-[#00FF66] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReferral(null);
                  }}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition cursor-pointer shadow-xs"
                >
                  {editingReferral ? 'Salvar Alterações' : 'Cadastrar Indicação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão Segura */}
      {referralToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Excluir Indicação de Parceiro"
          itemName={referralToDelete.referredClientName}
          itemTypeDescription="a indicação do cliente"
          onClose={() => {
            setIsDeleteModalOpen(false);
            setReferralToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

    </div>
  );
};
