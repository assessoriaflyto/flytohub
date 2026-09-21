import { UserAccount, Squad, GoalEvent, NotificationItem } from '../types/hub';

export const INITIAL_SQUADS: Squad[] = [
  {
    id: 'squad_alpha',
    name: 'Squad Alpha',
    description: 'Gestão de contas e tráfego pago',
    color: '#00FF66',
    createdAt: '2026-09-20'
  },
  {
    id: 'squad_beta',
    name: 'Squad Beta',
    description: 'Assessoria de performance e crescimento',
    color: '#3B82F6',
    createdAt: '2026-09-20'
  },
  {
    id: 'squad_gamma',
    name: 'Squad Gamma',
    description: 'Escala de vendas e novos canais',
    color: '#A855F7',
    createdAt: '2026-09-20'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    name: 'CEO Assessoria Flyto',
    email: 'assessoriaflyto@gmail.com',
    password: '12345678', // Senha de acesso do Admin
    role: 'ADMIN',
    status: 'APROVADO',
    avatarUrl: '/assets/logo-icon.png',
    phone: '(61) 98100-0000',
    cnpj: '45.123.456/0001-90',
    contractUrl: 'https://drive.google.com',
    warnings: [],
    instagramHandle: '@assessoriaflyto',
    linkedinUrl: 'https://linkedin.com/company/assessoriaflyto',
    createdAt: '2026-09-20'
  }
];

export const INITIAL_GOAL_EVENTS: GoalEvent[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_welcome',
    title: 'FlytoHUB Inicializado',
    message: 'Base operacional limpa e pronta para inclusão de colaboradores, clientes e campanhas.',
    read: false,
    timestamp: `${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString('pt-BR')}`,
    type: 'SUCCESS'
  }
];
