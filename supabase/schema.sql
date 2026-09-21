
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABELA DE SQUADS DA ASSESSORIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.squads (
    id TEXT PRIMARY KEY DEFAULT ('squad_' || gen_random_uuid()),
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#00FF66',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. TABELA DE COLABORADORES & USUÁRIOS (RBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT ('usr_' || gen_random_uuid()),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'TRAFFIC_MANAGER', -- 'ADMIN', 'TRAFFIC_MANAGER', 'COMMERCIAL', 'SOCIAL_MEDIA'
    squad_id TEXT REFERENCES public.squads(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'PENDENTE_APROVACAO', -- 'APROVADO', 'PENDENTE_APROVACAO', 'SUSPENSO'
    avatar_url TEXT,
    phone TEXT,
    cnpj TEXT,
    contract_url TEXT,
    warnings JSONB DEFAULT '[]'::jsonb,
    instagram_handle TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ==============================================================================
-- 3. TABELA DE CLIENTES DA ASSESSORIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY DEFAULT ('cli_' || gen_random_uuid()),
    name TEXT NOT NULL,
    trade_name TEXT NOT NULL,
    segment TEXT NOT NULL,
    squad_id TEXT REFERENCES public.squads(id) ON DELETE SET NULL,
    cnpj TEXT,
    city TEXT DEFAULT 'Brasília',
    state TEXT DEFAULT 'DF',
    owners TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    drive_folder_url TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'GROWTH',
    monthly_fee NUMERIC(12, 2) NOT NULL DEFAULT 2500.00,
    billing_cycle TEXT NOT NULL DEFAULT 'MENSAL',
    payment_method TEXT NOT NULL DEFAULT 'PIX',
    contract_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    contract_end_date DATE,
    budget_monthly NUMERIC(12, 2) NOT NULL DEFAULT 10000.00,
    monthly_ad_spend NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    revenue_generated NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    current_roas NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    target_roas NUMERIC(6, 2) NOT NULL DEFAULT 4.50,
    meta_balance_status TEXT NOT NULL DEFAULT 'VERIFICAR',
    meta_balance_last_recharge_amount NUMERIC(12, 2) DEFAULT 0.00,
    meta_balance_last_recharge_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'ATIVO', -- 'ATIVO', 'PAUSADO', 'CANCELADO', 'ONBOARDING'
    relationship_health TEXT NOT NULL DEFAULT 'EXCELENTE',
    ltv_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_trade_name ON public.clients(trade_name);

-- ==============================================================================
-- 3. TABELA DE LEADS & OPORTUNIDADES (CRM COMERCIAL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT ('lead_' || gen_random_uuid()),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    segment TEXT NOT NULL,
    estimated_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    proposed_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    source TEXT NOT NULL DEFAULT 'TRAFEGO_PAGO',
    status TEXT NOT NULL DEFAULT 'NOVO', -- 'NOVO', 'QUALIFICADO', 'REUNIAO_AGENDADA', 'PROPOSTA_ENVIADA', 'FECHADO', 'PERDIDO'
    meeting_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- ==============================================================================
-- 4. TABELA DE INDICAÇÕES & PARCERIAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.referral_deals (
    id TEXT PRIMARY KEY DEFAULT ('ref_' || gen_random_uuid()),
    partner_name TEXT NOT NULL,
    partner_type TEXT NOT NULL, -- 'PARCEIRO_EXTERNO', 'CLIENTE', 'COLABORADOR'
    partner_contact TEXT,
    referred_client_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    segment TEXT NOT NULL,
    contract_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    commission_type TEXT NOT NULL DEFAULT 'FIXO', -- 'FIXO', 'PERCENTUAL'
    commission_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    commission_total_brl NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'EM_NEGOCIACAO', -- 'EM_NEGOCIACAO', 'CONTRATO_FECHADO', 'COMISSAO_PAGA', 'PERDIDO'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABELA DE AUDITORIA & LOGS DA EQUIPE (SUPERVISÃO)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('audit_' || gen_random_uuid()),
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    module TEXT NOT NULL, -- 'GESTOR', 'COMERCIAL', 'ONBOARDING', 'ACESSOS', 'INDICACOES', 'ESTUDOS'
    action_type TEXT NOT NULL, -- 'CRIACAO', 'EDICAO', 'STATUS', 'EXCLUSAO', 'REUNIAO', 'RECARGA'
    entity_name TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON public.audit_logs(module);

-- ==============================================================================
-- 6. TABELAS DE TREINAMENTO, AVISOS & CALLS DE EQUIPE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_announcements (
    id TEXT PRIMARY KEY DEFAULT ('ann_' || gen_random_uuid()),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'IMPORTANTE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_calls (
    id TEXT PRIMARY KEY DEFAULT ('call_' || gen_random_uuid()),
    title TEXT NOT NULL,
    agenda TEXT,
    call_date TIMESTAMPTZ NOT NULL,
    meet_url TEXT NOT NULL,
    host_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AGENDADA', -- 'AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_materials (
    id TEXT PRIMARY KEY DEFAULT ('mat_' || gen_random_uuid()),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    instructor TEXT,
    description TEXT,
    duration TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. TABELAS DE GAMIFICAÇÃO, TAREFAS, SERVIÇOS & NOTIFICAÇÕES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.goal_events (
    id TEXT PRIMARY KEY DEFAULT ('goal_' || gen_random_uuid()),
    title TEXT NOT NULL,
    description TEXT,
    target_type TEXT NOT NULL DEFAULT 'VENDAS', -- 'VENDAS', 'ROAS', 'RENOVACOES'
    target_value NUMERIC(12, 2) NOT NULL DEFAULT 500000.00,
    prize TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ATIVO',
    squad_scores JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creative_tasks (
    id TEXT PRIMARY KEY DEFAULT ('task_' || gen_random_uuid()),
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    title TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'REELS_VIDEO',
    status TEXT NOT NULL DEFAULT 'ROTEIRO',
    priority TEXT NOT NULL DEFAULT 'MEDIA',
    due_date DATE,
    drive_assets_url TEXT,
    briefing_notes TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.one_off_services (
    id TEXT PRIMARY KEY DEFAULT ('srv_' || gen_random_uuid()),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_contact TEXT,
    scope TEXT NOT NULL,
    briefing TEXT,
    delivery_date DATE,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_status TEXT NOT NULL DEFAULT 'PENDENTE',
    delivery_status TEXT NOT NULL DEFAULT 'BRIEFING',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT ('notif_' || gen_random_uuid()),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    type TEXT NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. BLINDAGEM MÁXIMA DE SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.one_off_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Permitir acesso total a squads para equipe autenticada" ON public.squads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso a usuarios para equipe autenticada" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a clientes para gestores autenticados" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso aos leads apenas para equipe autenticada" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso as indicacoes apenas para equipe autenticada" ON public.referral_deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso aos logs de auditoria apenas para equipe autenticada" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso aos avisos gerais apenas para equipe autenticada" ON public.team_announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso as calls apenas para equipe autenticada" ON public.team_calls FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso aos estudos apenas para equipe autenticada" ON public.study_materials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso aos eventos de metas para equipe autenticada" ON public.goal_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso a criativos para equipe autenticada" ON public.creative_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso a servicos avulsos para equipe autenticada" ON public.one_off_services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso a notificacoes para equipe autenticada" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

