import { UserAccount, Squad, GoalEvent, NotificationItem } from '../types/hub';

export const INITIAL_SQUADS: Squad[] = [
  {
    id: 'squad_alpha',
    name: 'Squad Alpha (Growth & E-commerce)',
    description: 'Gestão de contas voltadas para escala de vendas online, Shopify e infoprodutos.',
    color: '#00FF66',
    createdAt: '2026-09-01'
  },
  {
    id: 'squad_beta',
    name: 'Squad Beta (High-Ticket & Clínicas)',
    description: 'Assessoria para médicos, clínicas de alto padrão, harmonização e direito.',
    color: '#3B82F6',
    createdAt: '2026-09-01'
  },
  {
    id: 'squad_gamma',
    name: 'Squad Gamma (SaaS B2B & Imobiliário)',
    description: 'Campanhas de captação institucional, lançamentos imobiliários e tecnologia.',
    color: '#A855F7',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    name: 'CEO Assessoria Flyto',
    email: 'assessoriaflyto@gmail.com',
    password: '12345678', // Senha inicial definida pelo usuário
    role: 'ADMIN',
    status: 'APROVADO',
    avatarUrl: '/assets/logo-icon.png',
    phone: '(61) 98100-0000',
    cnpj: '45.123.456/0001-90',
    contractUrl: 'https://drive.google.com/file/d/flyto-contrato-social',
    warnings: [],
    instagramHandle: '@assessoriaflyto',
    linkedinUrl: 'https://linkedin.com/company/assessoriaflyto',
    createdAt: '2026-09-01'
  },
  {
    id: 'usr_lucas',
    name: 'Lucas Mendonça',
    email: 'lucas.gestor@flyto.com',
    password: '12345678',
    role: 'TRAFFIC_MANAGER',
    squadId: 'squad_alpha',
    status: 'APROVADO',
    avatarUrl: '/assets/perfil-instagram.png',
    phone: '(61) 98222-1111',
    cnpj: '51.987.654/0001-12',
    contractUrl: 'https://drive.google.com/file/d/flyto-contrato-lucas',
    warnings: [],
    instagramHandle: '@lucas.growth',
    createdAt: '2026-09-05'
  },
  {
    id: 'usr_beatriz',
    name: 'Beatriz Vasconcellos',
    email: 'beatriz.vendas@flyto.com',
    password: '12345678',
    role: 'COMMERCIAL',
    status: 'APROVADO',
    phone: '(61) 99111-2222',
    cnpj: '48.333.222/0001-44',
    contractUrl: 'https://drive.google.com/file/d/flyto-contrato-beatriz',
    warnings: [],
    createdAt: '2026-09-10'
  },
  {
    id: 'usr_felipe',
    name: 'Felipe Audiovisual',
    email: 'felipe.criativos@flyto.com',
    password: '12345678',
    role: 'SOCIAL_MEDIA',
    squadId: 'squad_alpha',
    status: 'APROVADO',
    phone: '(61) 98333-4444',
    warnings: [],
    createdAt: '2026-09-12'
  },
  // Candidato aguardando aprovação do Admin na aba de Admin!
  {
    id: 'usr_pendente_1',
    name: 'Gabriel Silva',
    email: 'gabriel.gestor@gmail.com',
    password: '12345678',
    role: 'TRAFFIC_MANAGER',
    status: 'PENDENTE_APROVACAO',
    phone: '(61) 99888-7766',
    cnpj: '52.444.111/0001-88',
    contractUrl: 'https://drive.google.com/file/d/flyto-minuta-gabriel',
    warnings: [],
    createdAt: '2026-09-20'
  }
];

export const INITIAL_GOAL_EVENTS: GoalEvent[] = [
  {
    id: 'goal_1',
    title: 'Batalha de Escala & Retenção Q4',
    description: 'O squad que atingir o maior faturamento agregado com ROAS acima de 4.0x recebe R$ 5.000 em premiação coletiva.',
    targetType: 'VENDAS',
    targetValue: 500000,
    prize: 'R$ 5.000 em Bônus para o Squad Vencedor + Jantar Executivo',
    startDate: '01/10/2026',
    endDate: '31/12/2026',
    status: 'ATIVO',
    squadScores: [
      { squadId: 'squad_alpha', currentValue: 243500 },
      { squadId: 'squad_beta', currentValue: 262500 },
      { squadId: 'squad_gamma', currentValue: 79200 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Novo Colaborador Aguardando Aprovação',
    message: 'Gabriel Silva solicitou cadastro como Gestor de Tráfego. Acesse a aba Admin para aprovar e definir o Squad.',
    read: false,
    timestamp: '20:15 - 20/09/2026',
    type: 'INFO'
  },
  {
    id: 'notif_2',
    title: 'Bem-vindo ao FlytoHUB!',
    message: 'Sistema operacional e central de gestão da Assessoria Flyto conectado com sucesso.',
    read: false,
    timestamp: '19:00 - 20/09/2026',
    type: 'SUCCESS'
  }
];
