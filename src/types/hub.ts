// ============================================================================
// FLYTOHUB — MODELOS DE DADOS DA ASSESSORIA DE PERFORMANCE & GROWTH
// ============================================================================

export type ActiveTab = 
  | 'TRAFFIC'              // Gestor de Tráfego (apenas squad do usuário ou todos se ADMIN)
  | 'SOCIAL_MEDIA'          // Social Media & Calendário Sazonal
  | 'COMMERCIAL'            // Comercial & CRM de Leads (acesso geral a leads e faturamento)
  | 'ONBOARDING'            // Onboarding (Gestor e Admin ativam; Comercial visualiza)
  | 'ACCESS'                // Acessos (senhas mascaradas para Comercial)
  | 'ONE_OFF_SERVICES'      // Serviços Avulsos (Sites, Apps, Automações)
  | 'PARTNERS'              // Parceiros & Indicações (aba dedicada)
  | 'ANNOUNCEMENTS'         // Mural de Avisos Gerais da Assessoria (aba exclusiva)
  | 'TRAINING'              // Estudos, Cursos & Treinamentos
  | 'ADMIN';                // Painel de Administração (Colaboradores, Squads, Metas, Logs)

export type UserRole = 'ADMIN' | 'TRAFFIC_MANAGER' | 'SOCIAL_MEDIA' | 'COMMERCIAL';

export type UserStatus = 'APROVADO' | 'PENDENTE_APROVACAO' | 'SUSPENSO';

export interface UserWarning {
  id: string;
  date: string;
  reason: string;
  appliedBy: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  squadId?: string;
  status: UserStatus;
  avatarUrl?: string;
  phone?: string;
  cnpj?: string;
  contractUrl?: string; // Link do contrato do colaborador no Drive/DocuSign
  warnings: UserWarning[];
  instagramHandle?: string;
  linkedinUrl?: string;
  createdAt: string;
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  color: string;
  leaderId?: string;
  createdAt: string;
}

export type GoalTargetType = 'VENDAS' | 'ROAS' | 'RENOVACOES';

export interface GoalEvent {
  id: string;
  title: string;
  description: string;
  targetType: GoalTargetType;
  targetValue: number;
  prize: string;
  startDate: string;
  endDate: string;
  status: 'ATIVO' | 'ENCERRADO';
  squadScores: {
    squadId: string;
    currentValue: number;
  }[];
}

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'LEAD' | 'ONBOARDING' | 'RECARGA';

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: NotificationType;
}

export type ClientStatus = 'ATIVO' | 'PAUSADO' | 'CANCELADO' | 'ONBOARDING' | 'AVISO_PREVIO' | 'INATIVO';

export type HealthRelationship = 'EXCELENTE' | 'BOA' | 'ATENCAO' | 'CRITICA';

export type PlanType = 'STARTER' | 'ESSENTIAL' | 'GROWTH' | 'ENTERPRISE';

export type BillingCycle = 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export type PaymentMethod = 'PIX' | 'BOLETO' | 'CARTAO' | 'TRANSFERENCIA';

export type TaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type CreativeFormat = 'REELS_VIDEO' | 'CARROSSEL' | 'ESTATICO' | 'STORY_INTERATIVO' | 'COPY_CAMPANHA';

export type CreativeStatus = 'ROTEIRO' | 'GRAVACAO' | 'EDICAO' | 'APROVACAO' | 'AGENDADO' | 'PUBLICADO';

export type LeadStatus = 'NOVO' | 'QUALIFICADO' | 'REUNIAO_AGENDADA' | 'PROPOSTA_ENVIADA' | 'FECHADO' | 'PERDIDO';

export type LeadSource = 'TRAFEGO_PAGO' | 'INDICACAO' | 'INSTAGRAM' | 'OUTBOUND' | 'EVENTO' | 'SITE';

export type MetaBalanceStatus = 'PAGO' | 'PENDENTE' | 'VERIFICAR';

// ----------------------------------------------------------------------------
// SALDO META ADS (STATUS, RECARGAS E VERIFICAÇÃO AUTOMÁTICA)
// ----------------------------------------------------------------------------
export interface MetaBalanceData {
  status: MetaBalanceStatus;
  lastRechargeAmount: number;
  lastRechargeDate: string;
  lastVerifiedDate: string;
  notes?: string;
}

// ----------------------------------------------------------------------------
// REUNIÃO AGENDADA (GOOGLE MEET & ALINHAMENTO)
// ----------------------------------------------------------------------------
export interface ScheduledMeeting {
  date: string; // Padrão "YYYY-MM-DD HH:mm"
  reason: string;
  meetUrl: string;
  scheduledAt: string;
}

