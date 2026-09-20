import React, { useState } from 'react';
import { Layers, X, Check } from 'lucide-react';
import { OneOffService } from '../../types/hub';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (service: OneOffService) => void;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({ isOpen, onClose, onAddService }) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [scope, setScope] = useState('');
  const [briefing, setBriefing] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [price, setPrice] = useState('2500');
  const [paymentStatus, setPaymentStatus] = useState<'PAGO' | 'PENDENTE' | 'ENTRADA_50'>('ENTRADA_50');
  const [deliveryStatus, setDeliveryStatus] = useState<'BRIEFING' | 'DESENVOLVIMENTO' | 'REVISAO' | 'ENTREGUE'>('BRIEFING');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const newService: OneOffService = {
      id: `serv_${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      scope: scope.trim(),
      briefing: briefing.trim(),
      deliveryDate: deliveryDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: parseFloat(price) || 0,
      paymentStatus,
      deliveryStatus,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddService(newService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-[#0E1814] border border-black/8 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl executive-card beam-border-slow max-h-[90vh] overflow-y-auto">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-black/6 dark:border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#277e1b]/10 dark:bg-[#00FF66]/10 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F1715] dark:text-white">Cadastrar Serviço Avulso</h3>
              <p className="text-[11px] text-[#7A8E87] dark:text-[#768E85]">Demandas pontuais sem mensalidade de tráfego</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7A8E87] hover:text-[#0F1715] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
              Nome do Serviço / Projeto *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Criação de Landing Page + CAPI ou Automação de Leads"
              className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
                Nome do Cliente *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Dra. Camila Siqueira"
                className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
                Contato / WhatsApp
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="(61) 99999-0000"
                className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
                Valor Cobrado (R$) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 3000"
                className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
                Status do Pagamento
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="ENTRADA_50">50% Entrada</option>
                <option value="PAGO">100% Pago</option>
                <option value="PENDENTE">Pendente</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
              Escopo / Solicitação
            </label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Ex: Desenvolvimento completo em Next.js com CAPI e Webhook"
              className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#4A5A54] dark:text-[#A6C4B9] block mb-1">
              Briefing / Informações do Cliente
            </label>
            <textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              rows={3}
              placeholder="Requisitos técnicos, referências de design, senhas de hospedagem..."
              className="w-full p-2.5 bg-[#F6F8F7] dark:bg-[#122019] border border-black/8 dark:border-[#20382D] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-[#0F1715] dark:text-white focus:outline-none resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/6 dark:border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A8E87] hover:text-[#0F1715] dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cadastrar Projeto</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
