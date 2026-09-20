import React, { useState } from 'react';
import { X, Building2, FolderOpen } from 'lucide-react';
import { ClientData, PlanType, PaymentMethod } from '../../types/hub';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (newClient: ClientData) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onAddClient }) => {
  const [tradeName, setTradeName] = useState('');
  const [name, setName] = useState('');
  const [segment, setSegment] = useState('E-commerce & Varejo Premium');
  const [city, setCity] = useState('Brasília');
  const [state, setState] = useState('DF');
  const [owners, setOwners] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [plan, setPlan] = useState<PlanType>('GROWTH');
  const [monthlyFee, setMonthlyFee] = useState<number>(2500);
  const [adSpendMonthly, setAdSpendMonthly] = useState<number>(10000);
  const [targetRoas, setTargetRoas] = useState<number>(4.5);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  if (!isOpen) return null;

  const handlePlanChange = (selected: PlanType) => {
    setPlan(selected);
    if (selected === 'STARTER') setMonthlyFee(1500);
    if (selected === 'ESSENTIAL') setMonthlyFee(1800);
    if (selected === 'GROWTH') setMonthlyFee(2500);
    if (selected === 'ENTERPRISE') setMonthlyFee(4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeName.trim() || !phone.trim()) return;

    const clientId = `cli_${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const contractEndStr = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newClient: ClientData = {
      id: clientId,
      name: name || tradeName,
      tradeName,
      segment,
      city,
      state,
      owners: owners || 'Sócio Proprietário',
      phone,
      email: email || undefined,
      instagramHandle: instagramHandle.startsWith('@') ? instagramHandle : (instagramHandle ? `@${instagramHandle}` : undefined),
      driveFolderUrl: driveFolderUrl || 'https://drive.google.com/drive/folders/Flyto-NovaPasta',

      plan,
      monthlyFee,
      billingCycle: 'MENSAL',
      paymentMethod,
      contractStartDate: todayStr,
      contractEndDate: contractEndStr,

      budgetMonthly: adSpendMonthly,
      monthlyAdSpend: 0,
      revenueGenerated: 0,
      currentRoas: 0.0,
      targetRoas,

      metaBalance: {
        status: 'VERIFICAR',
        lastRechargeAmount: 0,
        lastRechargeDate: todayStr,
        lastVerifiedDate: todayStr
      },

      routine: {
        weeklyReportSent: false,
        weeklyOptimizationDone: false,
        videoBriefingDone: false,
        videoEditedDone: false,
        creativeUploadedDone: false,
        lastResetDate: todayStr
      },

      optimizationLogs: [
        {
          id: `log_init_${Date.now()}`,
          date: todayStr,
          time: '12:00',
          author: 'Flyto Setup',
          note: 'Cliente recém-cadastrado no sistema. Aguardando finalização do setup de Onboarding.',
          type: 'OTIMIZACAO'
        }
      ],
      lastOptimizationNote: 'Cliente recém-cadastrado no sistema. Aguardando finalização do setup de Onboarding.',

      ctrAverage: 2.0,
      cpcAverage: 2.5,
      cpmAverage: 30.0,
      frequencyAverage: 1.0,
      funnelConversionRate: 5.0,
      activeCreativesCount: 0,

      status: 'ONBOARDING',
      relationshipHealth: 'EXCELENTE',
      ltvTotal: monthlyFee,

      kickoffDate: todayStr,
      onboardingSteps: [
        { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: todayStr },
        { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: false },
        { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: false },
        { id: 'step_4', label: 'Briefing Estratégico & ICP Respondido', done: false },
        { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: Boolean(driveFolderUrl), completedAt: driveFolderUrl ? todayStr : undefined },
        { id: 'step_6', label: 'Reunião de Kick-off & Definição de Metas', done: false },
        { id: 'step_7', label: 'Subida da Primeira Campanha de Escala', done: false }
      ],

      accessVault: {
        id: `vault_${clientId}`,
        clientId,
        driveFolderUrl: driveFolderUrl || 'https://drive.google.com/drive/folders/Flyto-NovaPasta',
        extraSites: [],
        lastUpdated: todayStr
      }
    };

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0C1512] border border-[#1F382D] rounded-2xl p-6 space-y-4 shadow-2xl neon-card beam-top-line max-h-[90vh] overflow-y-auto">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2E25]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#142B21] flex items-center justify-center text-[#00FF66]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Cadastrar Novo Cliente na Assessoria</h3>
              <p className="text-[11px] text-[#768E85]">Implantação de nova conta com checklist automático de onboarding</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#768E85] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Nome Fantasia / Marca *</label>
              <input
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="Ex: Aurora Clínica de Pele"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Razão Social</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Aurora Estética Médica Ltda"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Sócio / Responsável</label>
              <input
                type="text"
                value={owners}
                onChange={(e) => setOwners(e.target.value)}
                placeholder="Ex: Dr. Roberto Siqueira"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Nicho / Segmento *</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none cursor-pointer"
              >
                <option value="Clínica Médica & Saúde">Clínica Médica & Saúde</option>
                <option value="E-commerce & Varejo Premium">E-commerce & Varejo Premium</option>
                <option value="SaaS B2B & Tecnologia">SaaS B2B & Tecnologia</option>
                <option value="Imobiliário & Lançamentos">Imobiliário & Lançamentos</option>
                <option value="Infoproduto & Educação">Infoproduto & Educação</option>
                <option value="Serviços High-Ticket">Serviços High-Ticket</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">WhatsApp de Alinhamento *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(61) 99999-0000"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@aurora.com.br"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${city} - ${state}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  setCity(parts[0]?.trim() || 'Brasília');
                  if (parts[1]) setState(parts[1].trim());
                }}
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Instagram (@)</label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@auroraclinica"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>
          </div>

          {/* Link do Google Drive */}
          <div>
            <label className="font-bold text-[#00FF66] block mb-1 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Link da Pasta no Google Drive (Criativos & Documentos)</span>
            </label>
            <input
              type="url"
              value={driveFolderUrl}
              onChange={(e) => setDriveFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full p-2.5 bg-[#122019] border border-[#234435] focus:border-[#00FF66] rounded-lg text-white font-mono text-[11px] focus:outline-none"
            />
          </div>

          {/* Planos da Assessoria */}
          <div>
            <label className="font-bold text-[#A6C4B9] block mb-1.5">Plano Contratado Flyto</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'STARTER' as const, name: 'Starter', fee: 1500 },
                { id: 'ESSENTIAL' as const, name: 'Essential', fee: 1800 },
                { id: 'GROWTH' as const, name: 'Growth', fee: 2500 },
                { id: 'ENTERPRISE' as const, name: 'Enterprise', fee: 4000 }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePlanChange(p.id)}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    plan === p.id
                      ? 'bg-[#142B21] border-[#00FF66] text-[#00FF66] shadow-neon-green-sm'
                      : 'bg-[#101D18] border-[#1A2E25] text-[#768E85] hover:text-white'
                  }`}
                >
                  <span className="font-extrabold text-xs block">{p.name}</span>
                  <span className="text-[10px] tabular-nums block">R$ {p.fee}/mês</span>
                </button>
              ))}
            </div>
          </div>

          {/* Investimento em Mídia & Metas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Investimento Mensal (R$)</label>
              <input
                type="number"
                value={adSpendMonthly}
                onChange={(e) => setAdSpendMonthly(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Meta de ROAS</label>
              <input
                type="number"
                step="0.1"
                value={targetRoas}
                onChange={(e) => setTargetRoas(parseFloat(e.target.value) || 0)}
                placeholder="Ex: 4.5"
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#A6C4B9] block mb-1">Forma de Pagamento</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-2.5 bg-[#122019] border border-[#20382D] rounded-lg text-white focus:border-[#00FF66] focus:outline-none cursor-pointer"
              >
                <option value="PIX">PIX à Vista</option>
                <option value="BOLETO">Boleto Bancário</option>
                <option value="CARTAO">Cartão de Crédito</option>
                <option value="TRANSFERENCIA">Transferência TED</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1A2E25]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#768E85] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-extrabold bg-[#00FF66] text-[#07130E] hover:bg-[#1be06a] shadow-neon-green-sm transition-all cursor-pointer"
            >
              Criar e Iniciar Onboarding
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
