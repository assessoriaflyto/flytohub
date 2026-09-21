import React, { useState } from 'react';
import { Briefcase, X, PlusCircle, Globe, MapPin } from 'lucide-react';
import { CommercialLead, LeadSource } from '../../types/hub';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<CommercialLead, 'id' | 'createdAt'>) => void;
}

const DEFAULT_SEGMENTS = [
  'E-commerce & Varejo',
  'Clínica Médica & Saúde',
  'Imobiliário & Construtora',
  'Educação & Infoprodutos',
  'SaaS B2B & Software',
  'Assessoria Jurídica & Tributária',
  'Estética & Odontologia',
  'Serviços High-Ticket',
  'Outros Segmentos'
];

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [segmentSelect, setSegmentSelect] = useState('E-commerce & Varejo');
  const [customSegment, setCustomSegment] = useState('');
  const [isCreatingCustomSegment, setIsCreatingCustomSegment] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('DF');
  const [address, setAddress] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('10000');
  const [proposedFee, setProposedFee] = useState('2500');
  const [source, setSource] = useState<LeadSource>('TRAFEGO_PAGO');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !whatsapp.trim()) return;

    const finalSegment = isCreatingCustomSegment 
      ? (customSegment.trim() || 'Geral / Outros')
      : segmentSelect;

    const budgetNum = parseFloat(estimatedBudget.replace(',', '.')) || 0;
    const feeNum = parseFloat(proposedFee.replace(',', '.')) || 0;

    let formattedWebsite = websiteUrl.trim();
    if (formattedWebsite && !formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
      formattedWebsite = `https://${formattedWebsite}`;
    }

    onAddLead({
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      segment: finalSegment,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      address: address.trim() || undefined,
      websiteUrl: formattedWebsite || undefined,
      estimatedBudget: budgetNum,
      proposedFee: feeNum,
      source,
      status: 'NOVO',
      notes: notes.trim()
    });

    // Reset
    setCompanyName('');
    setContactName('');
    setWhatsapp('');
    setEmail('');
    setCity('');
    setState('DF');
    setAddress('');
    setWebsiteUrl('');
    setNotes('');
    setIsCreatingCustomSegment(false);
    setCustomSegment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66] shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Cadastrar Nova Oportunidade (Lead)</h3>
              <p className="text-[11px] text-slate-500 dark:text-[#8E959E]">Pipeline comercial, dados de contato e portfólio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
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
                placeholder="Ex: Prime Odontologia"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Decisor / Contato Principal *</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Dra. Juliana Ferreira"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">WhatsApp Comercial *</label>
              <input
                type="text"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9()+-\s]/g, ''))}
                placeholder="(61) 99999-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden font-mono"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com.br"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Localização & Link Clicável */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Brasília"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Estado (UF)</label>
              <input
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="DF"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Site Oficial / Instagram</label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://exemplo.com.br"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Endereço Comercial</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Setor Comercial Sul, Quadra 04, Bloco A"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden"
            />
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
                  <span>Criar novo nicho</span>
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
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={customSegment}
                  onChange={(e) => setCustomSegment(e.target.value)}
                  placeholder="Digite o nome do novo nicho (ex: Infoprodutos)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-[#277e1b] dark:border-[#00FF66] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden ring-2 ring-emerald-500/20"
                />
              </div>
            ) : (
              <select
                value={segmentSelect}
                onChange={(e) => {
                  if (e.target.value === '__NEW_SEGMENT__') {
                    setIsCreatingCustomSegment(true);
                    setCustomSegment('');
                  } else {
                    setSegmentSelect(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                {DEFAULT_SEGMENTS.map((seg) => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
                <option value="__NEW_SEGMENT__">Criar novo nicho...</option>
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Budget Mensal Mídia (R$)</label>
              <input
                type="text"
                inputMode="decimal"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value.replace(/[^0-9.,]/g, ''))}
                placeholder="Ex: 10000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Fee Proposto (R$/mês)</label>
              <input
                type="text"
                inputMode="decimal"
                value={proposedFee}
                onChange={(e) => setProposedFee(e.target.value.replace(/[^0-9.,]/g, ''))}
                placeholder="Ex: 2500"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Origem do Lead</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden cursor-pointer"
              >
                <option value="TRAFEGO_PAGO">Tráfego Pago (Anúncios)</option>
                <option value="INDICACAO">Indicação de Parceiro</option>
                <option value="INSTAGRAM">Instagram Orgânico</option>
                <option value="OUTBOUND">Prospecção Ativa (Outbound)</option>
                <option value="EVENTO">Evento / Networking</option>
                <option value="SITE">Site Flyto Oficial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Observações da Negociação</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dores do cliente, metas de faturamento, data sugerida de reunião..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:border-[#277e1b] dark:focus:border-[#00FF66] focus:outline-hidden resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#25282C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] hover:opacity-95 text-white dark:text-[#07130E] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Cadastrar Oportunidade
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
