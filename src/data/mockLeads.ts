// ============================================================================
// FLYTOHUB — PIPELINE DE LEADS COMERCIAIS DA ASSESSORIA FLYTO
// ============================================================================
import { CommercialLead } from '../types/hub';

export const INITIAL_LEADS: CommercialLead[] = [
  {
    id: 'lead_1',
    companyName: 'Nexus Odontologia Integrada',
    contactName: 'Dr. Roberto Meirelles',
    whatsapp: '(61) 99842-1020',
    email: 'diretoria@nexusodonto.com.br',
    segment: 'Clínica Odontológica & Implantes High-Ticket',
    estimatedBudget: 8000,
    proposedFee: 2500,
    source: 'TRAFEGO_PAGO',
    status: 'REUNIAO_AGENDADA',
    meetingDate: '2026-09-22 15:00',
    notes: 'Busca captação de pacientes para protocolo de lentes em resina e implantes guiados. Insatisfeito com agência anterior por falta de relatórios.',
    createdAt: '2026-09-18'
  },
  {
    id: 'lead_2',
    companyName: 'Aura Joalheria Contemporânea',
    contactName: 'Mariana Vasconcellos',
    whatsapp: '(61) 98115-9944',
    email: 'mariana@aurajoias.com.br',
    segment: 'E-commerce & Varejo Premium de Joias',
    estimatedBudget: 15000,
    proposedFee: 3500,
    source: 'INSTAGRAM',
    status: 'PROPOSTA_ENVIADA',
    notes: 'Proposta enviada com plano Growth (Tráfego Meta Ads + Produção de Criativos em vídeo). Aguardando alinhamento com sócio.',
    createdAt: '2026-09-15'
  },
  {
    id: 'lead_3',
    companyName: 'Habitar Incorporações & Empreendimentos',
    contactName: 'Eduardo Guimarães',
    whatsapp: '(61) 99230-7711',
    email: 'eduardo@habitarinc.com.br',
    segment: 'Imobiliário & Lançamentos Residenciais',
    estimatedBudget: 25000,
    proposedFee: 4500,
    source: 'INDICACAO',
    status: 'QUALIFICADO',
    notes: 'Indicação do cliente Vértice Engenharia. Novo condomínio fechado com 42 lotes de alto padrão no Lago Sul.',
    createdAt: '2026-09-19'
  },
  {
    id: 'lead_4',
    companyName: 'Solux Energia Solar & Eficiência',
    contactName: 'Carlos Henrique',
    whatsapp: '(61) 98450-3300',
    email: 'contato@soluxsolar.com.br',
    segment: 'B2B & Engenharia Sustentável',
    estimatedBudget: 6000,
    proposedFee: 2000,
    source: 'OUTBOUND',
    status: 'NOVO',
    notes: 'Abordagem via LinkedIn. Confirmou interesse em estruturar funil de captação de fazendas solares e empresas de médio porte.',
    createdAt: '2026-09-20'
  },
  {
    id: 'lead_5',
    companyName: 'L’Essence Estética Avançada',
    contactName: 'Dra. Beatriz Fontana',
    whatsapp: '(61) 99188-4422',
    email: 'beatriz@lessenceclinica.com.br',
    segment: 'Clínica Médica & Harmonização',
    estimatedBudget: 10000,
    proposedFee: 2800,
    source: 'SITE',
    status: 'FECHADO',
    notes: 'Contrato assinado plano Growth. Pronto para avançar para onboarding no sistema!',
    createdAt: '2026-09-12'
  }
];
