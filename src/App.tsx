import React, { useState, useEffect } from 'react';
import { INITIAL_CLIENTS } from './data/mockClients';
import { INITIAL_LEADS } from './data/mockLeads';
import { INITIAL_CREATIVE_TASKS } from './data/mockCreativeTasks';
import { INITIAL_ONE_OFF_SERVICES } from './data/mockOneOffServices';
import { initialReferralDeals, initialAuditLogs } from './data/mockReferralsAndAudit';
import { initialTeamAnnouncement, initialTeamCalls, initialStudyMaterials } from './data/mockTrainingAndAlignment';
import { 
  ActiveTab, 
  ClientData, 
  ClientStatus,
  CommercialLead, 
  CreativeTask, 
  CreativeStatus, 
  LeadStatus,
  OneOffService,
  ScheduledMeeting,
  MetaBalanceStatus,
  AccessVaultData,
  OptimizationLog,
  ReferralDeal,
  ReferralStatus,
  AuditLogEntry,
  AuditModule,
  AuditActionType,
  TeamAnnouncement,
  TeamCall,
  TeamCallStatus,
  StudyMaterial
} from './types/hub';
import { Sidebar } from './components/navigation/Sidebar';
import { TrafficDashboard } from './components/dashboards/TrafficDashboard';
import { SocialMediaDashboard } from './components/dashboards/SocialMediaDashboard';
import { CommercialDashboard } from './components/dashboards/CommercialDashboard';
import { OnboardingDashboard } from './components/dashboards/OnboardingDashboard';
import { AccessDashboard } from './components/dashboards/AccessDashboard';
import { ServicesDashboard } from './components/dashboards/ServicesDashboard';
import { AuditAndReferralsDashboard } from './components/dashboards/AuditAndReferralsDashboard';
import { TrainingAndAlignmentDashboard } from './components/dashboards/TrainingAndAlignmentDashboard';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { EditDriveModal } from './components/modals/EditDriveModal';
import { ScheduleMeetingModal } from './components/modals/ScheduleMeetingModal';
import { NewServiceModal } from './components/modals/NewServiceModal';
import { Menu, Sun, Moon } from 'lucide-react';
import { formatDateBR, formatDateTimeBR } from './utils/formatters';

