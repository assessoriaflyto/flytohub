import { StudyMaterial, TeamCall, TeamAnnouncement } from '../types/hub';

export const initialTeamAnnouncement: TeamAnnouncement = {
  id: 'ann_1',
  title: 'Alinhamento Semanal de Performance & Metas de Outubro',
  message: 'Time, atenção às novas contas que entraram no onboarding técnico. Todos os criativos novos devem ser aprovados antes da subida na sexta-feira. Lembrem-se de registrar a nota técnica de cada otimização no FlytoHUB.',
  author: 'Lucas Mendonça',
  authorRole: 'Head de Performance',
  priority: 'IMPORTANTE',
  publishedAt: '09:00 - 18/09/2026'
};

export const initialTeamCalls: TeamCall[] = [
  {
    id: 'call_1',
    title: 'Alinhamento Geral Semanal da Equipe Flyto',
    agenda: 'Revisão de ROAS de todos os clientes ativos, status de entregas do audiovisual e novas oportunidades no funil comercial.',
    date: '2026-09-21 09:00',
    meetUrl: 'https://meet.google.com/fly-team-weekly',
    hostName: 'Lucas Mendonça',
    status: 'AGENDADA'
  },
  {
    id: 'call_2',
    title: 'Treinamento Interno: Estrutura de Campanhas Advantage+ & CAPI',
    agenda: 'Como blindar a mensuração de conversões e aproveitar os novos algoritmos de inteligência artificial do Meta Ads.',
    date: '2026-09-23 16:30',
    meetUrl: 'https://meet.google.com/fly-workshop-capi',
    hostName: 'Especialista em Tráfego',
    status: 'AGENDADA'
  }
];

export const initialStudyMaterials: StudyMaterial[] = [
  {
    id: 'mat_1',
    title: 'Framework de Roteirização para Criativos de Alta Conversão',
    category: 'AUDIOVISUAL_CRIATIVOS',
    url: 'https://drive.google.com/file/d/flyto-roteiros-conversao',
    instructor: 'Audiovisual Flyto',
    description: 'Manual passo a passo com ganchos (hooks) dos primeiros 3 segundos, quebra de objeções e chamadas para ação (CTA) persuasivas.',
    duration: '25 min',
    tags: ['Reels', 'Criativos', 'Copywriting', 'Vídeo'],
    addedAt: '15/09/2026'
  },
  {
    id: 'mat_2',
    title: 'Masterclass: Escala Horizontal vs Vertical no Meta Ads',
    category: 'TRAFEGO_PAGO',
    url: 'https://notion.so/flyto-escala-meta-ads',
    instructor: 'Lucas Mendonça',
    description: 'Diretrizes de quando aumentar orçamento em CBO/ABO e quando duplicar conjuntos para novos criativos e lookalikes sem queimar margem.',
    duration: '45 min',
    tags: ['Tráfego Pago', 'Escala', 'ROAS', 'CBO'],
    addedAt: '12/09/2026'
  },
  {
    id: 'mat_3',
    title: 'Script de Qualificação e Fechamento de Contratos High-Ticket',
    category: 'VENDAS_COMERCIAL',
    url: 'https://docs.google.com/document/d/flyto-script-vendas',
    instructor: 'Comercial Flyto',
    description: 'Perguntas de diagnóstico na reunião estratégica de vendas para ancorar valor e fechar contratos de assessoria com setup e fee mensal.',
    duration: '30 min',
    tags: ['Comercial', 'Vendas', 'High-Ticket', 'Pitch'],
    addedAt: '10/09/2026'
  },
  {
    id: 'mat_4',
    title: 'Implementação de Webhooks & n8n com WhatsApp Cloud API',
    category: 'FERRAMENTAS_AUTOMACAO',
    url: 'https://github.com/assessoriaflyto/n8n-templates',
    instructor: 'Tech Flyto',
    description: 'Fluxos automáticos para avisar gestores e clientes sobre novas leads em tempo real no WhatsApp e planilhas.',
    duration: '40 min',
    tags: ['n8n', 'WhatsApp API', 'Automação', 'CAPI'],
    addedAt: '05/09/2026'
  }
];