// ----------------------------------------------------------------------------
// HISTÓRICO DE OTIMIZAÇÕES & LOGS DE ATIVIDADE
// ----------------------------------------------------------------------------
export interface OptimizationLog {
  id: string;
  date: string;
  time: string;
  author: string;
  note: string;
  roasAtTime?: number;
  adSpendAtTime?: number;
  type: 'OTIMIZACAO' | 'RELATORIO' | 'RECARGA' | 'REUNIAO' | 'CHECK_ROTINA';
}

// ----------------------------------------------------------------------------
// ROTINA SEMANAL DO GESTOR (5 CHECKS OBRIGATÓRIOS)
// ----------------------------------------------------------------------------
export interface RoutineChecks {
  weeklyReportSent: boolean;         // 1. Relatório Semanal
  weeklyOptimizationDone: boolean;   // 2. Otimização Semanal (exige nota!)
  videoBriefingDone: boolean;        // 3. Briefing Vídeo
  videoEditedDone: boolean;          // 4. Vídeo Editado
  creativeUploadedDone: boolean;     // 5. Criativo Subido
  lastResetDate: string;             // Data do último domingo 18h
}

// ----------------------------------------------------------------------------
// LOGINS EXTRAS DE OUTROS SITES
// ----------------------------------------------------------------------------
export interface ExtraSiteAccess {
  id: string;
  siteName: string;
  siteUrl: string;
  username: string;
  password?: string;
  notes?: string;
}

// ----------------------------------------------------------------------------
// CENTRAL DE ACESSOS E IDENTIDADE DO CLIENTE
// ----------------------------------------------------------------------------
export interface AccessVaultData {
  id: string;
  clientId: string;
  driveFolderUrl: string;
  briefingText?: string;
  pixelId?: string;
  pixelName?: string;
  capiToken?: string;
  googleAdsId?: string;
  siteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappNumber?: string;
  metaLogin?: string;
  metaPassword?: string;
  googleLogin?: string;
  googlePassword?: string;
  extraSites: ExtraSiteAccess[];
  customAvatarUrl?: string;
  securityNotes?: string;
  lastUpdated: string;
}

// ----------------------------------------------------------------------------
// TAREFAS DE CRIATIVOS E PRODUÇÃO
// ----------------------------------------------------------------------------
export interface CreativeTask {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  format: CreativeFormat;
  status: CreativeStatus;
  priority: TaskPriority;
  dueDate: string;
  driveAssetsUrl?: string;
  briefingNotes?: string;
  assignedTo: string;
}

// ----------------------------------------------------------------------------
// CALENDÁRIO SAZONAL DE MARKETING (TODOS OS MESES DO ANO)
// ----------------------------------------------------------------------------
export interface SeasonalEvent {
  id: string;
  month: number; // 1 a 12
  day: number;
  title: string;
  category: 'COMERCIAL' | 'DATA_COMEMORATIVA' | 'NICHO_ESPECIFICO' | 'OPORTUNIDADE';
  description: string;
  suggestedAction: string;
  highlighted?: boolean;
}

// ----------------------------------------------------------------------------
// SERVIÇOS AVULSOS (SEM MENSALIDADE: SITES, APPS, AUTOMAÇÕES)
// ----------------------------------------------------------------------------
export interface OneOffService {
  id: string;
  title: string;
  clientName: string;
  clientContact: string;
  scope: string; // Ex: Criação de Landing Page + CAPI
  briefing: string;
  deliveryDate: string;
  price: number;
  paymentStatus: 'PAGO' | 'PENDENTE' | 'ENTRADA_50';
  deliveryStatus: 'BRIEFING' | 'DESENVOLVIMENTO' | 'REVISAO' | 'ENTREGUE';
  notes?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// LEADS COMERCIAIS DA ASSESSORIA FLYTO
// ----------------------------------------------------------------------------
export interface CommercialLead {
  id: string;
  companyName: string;
  contactName: string;
  whatsapp: string;
  email?: string;
  segment: string;
  estimatedBudget: number;
  proposedFee: number;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  meetingDate?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// ETAPAS DE ONBOARDING
// ----------------------------------------------------------------------------
export interface OnboardingStep {
  id: string;
  label: string;
  done: boolean;
  completedAt?: string;
}

// ----------------------------------------------------------------------------
// DADOS COMPLETOS DO CLIENTE NA ASSESSORIA
// ----------------------------------------------------------------------------
export interface ClientData {
  id: string;
  name: string;
  tradeName: string;
  segment: string;
  squadId?: string; // Vínculo com o Squad responsável
  cnpj?: string;
  city: string;
  state: string;
  owners: string;
  phone: string;
  email?: string;
  instagramHandle?: string;
  websiteUrl?: string;
  customAvatarUrl?: string;

