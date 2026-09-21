import React, { useState } from 'react';
import { Briefcase, X, PlusCircle } from 'lucide-react';
import { CommercialLead, LeadSource } from '../../types/hub';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: CommercialLead) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [segmentSelect, setSegmentSelect] = useState('E-commerce & Varejo');
  const [customSegment, setCustomSegment] = useState('');
  const [isCreatingCustomSegment, setIsCreatingCustomSegment] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState('10000');
  const [proposedFee, setProposedFee] = useState('2500');
  const [source, setSource] = useState<LeadSource>('TRAFEGO_PAGO');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__NEW_SEGMENT__') {
      setIsCreatingCustomSegment(true);
      setCustomSegment('');
    } else {
      setIsCreatingCustomSegment(false);
      setSegmentSelect(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !whatsapp.trim()) return;

    const finalSegment = isCreatingCustomSegment 
      ? (customSegment.trim() || 'Geral / Outros')
      : segmentSelect;

    const newLead: CommercialLead = {
      id: `lead_${Date.now()}`,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      segment: finalSegment,
      estimatedBudget: parseFloat(estimatedBudget) || 0,
      proposedFee: parseFloat(proposedFee) || 0,
      source,
      status: 'NOVO',
      notes: notes.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddLead(newLead);
    // Reset
    setCompanyName('');
    setContactName('');
    setWhatsapp('');
    setEmail('');
    setNotes('');
    setIsCreatingCustomSegment(false);
    setCustomSegment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl beam-border-slow">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#1F2124] border border-emerald-200 dark:border-[#2D3035] flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Cadastrar Nova Oportunidade (Lead)</h3>
              <p className="text-[11px] text-slate-500 dark:text-[#696969]">Adicione uma empresa em negociação ao pipeline comercial da assessoria</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:text-[#696969] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome da Empresa / Projeto *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nome da empresa..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Nome do Decisor / Contato *</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nome do responsável..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">WhatsApp Comercial *</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="DDD + Número..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@dominio.com.br"
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Campo de Nicho com opção dinâmica "Criar Nicho" */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0]">Nicho / Segmento *</label>
              {!isCreatingCustomSegment ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingCustomSegment(true);
                    setCustomSegment('');
                  }}
                  className="text-[11px] font-bold text-[#277e1b] dark:text-[#00FF66] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Criar nicho</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomSegment(false)}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Selecionar da lista
                </button>
              )}
            </div>

            {isCreatingCustomSegment ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSegment}
                  onChange={(e) => setCustomSegment(e.target.value)}
                  placeholder="Digite o nome do novo nicho..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-emerald-400 dark:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  autoFocus
                  required
                />
              </div>
            ) : (
              <select
                value={segmentSelect}
                onChange={handleSegmentChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden cursor-pointer"
              >
                <option value="Clínica Médica & Saúde">Clínica Médica & Saúde</option>
                <option value="E-commerce & Varejo">E-commerce & Varejo</option>
                <option value="SaaS B2B & Tecnologia">SaaS B2B & Tecnologia</option>
                <option value="Imobiliário & Construção">Imobiliário & Construção</option>
                <option value="Infoproduto & Educação">Infoproduto & Educação</option>
                <option value="Serviços High-Ticket">Serviços High-Ticket</option>
                <option value="__NEW_SEGMENT__">+ Criar novo nicho...</option>
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Origem do Lead</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden cursor-pointer"
              >
                <option value="TRAFEGO_PAGO">Tráfego Pago (Meta/Google)</option>
                <option value="INDICACAO">Indicação de Parceiro</option>
                <option value="INSTAGRAM">Instagram Orgânico</option>
                <option value="OUTBOUND">Outbound / Prospecção</option>
                <option value="SITE">Site Oficial Flyto</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Budget Anúncios (R$)</label>
              <input
                type="number"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                placeholder="0,00"
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Fee Mensal Proposto (R$)</label>
              <input
                type="number"
                value={proposedFee}
                onChange={(e) => setProposedFee(e.target.value)}
                placeholder="0,00"
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Notas da Reunião / Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva detalhes ou requisitos do lead..."
              className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden resize-none"
            />
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all shadow-xs cursor-pointer"
            >
              Salvar Oportunidade
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
