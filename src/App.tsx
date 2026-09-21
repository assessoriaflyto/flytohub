import React, { useState, useEffect } from 'react';
import { INITIAL_CLIENTS } from './data/mockClients';
import { INITIAL_LEADS } from './data/mockLeads';
import { INITIAL_CREATIVE_TASKS } from './data/mockCreativeTasks';
import { INITIAL_ONE_OFF_SERVICES } from './data/mockOneOffServices';
import { initialReferralDeals, initialAuditLogs } from './data/mockReferralsAndAudit';
import { initialTeamAnnouncement, initialTeamCalls, initialStudyMaterials } from './data/mockTrainingAndAlignment';
import { INITIAL_USERS, INITIAL_SQUADS, INITIAL_GOAL_EVENTS, INITIAL_NOTIFICATIONS } from './data/mockUsersAndSquads';
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
  StudyMaterial,
  UserAccount,
  UserRole,
  UserWarning,
  Squad,
  GoalEvent,
  NotificationItem,
  PaymentMethod
} from './types/hub';
import { Sidebar } from './components/navigation/Sidebar';
import { TrafficDashboard } from './components/dashboards/TrafficDashboard';
import { SocialMediaDashboard } from './components/dashboards/SocialMediaDashboard';
import { CommercialDashboard } from './components/dashboards/CommercialDashboard';
import { OnboardingDashboard } from './components/dashboards/OnboardingDashboard';
import { AccessDashboard } from './components/dashboards/AccessDashboard';
import { ServicesDashboard } from './components/dashboards/ServicesDashboard';
import { PartnersDashboard } from './components/dashboards/PartnersDashboard';
import { AnnouncementsDashboard } from './components/dashboards/AnnouncementsDashboard';
import { TrainingAndAlignmentDashboard } from './components/dashboards/TrainingAndAlignmentDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { LoginView } from './components/auth/LoginView';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
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

  // Estado de Autenticação & Usuário Ativo (Padrão: Admin CEO pré-configurado)
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USERS[0]);
  const [squads, setSquads] = useState<Squad[]>(INITIAL_SQUADS);
  const [goalEvents, setGoalEvents] = useState<GoalEvent[]>(INITIAL_GOAL_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Estados dos Dados Operacionais
  const [clients, setClients] = useState<ClientData[]>(INITIAL_CLIENTS);
  const [leads, setLeads] = useState<CommercialLead[]>(INITIAL_LEADS);
  const [creativeTasks, setCreativeTasks] = useState<CreativeTask[]>(INITIAL_CREATIVE_TASKS);
  const [services, setServices] = useState<OneOffService[]>(INITIAL_ONE_OFF_SERVICES);
  const [referrals, setReferrals] = useState<ReferralDeal[]>(initialReferralDeals);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [announcements, setAnnouncements] = useState<TeamAnnouncement[]>([
    initialTeamAnnouncement,
    {
      id: 'ann_2',
      title: 'Procedimento Operacional Padrão (POP) - Relatórios de Terça-Feira',
      message: 'Lembrando toda a equipe de performance: os relatórios semanais devem ser enviados aos clientes pontualmente às terças-feiras até às 14h, com comparativo de ROAS e CPA.',
      author: 'CEO Assessoria Flyto',
      authorRole: 'CEO & Diretoria',
      priority: 'IMPORTANTE',
      publishedAt: '10:00 - 18/09/2026'
    }
  ]);
  const [teamCalls, setTeamCalls] = useState<TeamCall[]>(initialTeamCalls);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(initialStudyMaterials);

  // Navegação
  const [activeTab, setActiveTab] = useState<ActiveTab>('TRAFFIC');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(INITIAL_CLIENTS[0]?.id || null);

  // Modais
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
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

  // Se o usuário não tiver permissão para ADMIN e estiver na aba ADMIN, redireciona
  useEffect(() => {
    if (activeTab === 'ADMIN' && currentUser?.role !== 'ADMIN') {
      setActiveTab('TRAFFIC');
    }
  }, [currentUser, activeTab]);

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
      authorName: currentUser ? currentUser.name : 'Sistema Flyto',
      authorRole: currentUser ? (currentUser.role === 'ADMIN' ? 'CEO & Diretoria' : currentUser.role) : 'FlytoHUB',
      module,
      actionType,
      entityName,
      description,
      details
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --------------------------------------------------------------------------
  // HANDLERS: AUTENTICAÇÃO, USUÁRIOS & PERFIL
  // --------------------------------------------------------------------------
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    recordAudit('AUTH', 'LOGIN', user.name, `Usuário realizou login no sistema.`);
  };

  const handleLogout = () => {
    if (currentUser) {
      recordAudit('AUTH', 'LOGIN', currentUser.name, `Usuário encerrou sessão.`);
    }
    setCurrentUser(null);
    setIsUserProfileModalOpen(false);
  };

  const handleRegisterPendingUser = (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cnpj?: string;
    role: UserRole;
    contractUrl?: string;
  }) => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: data.role,
      status: 'PENDENTE_APROVACAO',
      phone: data.phone.trim(),
      cnpj: data.cnpj?.trim(),
      contractUrl: data.contractUrl?.trim(),
      warnings: [],
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    setUsers(prev => [newUser, ...prev]);

    // Notificação para o Admin
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Novo Colaborador Aguardando Aprovação',
      message: `${newUser.name} se cadastrou como ${newUser.role}. Acesse o Painel Admin para aprovar e vincular ao Squad.`,
      read: false,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('pt-BR'),
      type: 'INFO'
    };
    setNotifications(prev => [notif, ...prev]);

    recordAudit('AUTH', 'CRIACAO', newUser.name, `Solicitou cadastro como colaborador. Status: Aguardando aprovação.`);
  };

  const handleApproveUser = (userId: string, role: UserRole, squadId?: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          recordAudit('ADMIN', 'STATUS', u.name, `Aprovou o colaborador com cargo ${role} ${squadId ? `e squad ${squadId}` : ''}`);
          return { ...u, status: 'APROVADO', role, squadId };
        }
        return u;
      })
    );
  };

  const handleRejectUser = (userId: string) => {
    const userToReject = users.find(u => u.id === userId);
    if (userToReject) {
      recordAudit('ADMIN', 'EXCLUSAO', userToReject.name, `Rejeitou a solicitação de cadastro do colaborador.`);
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleUpdateUserSquadAndRole = (userId: string, role: UserRole, squadId?: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          recordAudit('ADMIN', 'EDICAO', u.name, `Atualizou cargo para ${role} e squad para ${squadId || 'Geral'}`);
          const updated = { ...u, role, squadId };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const handleApplyWarning = (userId: string, reason: string) => {
    const newWarning: UserWarning = {
      id: `warn_${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      reason,
      appliedBy: currentUser ? currentUser.name : 'Diretoria Flyto'
    };

    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          recordAudit('ADMIN', 'ADVERTENCIA', u.name, `Aplicou advertência formal: ${reason}`);
          return { ...u, warnings: [...u.warnings, newWarning] };
        }
        return u;
      })
    );
  };

  const handleToggleUserSuspension = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'SUSPENSO' ? 'APROVADO' : 'SUSPENSO';
          recordAudit('ADMIN', 'STATUS', u.name, `Alterou status do colaborador para ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleCreateSquad = (newSquad: Omit<Squad, 'id' | 'createdAt'>) => {
    const created: Squad = {
      ...newSquad,
      id: `squad_${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    setSquads(prev => [...prev, created]);
    recordAudit('ADMIN', 'CRIACAO', created.name, `Criou novo squad de trabalho na assessoria.`);
  };

  const handleCreateGoalEvent = (newEvent: Omit<GoalEvent, 'id' | 'status'>) => {
    const created: GoalEvent = {
      ...newEvent,
      id: `goal_${Date.now()}`,
      status: 'ATIVO'
    };
    setGoalEvents(prev => [created, ...prev]);
    recordAudit('ADMIN', 'CRIACAO', created.title, `Criou novo evento de competição de metas.`);
  };

  const handleUpdateUserProfile = (updatedUser: Partial<UserAccount>) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...updatedUser };
    setCurrentUser(merged);
    setUsers(prev => prev.map(u => u.id === merged.id ? merged : u));
    recordAudit('ADMIN', 'EDICAO', merged.name, 'Atualizou informações cadastrais e redes sociais no perfil.');
  };

  // --------------------------------------------------------------------------
  // HANDLERS: NOTIFICAÇÕES
  // --------------------------------------------------------------------------
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
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

  const handleUpdatePaymentMethod = (clientId: string, method: PaymentMethod) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          recordAudit('GESTOR', 'EDICAO', c.tradeName, `Forma de pagamento de anúncios alterada para: ${method}`);
          return { ...c, paymentMethod: method };
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
            author: currentUser ? currentUser.name : 'Gestor Flyto',
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
            author: currentUser ? currentUser.name : 'Gestor Flyto',
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
          author: currentUser ? currentUser.name : 'Gestor Flyto',
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
          author: currentUser ? currentUser.name : 'Gestor Flyto',
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
          author: currentUser ? currentUser.name : 'Gestor Flyto',
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
          author: currentUser ? currentUser.name : 'Gestor Flyto',
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
  // HANDLERS: COMERCIAL & LEADS
  // --------------------------------------------------------------------------
  const handleAddLead = (newLead: Omit<CommercialLead, 'id' | 'createdAt'>) => {
    const created: CommercialLead = {
      ...newLead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [created, ...prev]);
    recordAudit('COMERCIAL', 'CRIACAO', created.companyName, `Cadastrou nova oportunidade no CRM. Fee proposto: R$ ${(created.proposedFee || 0).toLocaleString('pt-BR')}/mês`);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          recordAudit('COMERCIAL', 'STATUS', l.companyName, `Avançou o lead para a etapa: ${newStatus}`);
          return { ...l, status: newStatus };
        }
        return l;
      })
    );
  };

  const handleConvertLeadToClient = (lead: CommercialLead) => {
    const defaultDriveUrl = `https://drive.google.com/drive/folders/${lead.companyName.toLowerCase().replace(/\s+/g, '-')}-oficial`;
    
    // Aloca em squad do usuário ou no squad alpha
    const defaultSquadId = currentUser?.squadId || squads[0]?.id || 'squad_alpha';

    const newClient: ClientData = {
      id: `cli_${Date.now()}`,
      name: lead.companyName,
      tradeName: lead.companyName,
      segment: lead.segment,
      squadId: defaultSquadId,
      cnpj: 'Pendente no contrato',
      city: 'A definir',
      state: 'DF',
      owners: lead.contactName,
      phone: lead.whatsapp,
      email: lead.email || '',
      driveFolderUrl: defaultDriveUrl,
      plan: 'ESSENTIAL',
      monthlyFee: lead.proposedFee || 2500,
      billingCycle: 'MENSAL',
      paymentMethod: 'PIX',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: '2027-12-31',
      budgetMonthly: lead.estimatedBudget || 3000,
      monthlyAdSpend: 0,
      revenueGenerated: 0,
      currentRoas: 0,
      targetRoas: 3.5,
      ctrAverage: 1.8,
      cpcAverage: 2.10,
      cpmAverage: 28.50,
      frequencyAverage: 1.25,
      funnelConversionRate: 3.8,
      activeCreativesCount: 4,
      relationshipHealth: 'BOA',
      ltvTotal: lead.proposedFee || 2500,
      metaBalance: {
        status: 'VERIFICAR',
        lastRechargeAmount: 0,
        lastRechargeDate: new Date().toISOString().split('T')[0],
        lastVerifiedDate: new Date().toISOString().split('T')[0]
      },
      routine: {
        weeklyReportSent: false,
        weeklyOptimizationDone: false,
        videoBriefingDone: false,
        videoEditedDone: false,
        creativeUploadedDone: false,
        lastResetDate: new Date().toISOString().split('T')[0]
      },
      optimizationLogs: [
        {
          id: `log_init_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          author: currentUser ? currentUser.name : 'Equipe Flyto',
          note: 'Contrato fechado pelo Comercial! Cliente criado e adicionado à esteira de Onboarding.',
          type: 'OTIMIZACAO'
        }
      ],
      accessVault: {
        id: `vault_${Date.now()}`,
        clientId: `cli_${Date.now()}`,
        driveFolderUrl: defaultDriveUrl,
        briefingText: lead.notes || 'Cliente convertido do Comercial.',
        extraSites: [],
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      status: 'ONBOARDING',
      onboardingSteps: [
        { id: 'step_1', label: 'Criação do Grupo no WhatsApp & Alinhamento', done: true },
        { id: 'step_2', label: 'Pasta Google Drive criada e organizada', done: true },
        { id: 'step_3', label: 'Coleta de acessos Meta BM e Contas', done: false },
        { id: 'step_4', label: 'Validação de Pixel e API de Conversões (CAPI)', done: false },
        { id: 'step_5', label: 'Briefing inicial dos primeiros criativos', done: false },
        { id: 'step_6', label: 'Subida e ativação das primeiras campanhas', done: false }
      ]
    };

    setClients(prev => [newClient, ...prev]);

    setLeads(prev =>
      prev.map(l => l.id === lead.id ? { ...l, status: 'FECHADO' } : l)
    );

    recordAudit('COMERCIAL', 'STATUS', lead.companyName, 'Contrato fechado com sucesso! Cliente gerado e movido para Onboarding.');

    setActiveTab('ONBOARDING');
  };

  // --------------------------------------------------------------------------
  // HANDLERS: ONBOARDING TÉCNICO
  // --------------------------------------------------------------------------
  const handleToggleOnboardingStep = (clientId: string, stepId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;
        const updatedSteps = (c.onboardingSteps || []).map(s =>
          s.id === stepId ? { ...s, done: !s.done } : s
        );
        const toggledStep = updatedSteps.find(s => s.id === stepId);
        recordAudit('ONBOARDING', 'EDICAO', c.tradeName, `Marcou etapa [${toggledStep?.label}] como ${toggledStep?.done ? 'CONCLUÍDA' : 'PENDENTE'}`);
        return { ...c, onboardingSteps: updatedSteps };
      })
    );
  };

  const handleActivateClient = (clientId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;
        recordAudit('ONBOARDING', 'STATUS', c.tradeName, 'Concluiu a implantação técnica! Cliente ativado no painel do Gestor de Tráfego.');
        return { ...c, status: 'ATIVO' };
      })
    );
    setActiveTab('TRAFFIC');
  };

  // --------------------------------------------------------------------------
  // HANDLERS: MODAL DRIVE
  // --------------------------------------------------------------------------
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
  // HANDLERS: PARCEIROS & INDICAÇÕES
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
  // HANDLERS: AVISOS GERAIS DA ASSESSORIA
  // --------------------------------------------------------------------------
  const handleAddAnnouncement = (item: Omit<TeamAnnouncement, 'id'>) => {
    const created: TeamAnnouncement = {
      ...item,
      id: `ann_${Date.now()}`
    };
    setAnnouncements(prev => [created, ...prev]);
    recordAudit('ADMIN', 'CRIACAO', created.title, `Publicou novo comunicado oficial no mural da assessoria.`);

    // Cria notificação interna para a equipe
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Novo Comunicado: ${created.title}`,
      message: created.message.slice(0, 100) + '...',
      read: false,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('pt-BR'),
      type: created.priority === 'URGENTE' ? 'WARNING' : 'INFO'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleUpdateAnnouncement = (updated: TeamAnnouncement) => {
    setAnnouncements(prev => prev.map(a => a.id === updated.id ? updated : a));
    recordAudit('ADMIN', 'EDICAO', updated.title, `Atualizou comunicado no mural da assessoria.`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // --------------------------------------------------------------------------
  // HANDLERS: ESTUDOS & TREINAMENTOS
  // --------------------------------------------------------------------------
  const handleAddTeamCall = (call: Omit<TeamCall, 'id'>) => {
    const created: TeamCall = {
      ...call,
      id: `call_${Date.now()}`
    };
    setTeamCalls(prev => [created, ...prev]);
    recordAudit('ESTUDOS', 'REUNIAO', created.title, `Agendou call de alinhamento para ${formatDateTimeBR(created.date)}`);
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
    recordAudit('ESTUDOS', 'CRIACAO', created.title, `Adicionou novo material de estudo no acervo Flyto.`);
  };

  // ==========================================================================
  // SE NÃO HOUVER USUÁRIO LOGADO, EXIBE A TELA DE LOGIN & CADASTRO
  // ==========================================================================
  if (!currentUser) {
    return (
      <LoginView
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterPendingUser={handleRegisterPendingUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />
    );
  }

  // ==========================================================================
  // INTERFACE PRINCIPAL FLYTOHUB
  // ==========================================================================
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

      {/* 3. MARCA D'ÁGUA VERDE PURA CENTRALIZADA */}
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
        
        {/* Sidebar Lateral */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentUser={currentUser}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
          clients={clients}
          leads={leads}
          creativeTasks={creativeTasks}
          services={services}
          announcementsCount={announcements.length}
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
                currentUser={currentUser}
                squads={squads}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
                onUpdateClientRoas={handleUpdateClientRoas}
                onUpdateClientStatus={handleUpdateClientStatus}
                onToggleRoutineCheck={handleToggleRoutineCheck}
                onUpdateMetaBalanceStatus={handleUpdateMetaBalanceStatus}
                onOpenEditDriveModal={handleOpenEditDriveModal}
                onOpenScheduleMeetingModal={handleOpenScheduleMeetingModal}
                onSaveOptimizationNote={handleSaveOptimizationLog}
                onUpdatePaymentMethod={handleUpdatePaymentMethod}
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
                currentUser={currentUser}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
                onConvertLeadToClient={handleConvertLeadToClient}
              />
            )}

            {activeTab === 'ONBOARDING' && (
              <OnboardingDashboard
                clients={clients}
                currentUser={currentUser}
                onToggleStep={handleToggleOnboardingStep}
                onActivateClient={handleActivateClient}
                onOpenEditDriveModal={handleOpenEditDriveModal}
              />
            )}

            {activeTab === 'ACCESS' && (
              <AccessDashboard
                clients={clients}
                currentUser={currentUser}
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

            {activeTab === 'PARTNERS' && (
              <PartnersDashboard
                referrals={referrals}
                currentUser={currentUser}
                onAddReferral={handleAddReferral}
                onUpdateReferralStatus={handleUpdateReferralStatus}
              />
            )}

            {activeTab === 'ANNOUNCEMENTS' && (
              <AnnouncementsDashboard
                announcements={announcements}
                currentUser={currentUser}
                onAddAnnouncement={handleAddAnnouncement}
                onUpdateAnnouncement={handleUpdateAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {activeTab === 'TRAINING' && (
              <TrainingAndAlignmentDashboard
                announcement={announcements[0] || initialTeamAnnouncement}
                teamCalls={teamCalls}
                studyMaterials={studyMaterials}
                onUpdateAnnouncement={handleUpdateAnnouncement}
                onAddTeamCall={handleAddTeamCall}
                onUpdateCallStatus={handleUpdateCallStatus}
                onAddStudyMaterial={handleAddStudyMaterial}
              />
            )}

            {activeTab === 'ADMIN' && currentUser.role === 'ADMIN' && (
              <AdminDashboard
                currentUser={currentUser}
                users={users}
                squads={squads}
                goalEvents={goalEvents}
                auditLogs={auditLogs}
                onApproveUser={handleApproveUser}
                onRejectUser={handleRejectUser}
                onUpdateUserSquadAndRole={handleUpdateUserSquadAndRole}
                onApplyWarning={handleApplyWarning}
                onToggleUserSuspension={handleToggleUserSuspension}
                onCreateSquad={handleCreateSquad}
                onCreateGoalEvent={handleCreateGoalEvent}
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

      {/* Modais do Sistema */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        user={currentUser}
        squads={squads}
        onClose={() => setIsUserProfileModalOpen(false)}
        onUpdateProfile={handleUpdateUserProfile}
        onLogout={handleLogout}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsModalOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onMarkAsRead={handleMarkNotificationAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearNotifications}
      />

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
