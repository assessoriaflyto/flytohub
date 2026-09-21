// ============================================================================
// FLYTOHUB — BASE DE CLIENTES ATUALIZADA DA ASSESSORIA FLYTO
// ============================================================================
import { ClientData } from '../types/hub';

export const INITIAL_CLIENTS: ClientData[] = [
  {
    id: 'cli_techcorp',
    name: 'TechCorp Brasil Software & Soluções S/A',
    tradeName: 'TechCorp Brasil',
    segment: 'SaaS B2B & Software Empresarial',
    squadId: 'squad_gamma',
    cnpj: '41.982.340/0001-88',
    city: 'Brasília',
    state: 'DF',
    owners: 'Henrique Farias & Rodrigo Peixoto',
    phone: '(61) 98144-8800',
    email: 'diretoria@techcorpbrasil.com.br',
    instagramHandle: '@techcorpbrasil',
    websiteUrl: 'https://techcorpbrasil.com.br',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1TechCorpBrasil-Oficial',

    // Contrato
    plan: 'GROWTH',
    monthlyFee: 2500.0,
    billingCycle: 'MENSAL',
    paymentMethod: 'PIX',
    contractStartDate: '2026-02-01',
    contractEndDate: '2026-10-31',

    // Novas Colunas da Tabela
    budgetMonthly: 15000.0,
    monthlyAdSpend: 12000.0,
    revenueGenerated: 57600.0,
    currentRoas: 4.8,
    targetRoas: 4.0,

    // Saldo Meta Ads & Recargas
    metaBalance: {
      status: 'PAGO',
      lastRechargeAmount: 5000.0,
      lastRechargeDate: '2026-09-18',
      lastVerifiedDate: '2026-09-20 18:00',
      notes: 'Boleto de recarga compensado sem retenções.'
    },

    // Rotina Semanal (Checks 1 a 5, reset aos domingos 18h)
    routine: {
      weeklyReportSent: true,
      weeklyOptimizationDone: true,
      videoBriefingDone: true,
      videoEditedDone: true,
      creativeUploadedDone: true,
      lastResetDate: '2026-09-20 18:00'
    },

    // Histórico de Otimizações & Logs
    optimizationLogs: [
      {
        id: 'log_tc_1',
        date: '2026-09-19',
        time: '16:45',
        author: 'Gestor Flyto',
        note: 'Escala horizontal de campanhas de meio de funil. Pausados criativos com CTR abaixo de 1.2%. Adicionado orçamento em conjuntos lookalike C-Level.',
        roasAtTime: 4.8,
        adSpendAtTime: 12000,
        type: 'OTIMIZACAO'
      },
      {
        id: 'log_tc_2',
        date: '2026-09-15',
        time: '11:00',
        author: 'Gestor Flyto',
        note: 'Envio do relatório semanal executivo no WhatsApp corporativo. Faturamento acumulado atingiu R$ 57.600.',
        roasAtTime: 4.7,
        type: 'RELATORIO'
      }
    ],
    lastOptimizationNote: 'Escala horizontal de campanhas de meio de funil. Pausados criativos com CTR abaixo de 1.2%. Adicionado orçamento em conjuntos lookalike C-Level.',

    // Métricas Secundárias
    ctrAverage: 2.34,
    cpcAverage: 3.20,
    cpmAverage: 34.5,
    frequencyAverage: 1.82,
    funnelConversionRate: 8.6,
    activeCreativesCount: 14,
    metaBmId: 'BM_389201948102',
    metaAccountId: 'act_49201928471',

    // Status & Saúde
    status: 'ATIVO',
    relationshipHealth: 'EXCELENTE',
    ltvTotal: 17500.0,

    kickoffDate: '2026-02-05',
    onboardingSteps: [
      { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: '2026-02-01' },
      { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: true, completedAt: '2026-02-02' },
      { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: true, completedAt: '2026-02-03' },
      { id: 'step_4', label: 'Briefing Estratégico & ICP Respondido', done: true, completedAt: '2026-02-04' },
      { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: '2026-02-04' },
      { id: 'step_6', label: 'Reunião de Kick-off & Definição de Metas', done: true, completedAt: '2026-02-05' },
      { id: 'step_7', label: 'Subida da Primeira Campanha de Escala', done: true, completedAt: '2026-02-08' }
    ],

    // Central de Acessos
    accessVault: {
      id: 'vault_techcorp',
      clientId: 'cli_techcorp',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1TechCorpBrasil-Oficial',
      briefingText: 'Empresa focada em softwares ERP para médias indústrias. Ticket médio R$ 18.000/ano. Foco em decisores de tecnologia e diretores financeiros.',
      pixelId: '8839201948201',
      pixelName: 'TechCorp Lead & Demo Pixel',
      capiToken: 'EAAQ39...CAPI_SECURE_TOKEN_PROD',
      googleAdsId: '382-991-0492',
      siteUrl: 'https://techcorpbrasil.com.br',
      instagramUrl: 'https://instagram.com/techcorpbrasil',
      facebookUrl: 'https://facebook.com/techcorpbrasil',
      whatsappNumber: '(61) 98144-8800',
      metaLogin: 'mkt.techcorp@gmail.com',
      metaPassword: 'MetaTechSecure#2026!',
      googleLogin: 'ads@techcorpbrasil.com.br',
      googlePassword: 'GoogleGAds#Enterprise99',
      extraSites: [
        {
          id: 'site_1',
          siteName: 'Painel WordPress / Landing Pages',
          siteUrl: 'https://techcorpbrasil.com.br/wp-admin',
          username: 'admin_flyto',
          password: 'WP#TechCorp2026!$',
          notes: 'Acesso de administrador para subida de páginas no Elementor.'
        },
        {
          id: 'site_2',
          siteName: 'HubSpot CRM',
          siteUrl: 'https://app.hubspot.com/login',
          username: 'flyto.integracoes@techcorpbrasil.com.br',
          password: 'HubSpot#ApiSecure88',
          notes: 'Webhook de leads integrado.'
        }
      ],
      securityNotes: 'Autenticação 2 fatores via aplicativo no smartphone do diretor Henrique.',
      lastUpdated: '2026-09-18'
    }
  },

  {
    id: 'cli_camila_dermato',
    name: 'Dra. Camila Dermatologia & Estética Médica Ltda',
    tradeName: 'Dra. Camila Dermatologia',
    segment: 'Clínica Médica & Saúde High-Ticket',
    squadId: 'squad_beta',
    cnpj: '38.410.291/0001-44',
    city: 'Brasília',
    state: 'DF',
    owners: 'Dra. Camila Siqueira',
    phone: '(61) 99312-7000',
    email: 'contato@dracamiladermato.com.br',
    instagramHandle: '@dracamiladermato',
    websiteUrl: 'https://dracamiladermato.com.br',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1CamilaDermato-Oficial',

    plan: 'ESSENTIAL',
    monthlyFee: 1800.0,
    billingCycle: 'MENSAL',
    paymentMethod: 'PIX',
    contractStartDate: '2026-04-15',
    contractEndDate: '2026-10-15',

    budgetMonthly: 8500.0,
    monthlyAdSpend: 7500.0,
    revenueGenerated: 46500.0,
    currentRoas: 6.2,
    targetRoas: 5.0,

    // Saldo Meta
    metaBalance: {
      status: 'VERIFICAR',
      lastRechargeAmount: 2500.0,
      lastRechargeDate: '2026-09-14',
      lastVerifiedDate: '2026-09-20 18:00',
      notes: 'Saldo abaixo de R$ 300. Necessário gerar novo QR Code de R$ 2.500.'
    },

    // Rotina Semanal
    routine: {
      weeklyReportSent: true,
      weeklyOptimizationDone: true,
      videoBriefingDone: true,
      videoEditedDone: false,
      creativeUploadedDone: false,
      lastResetDate: '2026-09-20 18:00'
    },

    // REUNIÃO AGENDADA (Gera aviso destacado na tabela!)
    scheduledMeeting: {
      date: '2026-09-22 15:00',
      reason: 'Alinhamento Estratégico de Bioestimuladores & Escala',
      meetUrl: 'https://meet.google.com/qwa-flyto-camila',
      scheduledAt: '2026-09-19'
    },

    optimizationLogs: [
      {
        id: 'log_cam_1',
        date: '2026-09-20',
        time: '10:15',
        author: 'Gestor Flyto',
        note: 'Otimização semanal concluída. Lances de WhatsApp focados em público feminino 35-55 anos com renda A/B no Plano Piloto.',
        roasAtTime: 6.2,
        adSpendAtTime: 7500,
        type: 'OTIMIZACAO'
      }
    ],
    lastOptimizationNote: 'Otimização semanal concluída. Lances de WhatsApp focados em público feminino 35-55 anos com renda A/B no Plano Piloto.',

    ctrAverage: 3.12,
    cpcAverage: 2.10,
    cpmAverage: 42.0,
    frequencyAverage: 2.1,
    funnelConversionRate: 14.2,
    activeCreativesCount: 8,
    metaBmId: 'BM_882019482710',
    metaAccountId: 'act_1029384756',

    status: 'ATIVO',
    relationshipHealth: 'EXCELENTE',
    ltvTotal: 9000.0,

    kickoffDate: '2026-04-18',
    onboardingSteps: [
      { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: '2026-04-15' },
      { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: true, completedAt: '2026-04-16' },
      { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: true, completedAt: '2026-04-16' },
      { id: 'step_4', label: 'Briefing Estratégico & Linha Editorial', done: true, completedAt: '2026-04-17' },
      { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: '2026-04-17' },
      { id: 'step_6', label: 'Reunião de Kick-off', done: true, completedAt: '2026-04-18' },
      { id: 'step_7', label: 'Subida da Primeira Campanha de Captação', done: true, completedAt: '2026-04-21' }
    ],

    accessVault: {
      id: 'vault_camila',
      clientId: 'cli_camila_dermato',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1CamilaDermato-Oficial',
      briefingText: 'Clínica médica dermatológica. Procedimentos de rejuvenescimento facial, lasers e bioestimuladores. Comunicação elegante sem antes e depois sensacionalista.',
      pixelId: '4492019482910',
      pixelName: 'Dra Camila Agendamentos Pixel',
      capiToken: 'EAAQ88...CAMILA_CAPI_TOKEN',
      googleAdsId: '772-102-4910',
      siteUrl: 'https://dracamiladermato.com.br',
      instagramUrl: 'https://instagram.com/dracamiladermato',
      whatsappNumber: '(61) 99312-7000',
      metaLogin: 'anuncios@dracamiladermato.com.br',
      metaPassword: 'CamilaDermato#2026',
      extraSites: [
        {
          id: 'site_cam_1',
          siteName: 'Prontuário & Agendamento Conexa',
          siteUrl: 'https://conexa.com.br/login',
          username: 'dra.camila@dracamiladermato.com.br',
          password: 'ConexaMed#2026',
          notes: 'Apenas para checagem de horários vagos.'
        }
      ],
      securityNotes: 'Seguir diretrizes éticas da CODAME e CFM.',
      lastUpdated: '2026-09-17'
    }
  },

  {
    id: 'cli_lumina_decor',
    name: 'Lumina Móveis & Ambientes Planejados Ltda',
    tradeName: 'Lumina Decor Interiores',
    segment: 'E-commerce & Varejo Premium de Móveis',
    squadId: 'squad_alpha',
    cnpj: '29.381.092/0001-10',
    city: 'Goiânia',
    state: 'GO',
    owners: 'Marcelo Brandão',
    phone: '(62) 98290-1122',
    email: 'marcelo@luminadecor.com.br',
    instagramHandle: '@luminadecoroficial',
    websiteUrl: 'https://luminadecor.com.br',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1LuminaDecor-Oficial',

    plan: 'GROWTH',
    monthlyFee: 3200.0,
    billingCycle: 'MENSAL',
    paymentMethod: 'BOLETO',
    contractStartDate: '2026-01-10',
    contractEndDate: '2027-01-10',

    budgetMonthly: 25000.0,
    monthlyAdSpend: 20000.0,
    revenueGenerated: 102000.0,
    currentRoas: 5.1,
    targetRoas: 4.5,

    metaBalance: {
      status: 'PAGO',
      lastRechargeAmount: 10000.0,
      lastRechargeDate: '2026-09-16',
      lastVerifiedDate: '2026-09-20 18:00',
      notes: 'Cartão de crédito corporativo cadastrado com limite de R$ 30k.'
    },

    routine: {
      weeklyReportSent: true,
      weeklyOptimizationDone: true,
      videoBriefingDone: true,
      videoEditedDone: true,
      creativeUploadedDone: true,
      lastResetDate: '2026-09-20 18:00'
    },

    optimizationLogs: [
      {
        id: 'log_lum_1',
        date: '2026-09-18',
        time: '14:20',
        author: 'Gestor Flyto',
        note: 'Ativação do Catálogo Dinâmico Advantage+ para carrinhos abandonados acima de R$ 3.000. ROAS médio da campanha em 6.8x.',
        roasAtTime: 5.1,
        adSpendAtTime: 20000,
        type: 'OTIMIZACAO'
      }
    ],
    lastOptimizationNote: 'Ativação do Catálogo Dinâmico Advantage+ para carrinhos abandonados acima de R$ 3.000. ROAS médio da campanha em 6.8x.',

    ctrAverage: 1.95,
    cpcAverage: 1.85,
    cpmAverage: 28.0,
    frequencyAverage: 2.4,
    funnelConversionRate: 3.2,
    activeCreativesCount: 18,
    metaBmId: 'BM_901928374615',
    metaAccountId: 'act_9019283746',

    status: 'ATIVO',
    relationshipHealth: 'BOA',
    ltvTotal: 25600.0,

    kickoffDate: '2026-01-14',
    onboardingSteps: [
      { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: '2026-01-10' },
      { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: true, completedAt: '2026-01-11' },
      { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: true, completedAt: '2026-01-11' },
      { id: 'step_4', label: 'Briefing Estratégico & Catálogo de Produtos', done: true, completedAt: '2026-01-12' },
      { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: '2026-01-13' },
      { id: 'step_6', label: 'Reunião de Kick-off', done: true, completedAt: '2026-01-14' },
      { id: 'step_7', label: 'Configuração do Pixel CAPI na Shopify', done: true, completedAt: '2026-01-16' }
    ],

    accessVault: {
      id: 'vault_lumina',
      clientId: 'cli_lumina_decor',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1LuminaDecor-Oficial',
      briefingText: 'Móveis contemporâneos e design assinado. Foco em arquitetos, designers de interiores e proprietários de imóveis de luxo.',
      pixelId: '9019283746102',
      pixelName: 'Lumina Decor Purchase Pixel',
      capiToken: 'EAAQ22...LUMINA_SHOPIFY_CAPI',
      googleAdsId: '551-829-1920',
      siteUrl: 'https://luminadecor.com.br',
      instagramUrl: 'https://instagram.com/luminadecoroficial',
      whatsappNumber: '(62) 98290-1122',
      metaLogin: 'anuncios@luminadecor.com.br',
      metaPassword: 'Lumina#AdsSecret2026',
      extraSites: [
        {
          id: 'site_lum_1',
          siteName: 'Shopify Plus Admin',
          siteUrl: 'https://admin.shopify.com/store/lumina-decor',
          username: 'marketing@luminadecor.com.br',
          password: 'Shopify#Lumina2026',
          notes: 'Acesso completo a pedidos e catálogo.'
        }
      ],
      securityNotes: 'Catálogo sincronizado automaticamente via feed XML.',
      lastUpdated: '2026-09-15'
    }
  },

  {
    id: 'cli_vertice_eng',
    name: 'Vértice Engenharia & Empreendimentos Imobiliários S/A',
    tradeName: 'Vértice Engenharia & Imóveis',
    segment: 'Imobiliário & Lançamentos de Médio/Alto Padrão',
    squadId: 'squad_gamma',
    cnpj: '18.293.847/0001-90',
    city: 'Brasília',
    state: 'DF',
    owners: 'Guilherme Rezende & Paulo Albuquerque',
    phone: '(61) 98110-3344',
    email: 'comercial@verticeengenharia.com.br',
    instagramHandle: '@verticeengenharia',
    websiteUrl: 'https://verticeengenharia.com.br',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1VerticeEngenharia-Oficial',

    plan: 'ENTERPRISE',
    monthlyFee: 4000.0,
    billingCycle: 'MENSAL',
    paymentMethod: 'TRANSFERENCIA',
    contractStartDate: '2025-11-01',
    contractEndDate: '2026-11-01',

    budgetMonthly: 40000.0,
    monthlyAdSpend: 35000.0,
    revenueGenerated: 262500.0,
    currentRoas: 7.5,
    targetRoas: 6.0,

    metaBalance: {
      status: 'PENDENTE',
      lastRechargeAmount: 15000.0,
      lastRechargeDate: '2026-09-19',
      lastVerifiedDate: '2026-09-20 18:00',
      notes: 'Solicitação de recarga de R$ 15.000 enviada ao departamento financeiro.'
    },

    routine: {
      weeklyReportSent: true,
      weeklyOptimizationDone: true,
      videoBriefingDone: true,
      videoEditedDone: true,
      creativeUploadedDone: true,
      lastResetDate: '2026-09-20 18:00'
    },

    optimizationLogs: [
      {
        id: 'log_ver_1',
        date: '2026-09-20',
        time: '09:30',
        author: 'Gestor Flyto',
        note: 'Campanha de pré-lançamento do SkyLine Towers bateu recorde: mais de 300 leads qualificados a R$ 42 cada.',
        roasAtTime: 7.5,
        adSpendAtTime: 35000,
        type: 'OTIMIZACAO'
      }
    ],
    lastOptimizationNote: 'Campanha de pré-lançamento do SkyLine Towers bateu recorde: mais de 300 leads qualificados a R$ 42 cada.',

    ctrAverage: 2.85,
    cpcAverage: 1.45,
    cpmAverage: 38.0,
    frequencyAverage: 2.6,
    funnelConversionRate: 11.8,
    activeCreativesCount: 22,
    metaBmId: 'BM_119283746501',
    metaAccountId: 'act_1192837465',

    status: 'ATIVO',
    relationshipHealth: 'EXCELENTE',
    ltvTotal: 44000.0,

    kickoffDate: '2025-11-04',
    onboardingSteps: [
      { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: '2025-11-01' },
      { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: true, completedAt: '2025-11-02' },
      { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: true, completedAt: '2025-11-02' },
      { id: 'step_4', label: 'Briefing dos Empreendimentos & Tabela de Preços', done: true, completedAt: '2025-11-03' },
      { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: '2025-11-03' },
      { id: 'step_6', label: 'Reunião de Kick-off com Diretoria Comercial', done: true, completedAt: '2025-11-04' },
      { id: 'step_7', label: 'Integração Webhook de Leads com CRM Anapro', done: true, completedAt: '2025-11-06' }
    ],

    accessVault: {
      id: 'vault_vertice',
      clientId: 'cli_vertice_eng',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1VerticeEngenharia-Oficial',
      briefingText: 'Empreendimentos residenciais de luxo em Brasília (Noroeste e Águas Claras). Foco em famílias e investidores patrimoniais.',
      pixelId: '1192837465012',
      pixelName: 'Vértice Imóveis Leads Pixel',
      capiToken: 'EAAQ11...VERTICE_CAPI_TOKEN',
      googleAdsId: '991-283-4710',
      siteUrl: 'https://verticeengenharia.com.br',
      instagramUrl: 'https://instagram.com/verticeengenharia',
      whatsappNumber: '(61) 98110-3344',
      metaLogin: 'marketing@verticeengenharia.com.br',
      metaPassword: 'Vertice#MetaScale2026',
      extraSites: [
        {
          id: 'site_ver_1',
          siteName: 'CRM Imobiliário Anapro',
          siteUrl: 'https://anapro.com.br/login',
          username: 'gestao.flyto@verticeengenharia.com.br',
          password: 'Anapro#LeadFlow2026',
          notes: 'Webhook direto de conversão de leads.'
        }
      ],
      securityNotes: 'Leads integrados via Webhook Zapier diretamente na esteira dos corretores.',
      lastUpdated: '2026-09-19'
    }
  },

  {
    id: 'cli_prime_law',
    name: 'Grupo Prime Assessoria Jurídica Corporativa',
    tradeName: 'Grupo Prime Advocacia',
    segment: 'B2B / Assessoria Jurídica & Tributária',
    squadId: 'squad_beta',
    cnpj: '15.982.341/0001-55',
    city: 'Brasília',
    state: 'DF',
    owners: 'Dr. Leonardo Castelo Branco',
    phone: '(61) 99180-5522',
    email: 'contato@grupoprimeadv.com.br',
    instagramHandle: '@grupoprimeadv',
    websiteUrl: 'https://grupoprimeadv.com.br',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1PrimeLaw-Oficial',

    plan: 'ESSENTIAL',
    monthlyFee: 2000.0,
    billingCycle: 'MENSAL',
    paymentMethod: 'PIX',
    contractStartDate: '2026-06-01',
    contractEndDate: '2026-12-01',

    budgetMonthly: 6000.0,
    monthlyAdSpend: 5000.0,
    revenueGenerated: 19500.0,
    currentRoas: 3.9,
    targetRoas: 4.0,

    metaBalance: {
      status: 'PENDENTE',
      lastRechargeAmount: 2000.0,
      lastRechargeDate: '2026-09-10',
      lastVerifiedDate: '2026-09-20 18:00',
      notes: 'Aguardando aprovação do boleto pelo departamento financeiro.'
    },

    routine: {
      weeklyReportSent: false, // Pendente
      weeklyOptimizationDone: true,
      videoBriefingDone: true,
      videoEditedDone: true,
      creativeUploadedDone: false,
      lastResetDate: '2026-09-20 18:00'
    },

    optimizationLogs: [
      {
        id: 'log_pri_1',
        date: '2026-09-17',
        time: '15:10',
        author: 'Gestor Flyto',
        note: 'Foco em Google Ads Rede de Pesquisa para palavras de alta intenção comercial (advogado tributário empresas DF).',
        roasAtTime: 3.9,
        adSpendAtTime: 5000,
        type: 'OTIMIZACAO'
      }
    ],
    lastOptimizationNote: 'Foco em Google Ads Rede de Pesquisa para palavras de alta intenção comercial (advogado tributário empresas DF).',

    ctrAverage: 1.82,
    cpcAverage: 4.80,
    cpmAverage: 55.0,
    frequencyAverage: 1.5,
    funnelConversionRate: 7.2,
    activeCreativesCount: 6,
    metaBmId: 'BM_552019481920',
    metaAccountId: 'act_5520194819',

    status: 'ATIVO',
    relationshipHealth: 'BOA',
    ltvTotal: 8000.0,

    kickoffDate: '2026-06-05',
    onboardingSteps: [
      { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: '2026-06-01' },
      { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: true, completedAt: '2026-06-02' },
      { id: 'step_3', label: 'Vinculação de Conta Google Ads & GA4', done: true, completedAt: '2026-06-03' },
      { id: 'step_4', label: 'Briefing Estratégico & Validação OAB', done: true, completedAt: '2026-06-04' },
      { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: '2026-06-04' },
      { id: 'step_6', label: 'Reunião de Kick-off', done: true, completedAt: '2026-06-05' },
      { id: 'step_7', label: 'Subida de Campanhas no Google Ads Pesquisa', done: true, completedAt: '2026-06-08' }
    ],

    accessVault: {
      id: 'vault_prime',
      clientId: 'cli_prime_law',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1PrimeLaw-Oficial',
      briefingText: 'Assessoria jurídica empresarial especializada em planejamento tributário e recuperação de créditos para indústrias e distribuidoras.',
      pixelId: '5520194819203',
      pixelName: 'Prime Law B2B Pixel',
      googleAdsId: '882-391-0491',
      siteUrl: 'https://grupoprimeadv.com.br',
      instagramUrl: 'https://instagram.com/grupoprimeadv',
      whatsappNumber: '(61) 99180-5522',
      metaLogin: 'contato@grupoprimeadv.com.br',
      metaPassword: 'Prime#LawSecure2026',
      extraSites: [
        {
          id: 'site_pri_1',
          siteName: 'WordPress / Blog Jurídico',
          siteUrl: 'https://grupoprimeadv.com.br/wp-login.php',
          username: 'flyto_editor',
          password: 'WP#PrimeLaw99!',
          notes: 'Publicação de artigos de autoridade.'
        }
      ],
      securityNotes: 'Comunicação sóbria respeitando o provimento da OAB.',
      lastUpdated: '2026-09-12'
    }
  },

  {
    id: 'cli_apex_academy',
    name: 'Apex Academy Treinamentos & Cursos Online Ltda',
    tradeName: 'Apex Academy Cursos',
    segment: 'Infoproduto & Educação / Lançamentos & Perpétuo',
    squadId: 'squad_alpha',
    cnpj: '44.829.102/0001-33',
    city: 'Brasília',
    state: 'DF',
    owners: 'Thiago Moura',
    phone: '(61) 98440-9911',
    email: 'contato@apexacademy.com.br',
    instagramHandle: '@apexacademybr',
    websiteUrl: 'https://apexacademy.com.br',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1ApexAcademy-Oficial',

    plan: 'GROWTH',
    monthlyFee: 2800.0,
    billingCycle: 'MENSAL',
    paymentMethod: 'PIX',
    contractStartDate: '2026-08-15',
    contractEndDate: '2027-02-15',

    budgetMonthly: 20000.0,
    monthlyAdSpend: 18000.0,
    revenueGenerated: 79200.0,
    currentRoas: 4.4,
    targetRoas: 4.0,

    metaBalance: {
      status: 'PAGO',
      lastRechargeAmount: 8000.0,
      lastRechargeDate: '2026-09-17',
      lastVerifiedDate: '2026-09-20 18:00',
      notes: 'Cartão corporativo pré-pago recarregado.'
    },

    routine: {
      weeklyReportSent: true,
      weeklyOptimizationDone: true,
      videoBriefingDone: true,
      videoEditedDone: true,
      creativeUploadedDone: true,
      lastResetDate: '2026-09-20 18:00'
    },

    // REUNIÃO AGENDADA (Gera aviso na linha)
    scheduledMeeting: {
      date: '2026-09-24 10:30',
      reason: 'Revisão do Funil de Webinar Automático',
      meetUrl: 'https://meet.google.com/ape-flyto-scale',
      scheduledAt: '2026-09-20'
    },

    optimizationLogs: [
      {
        id: 'log_ape_1',
        date: '2026-09-20',
        time: '11:40',
        author: 'Gestor Flyto',
        note: 'Funil perpétuo de webinar automático com taxa de presença de 58% e conversão de checkout em 11%. Criativos dinâmicos de quebra de objeção ativados.',
        roasAtTime: 4.4,
        adSpendAtTime: 18000,
        type: 'OTIMIZACAO'
      }
    ],
    lastOptimizationNote: 'Funil perpétuo de webinar automático com taxa de presença de 58% e conversão de checkout em 11%. Criativos dinâmicos de quebra de objeção ativados.',

    ctrAverage: 3.45,
    cpcAverage: 0.95,
    cpmAverage: 24.0,
    frequencyAverage: 3.1,
    funnelConversionRate: 4.8,
    activeCreativesCount: 16,
    metaBmId: 'BM_774920194812',
    metaAccountId: 'act_7749201948',

    status: 'ATIVO',
    relationshipHealth: 'EXCELENTE',
    ltvTotal: 5600.0,

    kickoffDate: '2026-08-20',
    onboardingSteps: [
      { id: 'step_1', label: 'Contrato de Assessoria Assinado', done: true, completedAt: '2026-08-15' },
      { id: 'step_2', label: 'Acesso de Parceiro ao Meta Business Manager', done: true, completedAt: '2026-08-16' },
      { id: 'step_3', label: 'Vinculação de Conta Google Ads & YouTube', done: true, completedAt: '2026-08-17' },
      { id: 'step_4', label: 'Briefing do Funil de Vendas & Oferta', done: true, completedAt: '2026-08-18' },
      { id: 'step_5', label: 'Pasta Compartilhada no Google Drive', done: true, completedAt: '2026-08-19' },
      { id: 'step_6', label: 'Reunião de Kick-off & Cronograma de Tráfego', done: true, completedAt: '2026-08-20' },
      { id: 'step_7', label: 'Configuração da API de Conversões Hotmart', done: true, completedAt: '2026-08-22' }
    ],

    accessVault: {
      id: 'vault_apex',
      clientId: 'cli_apex_academy',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1ApexAcademy-Oficial',
      briefingText: 'Treinamentos de alta performance para gestores e líderes. Lançamentos semestrais e funil perpétuo rodando 24/7.',
      pixelId: '7749201948120',
      pixelName: 'Apex Academy Hotmart Pixel',
      capiToken: 'EAAQ55...APEX_HOTMART_CAPI',
      googleAdsId: '331-992-4819',
      siteUrl: 'https://apexacademy.com.br',
      instagramUrl: 'https://instagram.com/apexacademybr',
      whatsappNumber: '(61) 98440-9911',
      metaLogin: 'trafego@apexacademy.com.br',
      metaPassword: 'Apex#ScaleGrowth2026',
      extraSites: [
        {
          id: 'site_ape_1',
          siteName: 'Hotmart Club / Área de Membros',
          siteUrl: 'https://app.hotmart.com',
          username: 'admin@apexacademy.com.br',
          password: 'Hotmart#ApexScale2026',
          notes: 'Webhook configurado para disparo de compra aprovada.'
        }
      ],
      securityNotes: 'API de conversões Hotmart via Webhook oficial.',
      lastUpdated: '2026-09-16'
    }
  }
];
