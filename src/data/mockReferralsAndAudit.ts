// ============================================================================
// FLYTOHUB — INDICAÇÕES E AUDITORIA LIMPOS PARA INÍCIO DE OPERAÇÃO
// ============================================================================
import { ReferralDeal, AuditLogEntry } from '../types/hub';

export const initialReferralDeals: ReferralDeal[] = [];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit_init',
    timestamp: `${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString('pt-BR')}`,
    rawDate: new Date().toISOString().split('T')[0],
    authorName: 'CEO Assessoria Flyto',
    authorRole: 'CEO & Diretoria',
    module: 'ADMIN',
    actionType: 'STATUS',
    entityName: 'FlytoHUB',
    description: 'Sistema operacional e banco de dados inicializados em produção limpa.',
    details: 'Pronto para entrada de novos clientes, leads e equipe.'
  }
];