export const App: React.FC = () => {
  // Tela de Carregamento Inicial Executiva
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tema: Padrão CLARO (Light mode) como solicitado
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Estados dos Dados Principais
  const [clients, setClients] = useState<ClientData[]>(INITIAL_CLIENTS);
  const [leads, setLeads] = useState<CommercialLead[]>(INITIAL_LEADS);
  const [creativeTasks, setCreativeTasks] = useState<CreativeTask[]>(INITIAL_CREATIVE_TASKS);
  const [services, setServices] = useState<OneOffService[]>(INITIAL_ONE_OFF_SERVICES);
  
  // Novos Módulos: Indicações & Logs, Estudos & Alinhamento
  const [referrals, setReferrals] = useState<ReferralDeal[]>(initialReferralDeals);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [teamAnnouncement, setTeamAnnouncement] = useState<TeamAnnouncement>(initialTeamAnnouncement);
  const [teamCalls, setTeamCalls] = useState<TeamCall[]>(initialTeamCalls);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(initialStudyMaterials);

  const [activeTab, setActiveTab] = useState<ActiveTab>('TRAFFIC');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(INITIAL_CLIENTS[0]?.id || null);

  // Modais
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isEditDriveModalOpen, setIsEditDriveModalOpen] = useState(false);
  const [editingDriveClient, setEditingDriveClient] = useState<ClientData | null>(null);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingClient, setMeetingClient] = useState<ClientData | null>(null);

  // Carregamento inicial suave
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Sincroniza classes HTML para modo claro / escuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // --------------------------------------------------------------------------
  // HELPER: REGISTRO DE AUDITORIA AUTOMÁTICA
  // --------------------------------------------------------------------------
  const recordAudit = (
    module: AuditModule,
    actionType: AuditActionType,
    entityName: string,
    description: string,
    details?: string
  ) => {
    const now = new Date();
    const timeNow = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateNow = now.toLocaleDateString('pt-BR');
    const timestamp = `${timeNow} - ${dateNow}`;

    const newLog: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      rawDate: now.toISOString().split('T')[0],
      authorName: 'Lucas Mendonça',
      authorRole: 'Gestor de Performance',
      module,
      actionType,
      entityName,
      description,
      details
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --------------------------------------------------------------------------
  // HANDLERS: GESTOR DE TRÁFEGO & PERFORMANCE
  // --------------------------------------------------------------------------
  const handleUpdateClientRoas = (clientId: string, newRoas: number) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          recordAudit('GESTOR', 'EDICAO', c.tradeName, `Atualizou o ROAS para ${newRoas.toFixed(2)}x.`);
          return { ...c, currentRoas: newRoas };
        }
        return c;
      })
    );
  };

  const handleUpdateClientStatus = (clientId: string, status: ClientStatus) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          const statusLabels: Record<ClientStatus, string> = {
            ATIVO: 'Reativado (Campanhas ativas)',
            PAUSADO: 'Pausado temporariamente',
            CANCELADO: 'Contrato cancelado / inativo',
            ONBOARDING: 'Em Onboarding',
            AVISO_PREVIO: 'Aviso prévio',
            INATIVO: 'Inativo'
          };
          recordAudit('GESTOR', 'STATUS', c.tradeName, `Alterou a situação do cliente para: ${statusLabels[status]}`);
          return { ...c, status };
        }
        return c;
      })
    );
  };

  const handleToggleRoutineCheck = (
    clientId: string,
    checkKey: 'weeklyReportSent' | 'weeklyOptimizationDone' | 'videoBriefingDone' | 'videoEditedDone' | 'creativeUploadedDone',
    note?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;

        const nextVal = !c.routine[checkKey];
        const updatedRoutine = {
          ...c.routine,
          [checkKey]: nextVal
        };

        const newLogs = [...c.optimizationLogs];

        if (checkKey === 'weeklyOptimizationDone' && nextVal && note) {
          const logEntry: OptimizationLog = {
            id: `log_opt_${Date.now()}`,
            date: today,
            time: timeNow,
            author: 'Lucas Mendonça',
            note: note.trim(),
            roasAtTime: c.currentRoas,
            adSpendAtTime: c.monthlyAdSpend,
            type: 'OTIMIZACAO'
          };
          newLogs.unshift(logEntry);
          recordAudit('GESTOR', 'EDICAO', c.tradeName, 'Salvou nota de otimização semanal e completou o check.', note.trim());
        } else if (nextVal) {
          const logLabels: Record<string, string> = {
            weeklyReportSent: 'Relatório Semanal enviado ao cliente',
            videoBriefingDone: 'Briefing de captação de vídeo alinhado',
            videoEditedDone: 'Vídeo da semana editado e aprovado',
            creativeUploadedDone: 'Novos criativos subidos nas campanhas'
          };
          const logEntry: OptimizationLog = {
            id: `log_check_${Date.now()}`,
            date: today,
            time: timeNow,
            author: 'Lucas Mendonça',
            note: logLabels[checkKey] || `Rotina [${checkKey}] marcada como concluída`,
            type: 'CHECK_ROTINA'
          };
          newLogs.unshift(logEntry);
          recordAudit('GESTOR', 'EDICAO', c.tradeName, `Completou o check da rotina: ${logLabels[checkKey] || checkKey}`);
        }

        return {
          ...c,
          routine: updatedRoutine,
          optimizationLogs: newLogs,
          lastOptimizationNote: (checkKey === 'weeklyOptimizationDone' && note) ? note : c.lastOptimizationNote
        };
      })
    );
  };

  const handleUpdateMetaBalanceStatus = (
    clientId: string, 
    status: MetaBalanceStatus, 
    rechargeAmount?: number
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;

        const updatedMetaBalance = {
          ...c.metaBalance,
          status,
          ...(rechargeAmount ? { lastRechargeAmount: rechargeAmount, lastRechargeDate: today } : {})
        };

        const logEntry: OptimizationLog = {
          id: `log_bal_${Date.now()}`,
          date: today,
          time: timeNow,
          author: 'Lucas Mendonça',
          note: `Saldo Meta alterado para: ${status}${rechargeAmount ? ` (Recarga de R$ ${rechargeAmount.toLocaleString('pt-BR')})` : ''}`,
          type: 'RECARGA'
        };

        recordAudit('GESTOR', 'RECARGA', c.tradeName, `Saldo Meta Ads atualizado para: ${status}`, rechargeAmount ? `Valor da recarga: R$ ${rechargeAmount.toLocaleString('pt-BR')}` : undefined);

        return {
          ...c,
          metaBalance: updatedMetaBalance,
          optimizationLogs: [logEntry, ...c.optimizationLogs]
        };
      })
    );
  };

  const handleSaveOptimizationLog = (clientId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;

        const logEntry: OptimizationLog = {
          id: `log_man_${Date.now()}`,
          date: today,
          time: timeNow,
          author: 'Lucas Mendonça',
          note: note.trim(),
          roasAtTime: c.currentRoas,
          adSpendAtTime: c.monthlyAdSpend,
          type: 'OTIMIZACAO'
        };

        recordAudit('GESTOR', 'EDICAO', c.tradeName, 'Registrou intervenção técnica nas contas de anúncio.', note.trim());

        return {
          ...c,
          lastOptimizationNote: note.trim(),
          optimizationLogs: [logEntry, ...c.optimizationLogs]
        };
      })
    );
  };

  // --------------------------------------------------------------------------
  // HANDLERS: REUNIÕES AGENDADAS
  // --------------------------------------------------------------------------
  const handleOpenScheduleMeetingModal = (client: ClientData) => {
    setMeetingClient(client);
    setIsMeetingModalOpen(true);
  };

  const handleSaveMeeting = (clientId: string, meeting: ScheduledMeeting) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;

        const logEntry: OptimizationLog = {
          id: `log_meet_${Date.now()}`,
          date: today,
          time: timeNow,
          author: 'Lucas Mendonça',
          note: `Reunião agendada para ${formatDateTimeBR(meeting.date)}: "${meeting.reason}". Link: ${meeting.meetUrl}`,
          type: 'REUNIAO'
        };

        recordAudit('GESTOR', 'REUNIAO', c.tradeName, `Agendou reunião estratégica para ${formatDateTimeBR(meeting.date)}. Pauta: ${meeting.reason}`);

        return {
          ...c,
          scheduledMeeting: meeting,
          optimizationLogs: [logEntry, ...c.optimizationLogs]
        };
      })
    );
  };

  const handleCancelMeeting = (clientId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;

        const logEntry: OptimizationLog = {
          id: `log_meet_cancel_${Date.now()}`,
          date: today,
          time: timeNow,
          author: 'Lucas Mendonça',
          note: `Reunião agendada foi desmarcada ou concluída.`,
          type: 'REUNIAO'
        };

        recordAudit('GESTOR', 'REUNIAO', c.tradeName, 'Cancelou a reunião agendada anteriormente.');

        return {
          ...c,
          scheduledMeeting: undefined,
          optimizationLogs: [logEntry, ...c.optimizationLogs]
        };
      })
    );
  };

  // --------------------------------------------------------------------------
  // HANDLERS: CENTRAL DE ACESSOS
  // --------------------------------------------------------------------------
  const handleUpdateClientVault = (clientId: string, updatedVault: Partial<AccessVaultData>) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;
        recordAudit('ACESSOS', 'EDICAO', c.tradeName, 'Atualizou credenciais e chaves na Central de Acessos.');
        return {
          ...c,
          accessVault: {
            ...c.accessVault,
            ...updatedVault,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        };
      })
    );
  };

  // --------------------------------------------------------------------------
  // HANDLERS: SERVIÇOS AVULSOS
  // --------------------------------------------------------------------------
  const handleAddService = (newService: Omit<OneOffService, 'id' | 'createdAt'>) => {
    const created: OneOffService = {
      ...newService,
      id: `srv_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setServices(prev => [created, ...prev]);
    recordAudit('SERVICOS_AVULSOS', 'CRIACAO', created.clientName, `Cadastrou projeto avulso: "${created.title}". Preço: R$ ${created.price.toLocaleString('pt-BR')}`);
  };

  const handleUpdateDeliveryStatus = (id: string, status: OneOffService['deliveryStatus']) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === id) {
          recordAudit('SERVICOS_AVULSOS', 'STATUS', s.clientName, `Alterou status de entrega do projeto "${s.title}" para: ${status}`);
          return { ...s, deliveryStatus: status };
        }
        return s;
      })
    );
  };

  const handleUpdatePaymentStatus = (id: string, status: OneOffService['paymentStatus']) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === id) {
          recordAudit('SERVICOS_AVULSOS', 'STATUS', s.clientName, `Alterou pagamento do projeto "${s.title}" para: ${status}`);
          return { ...s, paymentStatus: status };
        }
        return s;
      })
    );
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // --------------------------------------------------------------------------
  // HANDLERS: SOCIAL MEDIA & CRIATIVOS
  // --------------------------------------------------------------------------
  const handleUpdateTaskStatus = (taskId: string, newStatus: CreativeStatus) => {
    setCreativeTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          recordAudit('SOCIAL_MEDIA', 'STATUS', t.clientName, `Alterou status do criativo "${t.title}" para: ${newStatus}`);
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<CreativeTask, 'id'>) => {
    const created: CreativeTask = {
      ...newTask,
      id: `task_${Date.now()}`
    };
    setCreativeTasks(prev => [created, ...prev]);
    recordAudit('SOCIAL_MEDIA', 'CRIACAO', created.clientName, `Adicionou nova demanda de criativo: "${created.title}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    setCreativeTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // --------------------------------------------------------------------------
  // HANDLERS: COMERCIAL & LEADS (FLUXO ÚNICO DE CRIAÇÃO!)
  // --------------------------------------------------------------------------
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          recordAudit('COMERCIAL', 'STATUS', l.companyName, `Avançou etapa do funil para: ${newStatus}`);
          return { ...l, status: newStatus };
        }
        return l;
      })
    );
  };

  const handleAddLead = (newLead: CommercialLead) => {
    setLeads(prev => [newLead, ...prev]);
    recordAudit('COMERCIAL', 'CRIACAO', newLead.companyName, `Cadastrou nova oportunidade no CRM: ${newLead.companyName} (${newLead.segment}). Contato: ${newLead.contactName}`);
  };

  const handleConvertLeadToClient = (lead: CommercialLead) => {
    const clientId = `cli_${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const contractEndStr = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newClient: ClientData = {
      id: clientId,
      name: lead.companyName,
      tradeName: lead.companyName,
      segment: lead.segment,
      city: 'Brasília',
      state: 'DF',
      owners: lead.contactName,
      phone: lead.whatsapp,
      email: lead.email,
      driveFolderUrl: `https://drive.google.com/drive/folders/Flyto-${lead.companyName.replace(/\s+/g, '')}`,
      plan: 'GROWTH',
      monthlyFee: lead.proposedFee || 2500,
      billingCycle: 'MENSAL',
      paymentMethod: 'PIX',
      contractStartDate: todayStr,
      contractEndDate: contractEndStr,
      budgetMonthly: lead.estimatedBudget || 10000,
      monthlyAdSpend: 0,
      revenueGenerated: 0,
      currentRoas: 0.0,
      targetRoas: 4.5,
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
          author: 'Comercial Flyto',
          note: `Lead convertido em cliente pelo Comercial (${lead.notes || 'Início da assessoria'}).`,
          type: 'OTIMIZACAO'
        }
      ],
      lastOptimizationNote: `Lead convertido em cliente pelo Comercial (${lead.notes || 'Início da assessoria'}).`,
      ctrAverage: 2.0,
      cpcAverage: 2.5,
      cpmAverage: 30.0,
      frequencyAverage: 1.0,
      funnelConversionRate: 6.0,
      activeCreativesCount: 0,
      status: 'ONBOARDING',
      relationshipHealth: 'EXCELENTE',
      ltvTotal: lead.proposedFee || 2500,
      kickoffDate: todayStr,
      onboardingSteps: [
        { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: todayStr },
        { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: false },
        { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: false },
        { id: 'step_4', label: 'Briefing Estratégico & ICP Respondido', done: false },
        { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: todayStr },
        { id: 'step_6', label: 'Reunião de Kick-off & Definição de Metas', done: false },
        { id: 'step_7', label: 'Subida da Primeira Campanha de Escala', done: false }
      ],
      accessVault: {
        id: `vault_${clientId}`,
        clientId,
        driveFolderUrl: `https://drive.google.com/drive/folders/Flyto-${lead.companyName.replace(/\s+/g, '')}`,
        briefingText: lead.notes || '',
        whatsappNumber: lead.whatsapp,
        extraSites: [],
        lastUpdated: todayStr
      }
    };

    setClients(prev => [newClient, ...prev]);
    handleUpdateLeadStatus(lead.id, 'FECHADO');
    recordAudit('COMERCIAL', 'STATUS', lead.companyName, `Contrato fechado com sucesso! Iniciado Onboarding Técnico de Implantação.`);
    setActiveTab('ONBOARDING');
  };

  // --------------------------------------------------------------------------
  // HANDLERS: ONBOARDING & CLIENTES
  // --------------------------------------------------------------------------
  const handleToggleOnboardingStep = (clientId: string, stepId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;
        const steps = c.onboardingSteps.map(s => {
          if (s.id !== stepId) return s;
          const nextDone = !s.done;
          recordAudit('ONBOARDING', 'EDICAO', c.tradeName, `${nextDone ? 'Concluiu' : 'Desmarcou'} etapa de onboarding: "${s.label}"`);
          return {
            ...s,
            done: nextDone,
            completedAt: nextDone ? today : undefined
          };
        });
        return { ...c, onboardingSteps: steps };
      })
    );
  };

  const handleActivateClient = (clientId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          recordAudit('ONBOARDING', 'STATUS', c.tradeName, 'Onboarding concluído! Cliente movido oficialmente para ATIVO no Gestor de Tráfego.');
          return { ...c, status: 'ATIVO' };
        }
        return c;
      })
    );
    setActiveTab('TRAFFIC');
  };

  const handleOpenEditDriveModal = (client: ClientData) => {
    setEditingDriveClient(client);
    setIsEditDriveModalOpen(true);
  };

  const handleSaveDriveUrl = (clientId: string, newUrl: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          recordAudit('ACESSOS', 'EDICAO', c.tradeName, 'Atualizou link da pasta do Google Drive.');
          return { ...c, driveFolderUrl: newUrl };
        }
        return c;
      })
    );
  };

  // --------------------------------------------------------------------------
  // HANDLERS: INDICAÇÕES & AUDITORIA
  // --------------------------------------------------------------------------
  const handleAddReferral = (deal: Omit<ReferralDeal, 'id'>) => {
    const created: ReferralDeal = {
      ...deal,
      id: `ref_${Date.now()}`
    };
    setReferrals(prev => [created, ...prev]);
    recordAudit('INDICACOES', 'CRIACAO', created.referredClientName, `Cadastrou indicação feita por "${created.partnerName}". Comissão: R$ ${created.commissionTotalBrl.toLocaleString('pt-BR')}`);
  };

  const handleUpdateReferralStatus = (id: string, status: ReferralStatus) => {
    setReferrals(prev =>
      prev.map(r => {
        if (r.id === id) {
          recordAudit('INDICACOES', 'STATUS', r.referredClientName, `Atualizou status da indicação de "${r.partnerName}" para: ${status}`);
          return { ...r, status };
        }
        return r;
      })
    );
  };

  // --------------------------------------------------------------------------
  // HANDLERS: ESTUDOS & ALINHAMENTO DE EQUIPE
  // --------------------------------------------------------------------------
  const handleUpdateAnnouncement = (updated: TeamAnnouncement) => {
    setTeamAnnouncement(updated);
    recordAudit('ESTUDOS', 'EDICAO', 'Mural de Avisos', `Atualizou o comunicado geral: "${updated.title}"`);
  };

  const handleAddTeamCall = (call: Omit<TeamCall, 'id'>) => {
    const created: TeamCall = {
      ...call,
      id: `call_${Date.now()}`
    };
    setTeamCalls(prev => [created, ...prev]);
    recordAudit('ESTUDOS', 'REUNIAO', created.title, `Agendou call de equipe pelo Google Meet para ${formatDateTimeBR(created.date)}`);
  };

  const handleUpdateCallStatus = (id: string, status: TeamCallStatus) => {
    setTeamCalls(prev =>
      prev.map(c => {
        if (c.id === id) {
          recordAudit('ESTUDOS', 'STATUS', c.title, `Alterou status da call interna para: ${status}`);
          return { ...c, status };
        }
        return c;
      })
    );
  };

  const handleAddStudyMaterial = (material: Omit<StudyMaterial, 'id'>) => {
    const created: StudyMaterial = {
      ...material,
      id: `mat_${Date.now()}`
    };
    setStudyMaterials(prev => [created, ...prev]);
    recordAudit('ESTUDOS', 'CRIACAO', created.title, `Adicionou novo material de estudo no acervo da Flyto.`);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F1012] text-[#0F1715] dark:text-white flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      
      {/* 1. TELA DE CARREGAMENTO INICIAL SUAVE COM LOGO DA FLYTO */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#0F1012] transition-opacity duration-500 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-[#181A1D] border border-emerald-200 dark:border-[#2D3035] flex items-center justify-center shadow-lg mb-4 animate-pulse">
            <img 
              src="/assets/logo-icon.png" 
              alt="Flyto" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]"
            />
          </div>
          <h2 className="text-sm font-black tracking-wider text-slate-800 dark:text-white">
            Flyto<span className="text-[#277e1b] dark:text-[#00FF66]">HUB</span>
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-[#696969] mt-1">Carregando painel executivo...</span>
        </div>
      )}

      {/* 2. GRID QUADRICULADO IDÊNTICO AO SITE DA FLYTO */}
      <div className="fixed inset-0 bg-ambient-grid pointer-events-none z-0" />

      {/* 3. MARCA D'ÁGUA VERDE PURA CENTRALIZADA (SEM ROXO/ROSA!) */}
      <div className="fixed inset-0 bg-watermark-logo-center pointer-events-none z-0" />

      {/* Header Superior Mobile */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-[#121315]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#25282C] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#1F2124] text-slate-700 dark:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <img 
            src="/assets/logo-icon.png" 
            alt="Flyto" 
            className="w-6 h-6 object-contain"
          />
          <span className="font-black text-sm tracking-tight">Flyto<span className="text-[#277e1b] dark:text-[#00FF66]">HUB</span></span>
        </div>

        <button
          onClick={() => setIsDarkMode(prev => !prev)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#1F2124] text-slate-700 dark:text-white"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#277e1b]" />}
        </button>
      </header>

      {/* Container Geral: Sidebar à Esquerda + Conteúdo Principal */}
      <div className="flex-1 flex min-h-screen relative z-10">
        
        {/* Sidebar Lateral (Com novo botão único de lead e novas categorias) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
          clients={clients}
          leads={leads}
          creativeTasks={creativeTasks}
          services={services}
          onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Conteúdo Dinâmico por Módulo */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          
          <main className="flex-1 max-w-[1680px] w-full mx-auto p-4 sm:p-6 lg:p-8">
            
            {activeTab === 'TRAFFIC' && (
              <TrafficDashboard
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
                onUpdateClientRoas={handleUpdateClientRoas}
                onUpdateClientStatus={handleUpdateClientStatus}
                onToggleRoutineCheck={handleToggleRoutineCheck}
                onUpdateMetaBalanceStatus={handleUpdateMetaBalanceStatus}
                onOpenEditDriveModal={handleOpenEditDriveModal}
                onOpenScheduleMeetingModal={handleOpenScheduleMeetingModal}
                onSaveOptimizationNote={handleSaveOptimizationLog}
              />
            )}

            {activeTab === 'SOCIAL_MEDIA' && (
              <SocialMediaDashboard
                tasks={creativeTasks}
                clients={clients}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onOpenEditDriveModal={handleOpenEditDriveModal}
              />
            )}

            {activeTab === 'COMMERCIAL' && (
              <CommercialDashboard
                leads={leads}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
                onConvertLeadToClient={handleConvertLeadToClient}
              />
            )}

            {activeTab === 'ONBOARDING' && (
              <OnboardingDashboard
                clients={clients}
                onToggleStep={handleToggleOnboardingStep}
                onActivateClient={handleActivateClient}
                onOpenEditDriveModal={handleOpenEditDriveModal}
              />
            )}

            {activeTab === 'ACCESS' && (
              <AccessDashboard
                clients={clients}
                onOpenEditDriveModal={handleOpenEditDriveModal}
                onUpdateClientVault={handleUpdateClientVault}
              />
            )}

            {activeTab === 'ONE_OFF_SERVICES' && (
              <ServicesDashboard
                services={services}
                onAddServiceModalOpen={() => setIsNewServiceModalOpen(true)}
                onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onDeleteService={handleDeleteService}
              />
            )}

            {activeTab === 'INDICACOES_LOGS' && (
              <AuditAndReferralsDashboard
                referrals={referrals}
                auditLogs={auditLogs}
                onAddReferral={handleAddReferral}
                onUpdateReferralStatus={handleUpdateReferralStatus}
              />
            )}

            {activeTab === 'ESTUDOS_ALINHAMENTO' && (
              <TrainingAndAlignmentDashboard
                announcement={teamAnnouncement}
                teamCalls={teamCalls}
                studyMaterials={studyMaterials}
                onUpdateAnnouncement={handleUpdateAnnouncement}
                onAddTeamCall={handleAddTeamCall}
                onUpdateCallStatus={handleUpdateCallStatus}
                onAddStudyMaterial={handleAddStudyMaterial}
              />
            )}

          </main>

          {/* Rodapé Executivo */}
          <footer className="bg-white/90 dark:bg-[#121315]/90 border-t border-slate-200 dark:border-[#25282C] px-6 py-3.5 mt-auto">
            <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 dark:text-[#696969] gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#277e1b] dark:bg-[#00FF66] animate-pulse" />
                <strong className="text-slate-900 dark:text-white font-semibold">Flyto Assessoria de Performance</strong>
                <span>&middot; Sistema Operacional de Gestão & Escala</span>
              </div>
              <div className="text-[11px]">
                Brasília - DF &middot; Rotinas com reset aos domingos 18h &middot; assessoriaflyto.com.br
              </div>
            </div>
          </footer>

        </div>

      </div>

      {/* Modais do Sistema (Sem modal avulso de cliente, apenas Lead, Drive, Reunião e Serviço) */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      <EditDriveModal
        isOpen={isEditDriveModalOpen}
        client={editingDriveClient}
        onClose={() => setIsEditDriveModalOpen(false)}
        onSaveDriveUrl={handleSaveDriveUrl}
      />

      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        client={meetingClient}
        onClose={() => setIsMeetingModalOpen(false)}
        onSaveMeeting={handleSaveMeeting}
        onCancelMeeting={handleCancelMeeting}
      />

      <NewServiceModal
        isOpen={isNewServiceModalOpen}
        onClose={() => setIsNewServiceModalOpen(false)}
        onAddService={handleAddService}
      />

    </div>
  );
};

export default App;
