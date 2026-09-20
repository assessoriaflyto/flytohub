import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  FolderOpen, 
  ExternalLink, 
  ArrowRight,
  Edit3,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { ClientData } from '../../types/hub';
import { formatDateBR, formatBRL } from '../../utils/formatters';

interface OnboardingDashboardProps {
  clients: ClientData[];
  onToggleStep: (clientId: string, stepId: string) => void;
  onActivateClient: (clientId: string) => void;
  onOpenEditDriveModal: (client: ClientData) => void;
}

export const OnboardingDashboard: React.FC<OnboardingDashboardProps> = ({
  clients,
  onToggleStep,
  onActivateClient,
  onOpenEditDriveModal
}) => {
  // Clientes com status ONBOARDING
  const onboardingClients = clients.filter(c => c.status === 'ONBOARDING');
  // Clientes já ativos
  const activeClients = clients.filter(c => c.status === 'ATIVO');

  // Estado para controlar qual cliente está expandido (se null, todos podem estar recolhidos ou expandidos)
  const [expandedClientId, setExpandedClientId] = useState<string | null>(
    onboardingClients.length > 0 ? onboardingClients[0].id : null
  );

  // Tab interna: Em Implantação vs Ativados
  const [activeTabFilter, setActiveTabFilter] = useState<'PENDING' | 'DONE'>('PENDING');

  const handleToggleExpand = (id: string) => {
    setExpandedClientId(prev => prev === id ? null : id);
  };

  const handleConfirmActivate = (client: ClientData) => {
    const steps = client.onboardingSteps || [];
    const pendingCount = steps.filter(s => !s.done).length;
    if (pendingCount > 0) {
      const confirmMove = window.confirm(
        `O cliente "${client.tradeName}" ainda possui ${pendingCount} etapas pendentes de setup.\n\nDeseja mover para ATIVO mesmo assim e iniciar a gestão de tráfego agora?`
      );
      if (!confirmMove) return;
    }
    onActivateClient(client.id);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Header do Onboarding */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs beam-border-slow">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1F2124] border border-emerald-200 dark:border-[#2D3035] flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Central de Implantação & Onboarding Técnico
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#696969]">
                Controle flexível de setups: ative ou pause etapas sem travar o painel
              </p>
            </div>
          </div>
        </div>

        {/* Seletor de visualização */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121315] p-1 rounded-xl border border-slate-200 dark:border-[#25282C]">
          <button
            onClick={() => setActiveTabFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'PENDING'
                ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Em Implantação ({onboardingClients.length})
          </button>
          <button
            onClick={() => setActiveTabFilter('DONE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'DONE'
                ? 'bg-white dark:bg-[#1F2124] text-[#277e1b] dark:text-[#00FF66] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ativos no Tráfego ({activeClients.length})
          </button>
        </div>
      </div>

      {/* 2. Visualização: Clientes em Implantação */}
      {activeTabFilter === 'PENDING' && (
        <>
          {onboardingClients.length === 0 ? (
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-[#277e1b] dark:text-[#00FF66] mx-auto opacity-80" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum cliente pendente de onboarding</h3>
              <p className="text-xs text-slate-500 dark:text-[#696969] max-w-md mx-auto">
                Todos os contratos foram implantados e estão ativos no tráfego pago. Ao fechar uma oportunidade no Comercial, ela aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {onboardingClients.map((client) => {
                const steps = client.onboardingSteps || [];
                const doneSteps = steps.filter(s => s.done).length;
                const progress = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0;
                const isExpanded = expandedClientId === client.id;
                const isAllDone = steps.length > 0 && doneSteps === steps.length;

                return (
                  <div 
                    key={client.id} 
                    className={`bg-white dark:bg-[#181A1D] border rounded-2xl transition-all shadow-xs overflow-hidden ${
                      isExpanded 
                        ? 'border-emerald-300 dark:border-emerald-700/60 ring-2 ring-emerald-500/10' 
                        : 'border-slate-200 dark:border-[#2D3035] hover:border-slate-300 dark:hover:border-[#3A3E45]'
                    }`}
                  >
                    {/* Linha Resumo do Card */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-black text-slate-900 dark:text-white">{client.tradeName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1F2124] text-slate-600 dark:text-[#A0AEC0] font-semibold border border-slate-200 dark:border-[#2D3035]">
                            {client.segment}
                          </span>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/30">
                            Onboarding em Andamento
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-[#8E959E] mt-1.5">
                          <span>Contrato: <strong>{formatDateBR(client.contractStartDate)}</strong></span>
                          <span>&middot;</span>
                          <span>Fee: <strong className="text-slate-900 dark:text-white">{formatBRL(client.monthlyFee)}/mês</strong></span>
                          <span>&middot;</span>
                          <span>Budget Meta: <strong className="text-slate-900 dark:text-white">{formatBRL(client.budgetMonthly)}</strong></span>
                        </div>

                        {/* Barra de Progresso Compacta */}
                        <div className="mt-3 max-w-md">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-600 dark:text-[#A0AEC0]">
                              {doneSteps} de {steps.length} etapas concluídas
                            </span>
                            <span className="font-black text-[#277e1b] dark:text-[#00FF66] tabular-nums">{progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#121315] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-600 to-[#00C853] dark:from-emerald-500 dark:to-[#00FF66] rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação do Card */}
                      <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#25282C]">
                        <button
                          onClick={() => onOpenEditDriveModal(client)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-600 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#2D3035] transition-colors cursor-pointer"
                          title="Alterar pasta do Google Drive"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={client.driveFolderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-[#277e1b] dark:text-[#00FF66] border border-slate-200 dark:border-[#2D3035] transition-colors flex items-center gap-1.5"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Drive</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>

                        {/* Botão de Expandir / Recolher Checklist */}
                        <button
                          onClick={() => handleToggleExpand(client.id)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-700 dark:text-white border border-slate-200 dark:border-[#2D3035] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Recolher Checklist' : 'Continuar Onboarding'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {/* Botão de Ativar Cliente (acessível mesmo se faltar etapa, com confirmação) */}
                        <button
                          onClick={() => handleConfirmActivate(client)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isAllDone
                              ? 'bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90'
                              : 'bg-emerald-600/90 dark:bg-[#00FF66]/80 text-white dark:text-[#07130E] hover:opacity-95'
                          }`}
                          title="Finalizar implantação e liberar no Gestor de Tráfego"
                        >
                          <span>Mover para Ativo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detalhes Expandidos: Checklist Interativo */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-[#121315]/70 border-t border-slate-200 dark:border-[#2D3035] space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">
                            Etapas de Implantação Técnica (Clique para marcar/desmarcar conforme for realizando):
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-[#696969]">
                            Progresso salvo em tempo real
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {steps.map((step) => (
                            <button
                              key={step.id}
                              onClick={() => onToggleStep(client.id, step.id)}
                              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                                step.done
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 text-slate-900 dark:text-white'
                                  : 'bg-white dark:bg-[#181A1D] border-slate-200 dark:border-[#2D3035] text-slate-600 dark:text-[#8E959E] hover:border-slate-300 dark:hover:border-[#3A3E45]'
                              }`}
                            >
                              {step.done ? (
                                <CheckCircle2 className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66] shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 dark:text-[#4D4D4D] shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className={`text-xs block font-bold ${step.done ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-[#A0AEC0]'}`}>
                                  {step.label}
                                </span>
                                {step.completedAt && (
                                  <span className="text-[10px] text-emerald-700 dark:text-[#00FF66] block mt-0.5">
                                    Concluído em: {formatDateBR(step.completedAt)}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Barra Informativa Inferior */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] text-xs">
                          <span className="text-slate-600 dark:text-[#A0AEC0]">
                            {isAllDone ? (
                              <strong className="text-emerald-700 dark:text-[#00FF66]">
                                Excelente! Todas as 7 etapas foram finalizadas.
                              </strong>
                            ) : (
                              <>Você pode pausar e continuar a qualquer momento. Restam <strong>{steps.length - doneSteps} etapas</strong>.</>
                            )}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleExpand(client.id)}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] cursor-pointer"
                            >
                              Fechar Checklist
                            </button>
                            <button
                              onClick={() => handleConfirmActivate(client)}
                              className="px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 cursor-pointer flex items-center gap-1"
                            >
                              <span>Ativar Cliente</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* 3. Visualização: Clientes Já Ativos */}
      {activeTabFilter === 'DONE' && (
        <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Clientes com Setup Concluído & Ativos no Gestor</h3>
            <span className="text-xs text-slate-500 dark:text-[#696969]">{activeClients.length} contas ativas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeClients.map((client) => (
              <div 
                key={client.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{client.tradeName}</span>
                  <span className="w-2 h-2 rounded-full bg-[#277e1b] dark:bg-[#00FF66]" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#8E959E] flex items-center justify-between">
                  <span>{client.segment}</span>
                  <span className="font-bold text-slate-700 dark:text-white">{formatBRL(client.monthlyFee)}/mês</span>
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-[#00FF66] font-medium flex items-center gap-1 pt-1 border-t border-slate-200 dark:border-[#25282C]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Setup e Onboarding Concluídos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
