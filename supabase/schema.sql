
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABELA DE CLIENTES DA ASSESSORIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY DEFAULT ('cli_' || gen_random_uuid()),
    name TEXT NOT NULL,
    trade_name TEXT NOT NULL,
    segment TEXT NOT NULL,
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
-- 7. BLINDAGEM MÁXIMA DE SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Ativar RLS em 100% das tabelas. Mesmo se alguém tentar consultar a API diretamente,
-- o Postgres recusará o acesso se a requisição não for de um gestor autenticado da Flyto!

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS: Apenas usuários autenticados da Flyto têm permissão de leitura e escrita
CREATE POLICY "Permitir acesso completo apenas para gestores autenticados da Flyto"
    ON public.clients FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir acesso aos leads apenas para equipe autenticada"
    ON public.leads FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir acesso as indicacoes apenas para equipe autenticada"
    ON public.referral_deals FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir acesso aos logs de auditoria apenas para equipe autenticada"
    ON public.audit_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir acesso aos avisos gerais apenas para equipe autenticada"
    ON public.team_announcements FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir acesso as calls apenas para equipe autenticada"
    ON public.team_calls FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir acesso aos estudos apenas para equipe autenticada"
    ON public.study_materials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
