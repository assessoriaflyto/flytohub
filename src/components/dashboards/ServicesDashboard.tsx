import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Trash2,
  FileText,
  User,
  Filter,
  Edit2
} from 'lucide-react';
import { OneOffService } from '../../types/hub';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { NewServiceModal } from '../modals/NewServiceModal';
import { formatBRL } from '../../utils/formatters';

interface ServicesDashboardProps {
  services: OneOffService[];
  onAddServiceModalOpen: () => void;
  onSaveService: (serviceData: Omit<OneOffService, 'id' | 'createdAt'>, serviceId?: string) => void;
  onUpdateDeliveryStatus: (id: string, status: OneOffService['deliveryStatus']) => void;
  onUpdatePaymentStatus: (id: string, status: OneOffService['paymentStatus']) => void;
  onDeleteService: (id: string) => void;
}

export const ServicesDashboard: React.FC<ServicesDashboardProps> = ({
  services,
  onAddServiceModalOpen,
  onSaveService,
  onUpdateDeliveryStatus,
  onUpdatePaymentStatus,
  onDeleteService
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal de Edição
  const [editingService, setEditingService] = useState<OneOffService | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal de Exclusão Segura
  const [serviceToDelete, setServiceToDelete] = useState<OneOffService | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredServices = services.filter(s => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scope.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && s.deliveryStatus !== statusFilter) return false;
    return true;
  });

  const totalValue = services.reduce((acc, s) => acc + (s.price || 0), 0);
  const pendingCount = services.filter(s => s.deliveryStatus !== 'ENTREGUE').length;
  const completedCount = services.filter(s => s.deliveryStatus === 'ENTREGUE').length;

  const handleOpenEdit = (service: OneOffService) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (service: OneOffService) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  const getDeliveryStatusBadge = (st: OneOffService['deliveryStatus']) => {
    switch (st) {
      case 'BRIEFING':
        return { label: 'Briefing', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#121315]' };
      case 'DESENVOLVIMENTO':
        return { label: 'Em Desenvolvimento', color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' };
      case 'REVISAO':
        return { label: 'Em Revisão', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' };
      case 'ENTREGUE':
        return { label: 'Entregue', color: 'text-[#277e1b] dark:text-[#00FF66] bg-emerald-50 dark:bg-emerald-950/40' };
    }
  };

  const getPaymentStatusBadge = (st: OneOffService['paymentStatus']) => {
    switch (st) {
      case 'PAGO':
        return { label: 'Pago (100%)', color: 'text-[#277e1b] dark:text-[#00FF66]' };
      case 'ENTRADA_50':
        return { label: '50% Entrada', color: 'text-amber-600 dark:text-amber-400' };
      case 'PENDENTE':
        return { label: 'Pendente', color: 'text-rose-600 dark:text-rose-400' };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Header do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl shadow-xs beam-border-slow">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
            <span>Serviços Avulsos</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#8E959E] mt-0.5">
            Criação de sites, landing pages, apps, integrações e automações pontuais
          </p>
        </div>

        <button
          onClick={onAddServiceModalOpen}
          className="px-4 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* 2. Indicadores Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Volume de Projetos</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            {pendingCount} ativos
          </span>
          <span className="text-[11px] text-slate-500 dark:text-[#8E959E] block">{completedCount} entregues</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Faturamento em Projetos</span>
          <span className="text-2xl font-black text-[#277e1b] dark:text-[#00FF66] tabular-nums tracking-tight">
            {formatBRL(totalValue)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-[#8E959E] block">Contratos avulsos acumulados</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] block">Eficiência de Entrega</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            100% no prazo
          </span>
          <span className="text-[11px] text-slate-500 dark:text-[#8E959E] block">SLA de desenvolvimento ativo</span>
        </div>
      </div>

      {/* 3. Tabela de Serviços Avulsos */}
      <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl overflow-hidden shadow-xs">
        
        {/* Barra de Busca e Filtros */}
        <div className="p-3 border-b border-slate-100 dark:border-[#25282C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar serviço, cliente ou escopo..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'BRIEFING', 'DESENVOLVIMENTO', 'REVISAO', 'ENTREGUE'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'Todos' : st === 'DESENVOLVIMENTO' ? 'Desenvolvimento' : st === 'REVISAO' ? 'Revisão' : st === 'ENTREGUE' ? 'Entregue' : 'Briefing'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#121315] border-b border-slate-200 dark:border-[#25282C] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#8E959E] tracking-wider">
                <th className="py-3 px-4">Projeto / Serviço</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Valor Cobrado</th>
                <th className="py-3 px-3">Pagamento</th>
                <th className="py-3 px-3">Status de Entrega</th>
                <th className="py-3 px-3">Prazo</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#202226]">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-[#696969]">
                    Nenhum serviço avulso registrado com estes filtros.
                  </td>
                </tr>
              ) : (
                filteredServices.map((serv) => {
                  const deliveryInfo = getDeliveryStatusBadge(serv.deliveryStatus);
                  const paymentInfo = getPaymentStatusBadge(serv.paymentStatus);

                  return (
                    <tr key={serv.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1F2124] transition-colors">
                      
                      {/* Título & Escopo */}
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 dark:text-white font-bold block text-xs">
                          {serv.title}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-[#8E959E] block line-clamp-1 mt-0.5">
                          {serv.scope || serv.briefing}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 dark:text-white block">{serv.clientName}</span>
                        <span className="text-[10px] text-slate-400">{serv.clientContact || 'Sem telefone'}</span>
                      </td>

                      {/* Valor */}
                      <td className="py-3 px-3 whitespace-nowrap font-black text-slate-900 dark:text-white tabular-nums">
                        {formatBRL(serv.price)}
                      </td>

                      {/* Pagamento com Seletor */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={serv.paymentStatus}
                          onChange={(e) => onUpdatePaymentStatus(serv.id, e.target.value as any)}
                          className={`bg-transparent text-[11px] font-bold cursor-pointer focus:outline-hidden ${paymentInfo.color}`}
                        >
                          <option value="ENTRADA_50" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">50% Entrada</option>
                          <option value="PAGO" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">Pago (100%)</option>
                          <option value="PENDENTE" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">Pendente</option>
                        </select>
                      </td>

                      {/* Entrega com Seletor */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={serv.deliveryStatus}
                          onChange={(e) => onUpdateDeliveryStatus(serv.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-[#2D3035] cursor-pointer focus:outline-hidden ${deliveryInfo.color}`}
                        >
                          <option value="BRIEFING" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">Briefing</option>
                          <option value="DESENVOLVIMENTO" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">Em Desenvolvimento</option>
                          <option value="REVISAO" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">Revisão</option>
                          <option value="ENTREGUE" className="bg-white dark:bg-[#181A1D] text-slate-900 dark:text-white">Entregue</option>
                        </select>
                      </td>

                      {/* Prazo */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-[#A0AEC0] font-mono text-[11px]">
                        {serv.deliveryDate}
                      </td>

                      {/* Ações: Editar e Excluir */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(serv)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#121315] dark:hover:bg-[#1F2124] text-slate-600 dark:text-[#A0AEC0] transition-colors cursor-pointer"
                            title="Editar Serviço"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleOpenDelete(serv)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 transition-colors cursor-pointer"
                            title="Excluir Serviço com Segurança"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Modal de Edição de Serviço */}
      <NewServiceModal
        isOpen={isEditModalOpen}
        editingService={editingService}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingService(null);
        }}
        onSaveService={onSaveService}
      />

      {/* Modal de Exclusão Segura */}
      {serviceToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Excluir Serviço Avulso"
          itemName={serviceToDelete.clientName}
          itemTypeDescription="o projeto avulso do cliente"
          onClose={() => {
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

    </div>
  );
};