  // Link do Google Drive
  driveFolderUrl: string;

  // Contrato & Fee
  plan: PlanType;
  monthlyFee: number;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  contractStartDate: string;
  contractEndDate: string;

  // Métricas da Tabela do Gestor
  budgetMonthly: number;        // Orçamento
  monthlyAdSpend: number;       // Gasto (Mês)
  revenueGenerated: number;     // Faturamento Atual
  currentRoas: number;          // ROAS Atual
  targetRoas: number;           // Meta de ROAS

  // Saldo Meta & Recargas
  metaBalance: MetaBalanceData;

  // Rotina Semanal (Checks 1 a 5)
  routine: RoutineChecks;

  // Reunião de Alinhamento Agendada (Aviso na linha)
  scheduledMeeting?: ScheduledMeeting;

  // Histórico de Otimizações e Logs
  optimizationLogs: OptimizationLog[];
  lastOptimizationNote?: string;

  // Métricas Secundárias (Gaveta de Detalhes)
  ctrAverage: number;
  cpcAverage: number;
  cpmAverage: number;
  frequencyAverage: number;
  funnelConversionRate: number;
  activeCreativesCount: number;
  metaBmId?: string;
  metaAccountId?: string;

  // Status & Saúde
  status: ClientStatus;
  relationshipHealth: HealthRelationship;
  ltvTotal: number;

  // Onboarding
  kickoffDate?: string;
  onboardingSteps: OnboardingStep[];

  // Central de Acessos
  accessVault: AccessVaultData;
}

// ============================================================================
// SISTEMA DE INDICAÇÕES (PARCEIROS, CLIENTES E COLABORADORES)
// ============================================================================
export type ReferralStatus = 'PENDENTE' | 'EM_NEGOCIACAO' | 'CONTRATO_FECHADO' | 'COMISSAO_PAGA' | 'PERDIDO';

export interface ReferralDeal {
  id: string;
  partnerName: string;
  partnerType: 'PARCEIRO_EXTERNO' | 'CLIENTE' | 'COLABORADOR';
  partnerContact: string;
  referredClientName: string;
  contactName: string;
  whatsapp: string;
  segment: string;
  contractFee: number;
  commissionType: 'FIXO' | 'PERCENTUAL';
  commissionValue: number; // Ex: 500 (R$) ou 15 (%)
  commissionTotalBrl: number;
  status: ReferralStatus;
  date: string;
  notes?: string;
}

// ============================================================================
// CENTRAL DE LOGS DE AUDITORIA (SUPERVISÃO DE EQUIPE)
// ============================================================================
export type AuditModule = 
  | 'GESTOR' 
  | 'COMERCIAL' 
  | 'ONBOARDING' 
  | 'ACESSOS' 
  | 'SOCIAL_MEDIA' 
  | 'SERVICOS_AVULSOS' 
  | 'INDICACOES'
  | 'ESTUDOS'
  | 'ADMIN'
  | 'AUTH';

export type AuditActionType = 'CRIACAO' | 'EDICAO' | 'STATUS' | 'EXCLUSAO' | 'REUNIAO' | 'RECARGA' | 'LOGIN' | 'ADVERTENCIA';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // Ex: "15:00 - 20/09/2026"
  rawDate: string;
  authorName: string;
  authorRole: string;
  module: AuditModule;
  actionType: AuditActionType;
  entityName: string;
  description: string;
  details?: string;
}

// ============================================================================
// TREINAMENTOS, ESTUDOS & ALINHAMENTO DA EQUIPE
// ============================================================================
export type StudyCategory = 
  | 'TRAFEGO_PAGO' 
  | 'VENDAS_COMERCIAL' 
  | 'AUDIOVISUAL_CRIATIVOS' 
  | 'ESTRATEGIA_GROWTH' 
  | 'FERRAMENTAS_AUTOMACAO';

export interface StudyMaterial {
  id: string;
  title: string;
  category: StudyCategory;
  url: string;
  instructor?: string;
  description: string;
  duration?: string;
  tags: string[];
  addedAt: string;
}

export type TeamCallStatus = 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export interface TeamCall {
  id: string;
  title: string;
  agenda: string;
  date: string; // Ex: "2026-09-21 09:00"
  meetUrl: string;
  hostName: string;
  status: TeamCallStatus;
}

export interface TeamAnnouncement {
  id: string;
  title: string;
  message: string;
  author: string;
  authorRole: string;
  priority: 'NORMAL' | 'IMPORTANTE' | 'URGENTE';
  publishedAt: string;
}
