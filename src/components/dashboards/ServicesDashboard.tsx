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
  Filter
} from 'lucide-react';
import { OneOffService } from '../../types/hub';

interface ServicesDashboardProps {
  services: OneOffService[];
  onAddServiceModalOpen: () => void;
  onUpdateDeliveryStatus: (id: string, status: OneOffService['deliveryStatus']) => void;
  onUpdatePaymentStatus: (id: string, status: OneOffService['paymentStatus']) => void;
  onDeleteService: (id: string) => void;
}

export const ServicesDashboard: React.FC<ServicesDashboardProps> = ({
  services,
  onAddServiceModalOpen,
  onUpdateDeliveryStatus,
  onUpdatePaymentStatus,
  onDeleteService
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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

  const getDeliveryStatusBadge = (st: OneOffService['deliveryStatus']) => {
    switch (st) {
      case 'BRIEFING':
        return { label: 'Briefing', color: 'text-zinc-600 dark:text-zinc-400' };
      case 'DESENVOLVIMENTO':
        return { label: 'Em Desenvolvimento', color: 'text-blue-600 dark:text-blue-400' };
      case 'REVISAO':
        return { label: 'Em Revisão', color: 'text-amber-600 dark:text-amber-400' };
      case 'ENTREGUE':
        return { label: 'Entregue', color: 'text-[#277e1b] dark:text-[#00FF66]' };
    }
  };

  const getPaymentStatusBadge = (st: OneOffService['paymentStatus']) => {
    switch (st) {
      case 'PAGO':
        return { label: 'Pago', color: 'text-[#277e1b] dark:text-[#00FF66]' };
      case 'ENTRADA_50':
        return { label: '50% Entrada', color: 'text-amber-600 dark:text-amber-400' };
      case 'PENDENTE':
        return { label: 'Pendente', color: 'text-rose-600 dark:text-rose-400' };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Header do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white dark:bg-[#0E1814] border border-black/8 dark:border-white/10 rounded-2xl shadow-sm executive-card beam-border-slow">
        <div>
          <h2 className="text-base font-black text-[#0F1715] dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
            <span>Serviços Avulsos</span>
          </h2>
          <p className="text-xs text-[#7A8E87] dark:text-[#768E85] mt-0.5">
            Criação de sites, landing pages, apps, integrações e automações pontuais
          </p>
        </div>

        <button
          onClick={onAddServiceModalOpen}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* 2. Indicadores Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1814] border border-black/8 dark:border-white/10 executive-card">
          <span className="text-[10px] uppercase font-bold text-[#7A8E87] dark:text-[#768E85] block">Volume de Projetos</span>
          <span className="text-2xl font-black text-[#0F1715] dark:text-white tabular-nums tracking-tight">
            {pendingCount} ativos
          </span>
          <span className="text-[11px] text-[#7A8E87] dark:text-[#586E66] block">{completedCount} entregues</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1814] border border-black/8 dark:border-white/10 executive-card">
          <span className="text-[10px] uppercase font-bold text-[#7A8E87] dark:text-[#768E85] block">Faturamento em Projetos</span>
          <span className="text-2xl font-black text-[#277e1b] dark:text-[#00FF66] tabular-nums tracking-tight">
            {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </span>
          <span className="text-[11px] text-[#7A8E87] dark:text-[#586E66] block">Contratos avulsos acumulados</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1814] border border-black/8 dark:border-white/10 executive-card">
          <span className="text-[10px] uppercase font-bold text-[#7A8E87] dark:text-[#768E85] block">Eficiência de Entrega</span>
          <span className="text-2xl font-black text-[#0F1715] dark:text-white tabular-nums tracking-tight">
            100% no prazo
          </span>
          <span className="text-[11px] text-[#7A8E87] dark:text-[#586E66] block">SLA de desenvolvimento ativo</span>
        </div>
      </div>

      {/* 3. Tabela de Serviços Avulsos */}
      <div className="bg-white dark:bg-[#0E1814] border border-black/8 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm executive-card">
        
        {/* Barra de Busca e Filtros */}
        <div className="p-3 border-b border-black/6 dark:border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#7A8E87] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar serviço, cliente ou escopo..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/6 dark:border-[#20382D] rounded-xl text-xs text-[#0F1715] dark:text-white focus:outline-none"
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
                    : 'text-[#7A8E87] dark:text-[#768E85] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {st === 'ALL' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF9] dark:bg-[#122019] border-b border-black/6 dark:border-white/6 text-[11px] font-extrabold uppercase text-[#7A8E87] dark:text-[#768E85] tracking-wider">
                <th className="py-3 px-4">Projeto / Serviço</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Valor Cobrado</th>
                <th className="py-3 px-3">Pagamento</th>
                <th className="py-3 px-3">Status de Entrega</th>
                <th className="py-3 px-3">Prazo</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7A8E87] dark:text-[#768E85]">
                    Nenhum serviço avulso registrado com estes filtros.
                  </td>
                </tr>
              ) : (
                filteredServices.map((serv) => {
                  const deliveryInfo = getDeliveryStatusBadge(serv.deliveryStatus);
                  const paymentInfo = getPaymentStatusBadge(serv.paymentStatus);

                  return (
                    <tr key={serv.id} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                      
                      {/* Título & Escopo */}
                      <td className="py-3 px-4">
                        <strong className="text-[#0F1715] dark:text-white font-bold block text-xs">
                          {serv.title}
                        </strong>
                        <span className="text-[11px] text-[#7A8E87] dark:text-[#586E66] block line-clamp-1 mt-0.5">
                          {serv.scope || serv.briefing}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-[#0F1715] dark:text-white block">{serv.clientName}</span>
                        <span className="text-[10px] text-[#7A8E87]">{serv.clientContact}</span>
                      </td>

                      {/* Valor */}
                      <td className="py-3 px-3 whitespace-nowrap font-bold text-[#0F1715] dark:text-white tabular-nums">
                        {serv.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                      </td>

                      {/* Pagamento com Seletor */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={serv.paymentStatus}
                          onChange={(e) => onUpdatePaymentStatus(serv.id, e.target.value as any)}
                          className={`bg-transparent text-[11px] font-bold cursor-pointer focus:outline-none ${paymentInfo.color}`}
                        >
                          <option value="ENTRADA_50" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">50% Entrada</option>
                          <option value="PAGO" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">Pago (100%)</option>
                          <option value="PENDENTE" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">Pendente</option>
                        </select>
                      </td>

                      {/* Entrega com Seletor */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={serv.deliveryStatus}
                          onChange={(e) => onUpdateDeliveryStatus(serv.id, e.target.value as any)}
                          className={`bg-transparent text-[11px] font-bold cursor-pointer focus:outline-none ${deliveryInfo.color}`}
                        >
                          <option value="BRIEFING" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">Briefing</option>
                          <option value="DESENVOLVIMENTO" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">Em Desenvolvimento</option>
                          <option value="REVISAO" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">Revisão</option>
                          <option value="ENTREGUE" className="bg-white dark:bg-[#0E1814] text-[#0F1715] dark:text-white">Entregue</option>
                        </select>
                      </td>

                      {/* Prazo */}
                      <td className="py-3 px-3 whitespace-nowrap text-[#7A8E87] dark:text-[#A6C4B9] font-mono text-[11px]">
                        {serv.deliveryDate}
                      </td>

                      {/* Ação */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteService(serv.id)}
                          className="p-1 rounded text-[#7A8E87] hover:text-rose-500 transition-colors"
                          title="Excluir serviço"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

    </div>
  );
};
