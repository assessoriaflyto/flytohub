// ============================================================================
// FLYTOHUB — SERVIÇOS AVULSOS (SEM MENSALIDADE: SITES, APPS, AUTOMAÇÕES)
// ============================================================================
import { OneOffService } from '../types/hub';

export const INITIAL_ONE_OFF_SERVICES: OneOffService[] = [
  {
    id: 'serv_1',
    title: 'Landing Page de Alta Conversão + CAPI',
    clientName: 'Dra. Camila Siqueira',
    clientContact: '(61) 99312-7000',
    scope: 'Criação de Landing Page em Next.js para captação de procedimentos corporais de alto padrão, com formulário integrado via Webhook no WhatsApp e Meta Conversions API (CAPI).',
    briefing: 'Cores sofisticadas off-white e dourado discreto. Seção de antes e depois com termos adequados ao CFM. Prova social com depoimentos em vídeo.',
    deliveryDate: '2026-09-25',
    price: 3200.0,
    paymentStatus: 'ENTRADA_50',
    deliveryStatus: 'DESENVOLVIMENTO',
    notes: 'Entrada de R$ 1.600 paga via PIX. Restante na homologação final.',
    createdAt: '2026-09-16'
  },
  {
    id: 'serv_2',
    title: 'Automação de CRM & Notificação no WhatsApp',
    clientName: 'TechCorp Brasil',
    clientContact: '(61) 98144-8800',
    scope: 'Fluxo em n8n conectando formulários de anúncios do Meta Ads e Google Ads diretamente na esteira de pré-vendas (HubSpot) com envio instantâneo de alerta sonoro e mensagem no WhatsApp comercial.',
    briefing: 'Tempo de resposta ao lead inferior a 2 minutos. Notificar vendedor de plantão conforme rodízio de atendentes.',
    deliveryDate: '2026-09-23',
    price: 2500.0,
    paymentStatus: 'PAGO',
    deliveryStatus: 'REVISAO',
    notes: 'Testes de disparo com 10 leads de homologação concluídos com 100% de sucesso.',
    createdAt: '2026-09-14'
  },
  {
    id: 'serv_3',
    title: 'Aplicativo PWA de Catálogo Interativo',
    clientName: 'Lumina Decor Interiores',
    clientContact: '(62) 98290-1122',
    scope: 'Desenvolvimento de aplicativo web progressivo (PWA) para os vendedores do showroom apresentarem o catálogo 3D de sofás e mesas em iPads aos clientes da loja física.',
    briefing: 'Modo offline com sincronização diária. Integração com banco de imagens em alta definição e botão "Solicitar Orçamento no WhatsApp".',
    deliveryDate: '2026-10-10',
    price: 6800.0,
    paymentStatus: 'ENTRADA_50',
    deliveryStatus: 'DESENVOLVIMENTO',
    notes: 'Layout aprovado pelo diretor Marcelo Brandão.',
    createdAt: '2026-09-18'
  },
  {
    id: 'serv_4',
    title: 'E-commerce Headless Shopify',
    clientName: 'Aura Joalheria',
    clientContact: '(61) 98115-9944',
    scope: 'Refatoração da loja virtual na Shopify Plus para arquitetura ultra veloz, com checkout transparente e integração de pixels do Meta, TikTok e GA4.',
    briefing: 'Carregamento abaixo de 1.2 segundos no mobile. Filtro inteligente de pedras e metais preciosos.',
    deliveryDate: '2026-09-30',
    price: 5500.0,
    paymentStatus: 'PENDENTE',
    deliveryStatus: 'BRIEFING',
    notes: 'Aguardando envio dos arquivos de alta resolução das joias.',
    createdAt: '2026-09-19'
  }
];
