import React, { useState } from 'react';
import { Database, Copy, Check, X } from 'lucide-react';

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaViewerModal: React.FC<SchemaViewerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const schemaContent = `// ============================================================================
// FLYTOHUB — SCHEMA DE BANCO DE DADOS (PRISMA ORM)
// Sistema ERP/CRM e Command Center Central da Assessoria Flyto
// Arquitetura preparada para PostgreSQL (Supabase) com suporte a histórico completo
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ----------------------------------------------------------------------------
// ENUMS DO SISTEMA
// ----------------------------------------------------------------------------

enum UserRole {
  ADMIN              // Acesso total a contratos, financeiro e configurações
  TRAFFIC_MANAGER    // Foco em ROAS, campanhas, otimizações 72h e checklists
  SOCIAL_MEDIA       // Foco em auditoria Instagram, criativos e captação
  CS_ATTENDANT       // Foco em onboarding, saúde do cliente, avisos prévios e reuniões
}

enum ClientStatus {
  ONBOARDING         // Em fase de integração (Welcome e Kick-off)
  ATIVO              // Operação rodando normalmente
  AVISO_PREVIO       // Em aviso prévio de cancelamento (30 dias)
  INATIVO            // Contrato finalizado / Churn
}

enum HealthRelationship {
  MUITO_BOA          // Cliente promotor, comunicação ágil e alto engajamento
  BOA                // Relacionamento saudável e alinhado
  MEDIA              // Atenção pontual necessária em reuniões ou entregas
  RUIM               // Risco de insatisfação ou atrito na comunicação
  MUITO_RUIM         // Alerta vermelho crítico / Risco iminente de Churn
}

enum PlanType {
  STARTER            // R$ 500/mês — Gestão de Anúncios + Otimização 72h + Sistemas + Relatórios (Vídeos do cliente)
  ESSENTIAL          // R$ 650/mês — Destaque 3 Estrelas: Gestão + Otimização + Criativos Semanais + Relatórios
  GROWTH             // R$ 1.000/mês — Destaque Diamante: Gestão + Landing Page + Edição de Vídeos + Dashboards
  CUSTOM             // Contrato personalizado ou serviços sob demanda adicionais
}

enum BillingCycle {
  MENSAL
  TRIMESTRAL
  SEMESTRAL
  ANUAL
}

enum PaymentMethod {
  PIX
  CARTAO
  BOLETO
  TRANSFERENCIA
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum CaptureStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  RESCHEDULED
}

// ----------------------------------------------------------------------------
// 1. USUÁRIOS E PERMISSÕES INTERNAS
// ----------------------------------------------------------------------------

model User {
  id              String           @id @default(cuid())
  email           String           @unique
  name            String
  role            UserRole         @default(TRAFFIC_MANAGER)
  avatarUrl       String?
  isActive        Boolean          @default(true)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  auditsInstagram AuditInstagram[]
  auditsMenu      AuditMenu[]
  tasksAssigned   ActionTask[]     @relation("AssignedTasks")
  vaultAudits     AccessVaultLog[]

  @@map("users")
}

// ----------------------------------------------------------------------------
// 2. MÓDULO CORE: GESTÃO DE CLIENTES E CONTRATOS
// ----------------------------------------------------------------------------

model Client {
  id                 String             @id @default(cuid())
  
  // Dados Base
  name               String             // Razão Social ou Nome de Registro
  tradeName          String             // Nome Fantasia (ex: "Burguer Prime")
  segment            String             // Nicho Gastronômico (Hamburgueria, Pizzaria, etc.)
  cnpj               String?            @unique
  city               String             // Cidade (ex: "Brasília")
  state              String             // UF (ex: "DF")
  address            String?
  owners             String             // Dono(s) e contatos principais
  phone              String             // WhatsApp principal para contato rápido
  email              String?            // E-mail de faturamento/comercial
  instagramHandle    String?            // @ do Instagram oficial
  websiteUrl         String?            // Site ou Link da Bio
  
  openingHours       String             // Ex: "18:00 às 23:30"
  businessDays       String             // Ex: "Terça a Domingo"

  // Contrato e Financeiro (Planos Oficiais Flyto)
  plan               PlanType           @default(ESSENTIAL)
  customServices     String[]           @default([])
  paymentMethod      PaymentMethod      @default(PIX)
  billingCycle       BillingCycle       @default(MENSAL)
  monthlyFee         Decimal            @db.Decimal(10, 2)
  contractStartDate  DateTime           
  contractEndDate    DateTime           

  // Status e Saúde do Cliente
  status             ClientStatus       @default(ONBOARDING)
  relationshipHealth HealthRelationship @default(BOA)
  ltvTotal           Decimal            @default(0.00) @db.Decimal(12, 2)
  currentRoas        Float              @default(0.0)

  // Operação Semanal Rápida
  dailyCheckDone     Boolean            @default(false)
  weeklyReportSent   Boolean            @default(false)
  creativeDelivered  Boolean            @default(false)
  callDone           Boolean            @default(false)

  // Onboarding e Retenção (Churn)
  welcomeDate        DateTime?          
  kickoffDate        DateTime?          // "Tempo Rodando" conta após Kick-off
  noticeDate         DateTime?          
  terminationDate    DateTime?          
  churnReason        String?            @db.Text
  churnObservation   String?            @db.Text

  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  // Relacionamentos 1:N
  accessVault        AccessVault?       
  accessVaultLogs    AccessVaultLog[]   
  captureSchedules   CaptureSchedule[]  
  auditsInstagram    AuditInstagram[]   
  auditsMenu         AuditMenu[]        
  actionTasks        ActionTask[]       
  weeklyOperations   WeeklyOperation[]  

  @@map("clients")
}

// ----------------------------------------------------------------------------
// 3. MÓDULO DE SEGURANÇA: COFRE DE ACESSOS (PROTEGIDO)
// ----------------------------------------------------------------------------

model AccessVault {
  id               String           @id @default(cuid())
  clientId         String           @unique
  client           Client           @relation(fields: [clientId], references: [id], onDelete: Cascade)

  facebookLogin    String?
  facebookPassword String?
  facebookBmId     String?

  instagramLogin   String?
  instagramPassword String?

  menuProvider     String?          // "Goomer", "Anota AI", etc.
  menuLogin        String?
  menuPassword     String?

  ifoodLogin       String?
  ifoodPassword    String?
  ifoodMerchantId  String?

  emailLogin       String?
  emailPassword    String?

  securityNotes    String?          @db.Text
  lastRotatedAt    DateTime?
  updatedAt        DateTime         @updatedAt

  @@map("access_vaults")
}

model AccessVaultLog {
  id          String   @id @default(cuid())
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action      String   
  credential  String   
  timestamp   DateTime @default(now())

  @@map("access_vault_logs")
}

// ----------------------------------------------------------------------------
// 4. MÓDULO DE LOGÍSTICA: CAPTAÇÃO DE MATERIAL AUDIOVISUAL
// ----------------------------------------------------------------------------

model CaptureSchedule {
  id              String        @id @default(cuid())
  clientId        String
  client          Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)

  lastCaptureDate DateTime?     
  nextCaptureDate DateTime      // Alerta visual se < 7 dias
  photographer    String?       
  location        String?       
  status          CaptureStatus @default(SCHEDULED)
  briefingNotes   String?       @db.Text

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("capture_schedules")
}

// ----------------------------------------------------------------------------
// 5. MÓDULO DE QUALIDADE: MOTOR DE AUDITORIA GAMIFICADA
// ----------------------------------------------------------------------------

model AuditInstagram {
  id                  String       @id @default(cuid())
  clientId            String
  client              Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  auditedById         String?
  auditedBy           User?        @relation(fields: [auditedById], references: [id], onDelete: SetNull)

  postFrequency       Int          // 1-5 (Se <= 2 -> gera Task calendário)
  visualQuality       Int          
  cookingVideos       Int          // 1-5 (Se <= 2 -> gera Task vídeos preparo)
  captionClarity      Int          // 1-5 (Se <= 2 -> gera Task copies gastronômicas)
  organizedHighlights Int          

  overallScore        Float        
  notes               String?      @db.Text
  auditedAt           DateTime     @default(now())

  tasks               ActionTask[]

  @@map("audits_instagram")
}

model AuditMenu {
  id                     String       @id @default(cuid())
  clientId               String
  client                 Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  auditedById            String?
  auditedBy              User?        @relation(fields: [auditedById], references: [id], onDelete: SetNull)

  easyAccessLink         Int          // 1-5 (Se <= 2 -> gera Task link da bio)
  attractiveDesign       Int          
  realAppealingPhotos    Int          // 1-5 (Se <= 2 -> gera Task fotos reais)
  clearProductDescription Int         // 1-5 (Se <= 2 -> gera Task descrições e preços)
  menuQuality            Int          

  overallScore           Float        
  notes                  String?      @db.Text
  auditedAt              DateTime     @default(now())

  tasks                  ActionTask[]

  @@map("audits_menu")
}

// ----------------------------------------------------------------------------
// 6. FILA DE TAREFAS GERADAS PELO PLANO DE AÇÃO
// ----------------------------------------------------------------------------

model ActionTask {
  id                String          @id @default(cuid())
  clientId          String
  client            Client          @relation(fields: [clientId], references: [id], onDelete: Cascade)

  title             String          
  description       String?         @db.Text
  category          String          
  generatedByRule   String?         
  priority          TaskPriority    @default(MEDIUM)
  status            TaskStatus      @default(PENDING)

  auditInstagramId  String?
  auditInstagram    AuditInstagram? @relation(fields: [auditInstagramId], references: [id], onDelete: SetNull)
  auditMenuId       String?
  auditMenu         AuditMenu?      @relation(fields: [auditMenuId], references: [id], onDelete: SetNull)

  assignedToId      String?
  assignedTo        User?           @relation("AssignedTasks", fields: [assignedToId], references: [id], onDelete: SetNull)

  dueDate           DateTime?
  completedAt       DateTime?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@map("action_tasks")
}

// ----------------------------------------------------------------------------
// 7. OPERAÇÕES SEMANAIS (ERP ANALÍTICO)
// ----------------------------------------------------------------------------

model WeeklyOperation {
  id                String   @id @default(cuid())
  clientId          String
  client            Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)

  weekStartDate     DateTime 
  dailyCheckDone    Boolean  @default(false)
  weeklyReportSent  Boolean  @default(false)
  creativeDelivered Boolean  @default(false)
  callDone          Boolean  @default(false)
  roasRecorded      Float?   
  notes             String?  @db.Text

  createdAt         DateTime @default(now())

  @@unique([clientId, weekStartDate])
  @@map("weekly_operations")
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1513] border border-[#202C28] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1C2824] bg-[#141C19]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#182320] border border-[#263732] flex items-center justify-center text-[#6bea56]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
                <span>Prisma ORM Schema Completo (Parte 1)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/40 font-mono">
                  PostgreSQL / Supabase Ready
                </span>
              </h3>
              <p className="text-[11px] text-[#6E817C]">
                prisma/schema.prisma — Todas as entidades mapeadas com suporte a histórico completo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2f9b20] hover:bg-[#277e1b] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Schema'}</span>
            </button>

            <button onClick={onClose} className="text-[#6E817C] hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#080C0B] font-mono text-xs text-[#8EA09B] leading-relaxed">
          <pre className="whitespace-pre-wrap">{schemaContent}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#1C2824] bg-[#0F1513] flex items-center justify-between text-xs text-[#6E817C]">
          <span>Arquivo localizado em: <code className="text-white font-mono">FlytoHUB/prisma/schema.prisma</code></span>
          <span className="text-[#6bea56] font-semibold">100% Compatível com Supabase Database</span>
        </div>

      </div>
    </div>
  );
};
