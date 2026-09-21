import React, { useState, useEffect } from 'react';
import { Layers, X, Check, Edit2 } from 'lucide-react';
import { OneOffService } from '../../types/hub';

interface NewServiceModalProps {
  isOpen: boolean;
  editingService?: OneOffService | null;
  onClose: () => void;
  onSaveService: (serviceData: Omit<OneOffService, 'id' | 'createdAt'>, serviceId?: string) => void;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({ 
  isOpen, 
  editingService,
  onClose, 
  onSaveService 
}) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [scope, setScope] = useState('');
  const [briefing, setBriefing] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [price, setPrice] = useState('2500');
  const [paymentStatus, setPaymentStatus] = useState<'PAGO' | 'PENDENTE' | 'ENTRADA_50'>('ENTRADA_50');
  const [deliveryStatus, setDeliveryStatus] = useState<'BRIEFING' | 'DESENVOLVIMENTO' | 'REVISAO' | 'ENTREGUE'>('BRIEFING');

  useEffect(() => {
    if (editingService) {
      setTitle(editingService.title);
      setClientName(editingService.clientName);
      setClientContact(editingService.clientContact || '');
      setScope(editingService.scope || '');
      setBriefing(editingService.briefing || '');
      setDeliveryDate(editingService.deliveryDate || '');
      setPrice(editingService.price.toString());
      setPaymentStatus(editingService.paymentStatus);
      setDeliveryStatus(editingService.deliveryStatus);
    } else {
      setTitle('');
      setClientName('');
      setClientContact('');
      setScope('');
      setBriefing('');
      setDeliveryDate('');
      setPrice('2500');
      setPaymentStatus('ENTRADA_50');
      setDeliveryStatus('BRIEFING');
    }
  }, [editingService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    onSaveService(
      {
        title: title.trim(),
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        scope: scope.trim(),
        briefing: briefing.trim(),
        deliveryDate: deliveryDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: parseFloat(price.replace(',', '.')) || 0,
        paymentStatus,
        deliveryStatus
      },
      editingService ? editingService.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              {editingService ? <Edit2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingService ? 'Editar Serviço Avulso' : 'Cadastrar Serviço Avulso'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#8E959E]">Demandas pontuais, sites, apps e integrações</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
              Nome do Serviço / Projeto *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Criação de Landing Page + CAPI ou Automação de Leads"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Nome do Cliente *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Dra. Camila Siqueira"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Contato / WhatsApp
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="(61) 99999-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Valor Cobrado (R$) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.,]/g, ''))}
                placeholder="Ex: 3000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden font-mono"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Status do Pagamento
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="ENTRADA_50">50% Entrada</option>
                <option value="PAGO">100% Pago</option>
                <option value="PENDENTE">Pendente</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
              Escopo / Solicitação
            </label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Ex: Desenvolvimento completo em Next.js com CAPI e Webhook"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
              Briefing / Informações do Cliente
            </label>
            <textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              rows={3}
              placeholder="Requisitos técnicos, referências de design, senhas de hospedagem..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#25282C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingService ? 'Salvar Alterações' : 'Cadastrar Projeto'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
