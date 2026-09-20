import { ReferralDeal, AuditLogEntry } from '../types/hub';

export const initialReferralDeals: ReferralDeal[] = [
  {
    id: 'ref_1',
    partnerName: 'Henrique Barreto',
    partnerType: 'PARCEIRO_EXTERNO',
    partnerContact: '(61) 98112-4020',
    referredClientName: 'Clínica OdontoVip',
    contactName: 'Dra. Vanessa Lins',
    whatsapp: '(61) 99123-4567',
    segment: 'Clínica Médica & Saúde',
    contractFee: 3500,
    commissionType: 'FIXO',
    commissionValue: 500,
    commissionTotalBrl: 500,
    status: 'CONTRATO_FECHADO',
    date: '14:20 - 18/09/2026',
    notes: 'Parceria de indicação com agência de branding parceira. Comissão a pagar após compensação da 1ª mensalidade.'
  },
  {
    id: 'ref_2',
    partnerName: 'TechCorp Brasil (Rodrigo)',
    partnerType: 'CLIENTE',
    partnerContact: '(11) 98765-4321',
    referredClientName: 'Synapse CRM Software',
    contactName: 'Lucas Ferraz',
    whatsapp: '(11) 97654-3210',
    segment: 'SaaS B2B & Tecnologia',
    contractFee: 4000,
    commissionType: 'PERCENTUAL',
    commissionValue: 15,
    commissionTotalBrl: 600,
    status: 'EM_NEGOCIACAO',
    date: '10:00 - 19/09/2026',
    notes: 'Indicação direta de cliente satisfeito. Reunião de apresentação realizada, aguardando aprovação de proposta.'
  },
  {
    id: 'ref_3',
    partnerName: 'Matheus Gestor',
    partnerType: 'COLABORADOR',
    partnerContact: '(61) 98223-1122',
    referredClientName: 'Emporium Joalheria',
    contactName: 'Carla Nogueira',
    whatsapp: '(61) 99887-7665',
    segment: 'E-commerce & Varejo Premium',
    contractFee: 3000,
    commissionType: 'FIXO',
    commissionValue: 400,
    commissionTotalBrl: 400,
    status: 'COMISSAO_PAGA',
    date: '16:45 - 10/09/2026',
    notes: 'Bonificação interna de indicação paga via PIX no fechamento do contrato.'
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit_1',
    timestamp: '18:15 - 20/09/2026',
    rawDate: '2026-09-20',
    authorName: 'Lucas Mendonça',
    authorRole: 'Gestor de Performance',
    module: 'GESTOR',
    actionType: 'STATUS',
    entityName: 'Lumina Decor Interiores',
    description: 'Atualizou o Saldo Meta para PAGO após conferência de comprovante no WhatsApp.',
    details: 'Recarga no valor de R$ 10.000 confirmada.'
  },
  {
    id: 'audit_2',
    timestamp: '15:00 - 20/09/2026',
    rawDate: '2026-09-20',
    authorName: 'Lucas Mendonça',
    authorRole: 'Gestor de Performance',
    module: 'GESTOR',
    actionType: 'EDICAO',
    entityName: 'Vértice Engenharia & Imóveis',
    description: 'Registrou nota de Otimização Semanal e completou o check de rotina semanal.',
    details: 'Subida de novos criativos 3D e teste de públicos semelhantes de compradores.'
  },
  {
    id: 'audit_3',
    timestamp: '11:30 - 20/09/2026',
    rawDate: '2026-09-20',
    authorName: 'Equipe Comercial Flyto',
    authorRole: 'Comercial',
    module: 'COMERCIAL',
    actionType: 'STATUS',
    entityName: "L'Essence Estética Avançada",
    description: 'Contrato fechado com sucesso e transferido para Onboarding de Implantação.',
    details: 'Fee mensal: R$ 2.800/mês · Budget estimado: R$ 10.000'
  },
  {
    id: 'audit_4',
    timestamp: '09:40 - 19/09/2026',
    rawDate: '2026-09-19',
    authorName: 'Lucas Mendonça',
    authorRole: 'Gestor de Performance',
    module: 'GESTOR',
    actionType: 'REUNIAO',
    entityName: 'Dra. Camila Dermatologia',
    description: 'Agendou reunião estratégica de alinhamento com link do Google Meet.',
    details: 'Data da call: 15:00 - 22/09/2026 · Pauta: Alinhamento de Bioestimuladores'
  },
  {
    id: 'audit_5',
    timestamp: '16:00 - 18/09/2026',
    rawDate: '2026-09-18',
    authorName: 'Suporte de Acessos',
    authorRole: 'Operações',
    module: 'ACESSOS',
    actionType: 'EDICAO',
    entityName: 'TechCorp Brasil',
    description: 'Configurou credenciais do Meta Conversions API (CAPI) e vinculou Pixel ID.',
    details: 'Token CAPI atualizado para conexão direta server-side com a landing page.'
  }
];
