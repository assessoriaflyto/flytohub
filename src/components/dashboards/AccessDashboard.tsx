import React, { useState } from 'react';
import { 
  KeyRound, 
  Search, 
  FolderOpen, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  Lock, 
  Server, 
  Edit3, 
  Plus, 
  Trash2, 
  FileText, 
  Save, 
  MessageCircle, 
  Activity, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Database,
  Layers
} from 'lucide-react';
import { ClientData, AccessVaultData, ExtraSiteAccess } from '../../types/hub';
import { formatDateBR } from '../../utils/formatters';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface AccessDashboardProps {
  clients: ClientData[];
  onOpenEditDriveModal: (client: ClientData) => void;
  onUpdateClientVault?: (clientId: string, updatedVault: Partial<AccessVaultData>) => void;
}

export const AccessDashboard: React.FC<AccessDashboardProps> = ({
  clients,
  onOpenEditDriveModal,
  onUpdateClientVault
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Inicia nulo para mostrar todos os cards dos clientes primeiro!
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<{ [key: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Estado local para briefing
  const [editingBriefing, setEditingBriefing] = useState<{ [clientId: string]: string }>({});
  const [savedBriefingNotif, setSavedBriefingNotif] = useState<string | null>(null);

  // Estado local para adicionar novo site extra
  const [isAddingExtraSite, setIsAddingExtraSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSiteNotes, setNewSiteNotes] = useState('');

  const filteredClients = clients.filter(c =>
    c.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClient = selectedClientId ? clients.find(c => c.id === selectedClientId) : null;

  const toggleReveal = (key: string) => {
    setRevealedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string | undefined, keyName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveBriefing = (clientId: string) => {
    const textToSave = editingBriefing[clientId] !== undefined 
      ? editingBriefing[clientId] 
      : activeClient?.accessVault?.briefingText || '';

    if (onUpdateClientVault) {
      onUpdateClientVault(clientId, { briefingText: textToSave, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    setSavedBriefingNotif(clientId);
    setTimeout(() => setSavedBriefingNotif(null), 2500);
  };

  const handleAddExtraSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient || !newSiteName.trim()) return;

    const newExtra: ExtraSiteAccess = {
      id: `extra_${Date.now()}`,
      siteName: newSiteName.trim(),
      siteUrl: newSiteUrl.trim().startsWith('http') ? newSiteUrl.trim() : `https://${newSiteUrl.trim()}`,
      username: newUsername.trim(),
      password: newPassword.trim(),
      notes: newSiteNotes.trim()
    };

    const currentExtras = activeClient.accessVault.extraSites || [];
    const updatedExtras = [...currentExtras, newExtra];

    if (onUpdateClientVault) {
      onUpdateClientVault(activeClient.id, { 
        extraSites: updatedExtras,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }

    setNewSiteName('');
    setNewSiteUrl('');
    setNewUsername('');
    setNewPassword('');
    setNewSiteNotes('');
    setIsAddingExtraSite(false);
  };

  const handleDeleteExtraSite = (extraId: string) => {
    if (!activeClient) return;
    const currentExtras = activeClient.accessVault.extraSites || [];
    const updatedExtras = currentExtras.filter(e => e.id !== extraId);

    if (onUpdateClientVault) {
      onUpdateClientVault(activeClient.id, { 
        extraSites: updatedExtras,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header da Central de Acessos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-sm beam-border-slow">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-[#00FF66]/10 border border-emerald-500/20 dark:border-[#00FF66]/20 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Central de Acessos, Rastreamento & Briefing
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#696969] mt-0.5">
                Cofre executivo com Pixel IDs, CAPI, contas de anúncio, briefing estratégico e credenciais seguras
              </p>
            </div>
          </div>
        </div>

        {/* Busca rápida */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#696969] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente ou segmento..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] focus:border-emerald-500 dark:focus:border-[#00FF66]/60 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#696969] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* 2. VISÃO GERAL: GRID DE TODOS OS CLIENTES (QUANDO NENHUM ESTÁ ABERTO) */}
      {!activeClient ? (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#696969]">
              Selecione um cliente para abrir o cofre de acessos ({filteredClients.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => {
              const v = client.accessVault;
              const hasPixel = Boolean(v.pixelId);
              const hasCapi = Boolean(v.capiToken);
              const hasGads = Boolean(v.googleAdsId);
              const extraCount = v.extraSites?.length || 0;

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] hover:border-[#277e1b]/40 dark:hover:border-[#00FF66]/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Topo do Card */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#25282C]">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#277e1b] to-emerald-600 dark:from-[#00FF66] dark:to-emerald-600 flex items-center justify-center text-white dark:text-[#07130E] font-black text-sm shadow-xs">
                          {client.tradeName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#277e1b] dark:group-hover:text-[#00FF66] transition-colors">
                            {client.tradeName}
                          </h3>
                          <span className="text-[11px] text-slate-500 dark:text-[#696969] block">
                            {client.segment}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#277e1b] dark:group-hover:text-[#00FF66] transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </div>

                    {/* Resumo de Conexões */}
                    <div className="grid grid-cols-2 gap-2 my-3.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-100 dark:border-[#25282C] flex items-center justify-between">
                        <span className="text-slate-500 dark:text-[#696969]">Meta Pixel:</span>
                        <span className={`font-bold ${hasPixel ? 'text-[#277e1b] dark:text-[#00FF66]' : 'text-slate-400 dark:text-[#4D4D4D]'}`}>
                          {hasPixel ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-100 dark:border-[#25282C] flex items-center justify-between">
                        <span className="text-slate-500 dark:text-[#696969]">Meta CAPI:</span>
                        <span className={`font-bold ${hasCapi ? 'text-[#277e1b] dark:text-[#00FF66]' : 'text-slate-400 dark:text-[#4D4D4D]'}`}>
                          {hasCapi ? 'Configurado' : 'Pendente'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-100 dark:border-[#25282C] flex items-center justify-between">
                        <span className="text-slate-500 dark:text-[#696969]">Google Ads:</span>
                        <span className={`font-bold ${hasGads ? 'text-[#277e1b] dark:text-[#00FF66]' : 'text-slate-400 dark:text-[#4D4D4D]'}`}>
                          {hasGads ? 'Vinculado' : 'Pendente'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-100 dark:border-[#25282C] flex items-center justify-between">
                        <span className="text-slate-500 dark:text-[#696969]">Sites Extras:</span>
                        <span className="font-bold text-slate-800 dark:text-white">
                          {extraCount} cadastrado{extraCount === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botão de Abertura */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#25282C] text-xs">
                    <span className="text-[10px] text-slate-400 dark:text-[#696969]">
                      Atualizado em: {formatDateBR(v.lastUpdated)}
                    </span>
                    <span className="text-xs font-bold text-[#277e1b] dark:text-[#00FF66] inline-flex items-center gap-1">
                      <span>Abrir Acessos</span>
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 3. VISÃO DETALHADA DO CLIENTE SELECIONADO */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Botão Voltar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedClientId(null)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] text-slate-700 dark:text-[#A0AEC0] hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Todos os Clientes</span>
            </button>

            <span className="text-xs text-slate-500 dark:text-[#696969]">
              Visualizando cofre exclusivo de: <strong className="text-slate-900 dark:text-white">{activeClient.tradeName}</strong>
            </span>
          </div>

          {/* Card Topo: Identidade & Links Diretos */}
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#277e1b] to-emerald-600 dark:from-[#00FF66] dark:to-emerald-600 flex items-center justify-center text-white dark:text-[#07130E] font-black text-xl shadow-md">
                  {activeClient.tradeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {activeClient.tradeName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-[#00FF66] border border-emerald-200 dark:border-emerald-800">
                      {activeClient.segment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#696969] mt-1 flex items-center gap-2">
                    <span>Responsável: {activeClient.owners}</span>
                    <span>&bull;</span>
                    <span>Email: {activeClient.email || 'Não informado'}</span>
                  </p>
                </div>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="flex flex-wrap items-center gap-2">
                {activeClient.accessVault.siteUrl && (
                  <a
                    href={activeClient.accessVault.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-[#1F2124] hover:bg-slate-100 dark:hover:bg-[#25282C] text-slate-700 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#2D3035] transition-all inline-flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                )}

                {activeClient.accessVault.whatsappNumber && (
                  <a
                    href={`https://wa.me/${activeClient.accessVault.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-[#00FF66] border border-emerald-200 dark:border-[#2D3035] transition-all inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                )}

                {activeClient.accessVault.instagramUrl && (
                  <a
                    href={activeClient.accessVault.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-[#1F2124] hover:bg-slate-100 dark:hover:bg-[#25282C] text-slate-700 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#2D3035] transition-all inline-flex items-center gap-1.5"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                    <span>Instagram</span>
                  </a>
                )}

                <a
                  href={activeClient.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#277e1b] hover:opacity-95 text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Google Drive</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={() => onOpenEditDriveModal(activeClient)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#1F2124] hover:bg-slate-200 dark:hover:bg-[#25282C] text-slate-600 dark:text-[#696969] hover:text-slate-900 dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                  title="Alterar link da pasta no Google Drive"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Grid de 2 Colunas: Briefing + Rastreamento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Coluna 1: Briefing Estratégico */}
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Briefing Estratégico & Diretrizes
                  </h4>
                </div>
                {savedBriefingNotif === activeClient.id && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-[#00FF66] flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" /> Salvo com sucesso!
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-[#696969]">
                Informações chave sobre o modelo de negócio, persona (ICP), propostas de valor e tom de voz para anúncios.
              </p>

              <textarea
                rows={7}
                value={
                  editingBriefing[activeClient.id] !== undefined
                    ? editingBriefing[activeClient.id]
                    : activeClient.accessVault.briefingText || ''
                }
                onChange={(e) =>
                  setEditingBriefing(prev => ({ ...prev, [activeClient.id]: e.target.value }))
                }
                placeholder="Insira as diretrizes estratégicas do cliente, público-alvo, promessa principal e notas de campanha..."
                className="w-full p-3.5 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs font-medium text-slate-800 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#696969] focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66] transition-all resize-none leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveBriefing(activeClient.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Briefing</span>
                </button>
              </div>
            </div>

            {/* Coluna 2: Rastreamento (Pixel, CAPI, Google Ads) */}
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Rastreamento & Conversões
                </h4>
              </div>

              <div className="space-y-3">
                {/* Meta Pixel ID & Nome */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-[10px] font-black text-slate-500 dark:text-[#696969] uppercase tracking-wider block">
                      Meta Pixel ID ({activeClient.accessVault.pixelName || 'Pixel Principal'})
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white text-xs font-bold">
                      {activeClient.accessVault.pixelId || 'Não cadastrado'}
                    </span>
                  </div>
                  {activeClient.accessVault.pixelId && (
                    <button
                      onClick={() => copyToClipboard(activeClient.accessVault.pixelId, `pixel_${activeClient.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                      title="Copiar Pixel ID"
                    >
                      {copiedKey === `pixel_${activeClient.id}` ? <Check className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Meta Conversions API (CAPI) */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-[10px] font-black text-slate-500 dark:text-[#696969] uppercase tracking-wider block">
                      Token CAPI (Meta Conversions API)
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white text-xs">
                      {revealedKeys[`capi_${activeClient.id}`]
                        ? (activeClient.accessVault.capiToken || 'Não configurado')
                        : (activeClient.accessVault.capiToken ? '••••••••••••••••••••••••••••••••' : 'Não configurado')}
                    </span>
                  </div>
                  {activeClient.accessVault.capiToken && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleReveal(`capi_${activeClient.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-white transition-colors cursor-pointer"
                        title={revealedKeys[`capi_${activeClient.id}`] ? 'Ocultar' : 'Visualizar'}
                      >
                        {revealedKeys[`capi_${activeClient.id}`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(activeClient.accessVault.capiToken, `capi_${activeClient.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                        title="Copiar Token CAPI"
                      >
                        {copiedKey === `capi_${activeClient.id}` ? <Check className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Google Ads ID */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-[10px] font-black text-slate-500 dark:text-[#696969] uppercase tracking-wider block">
                      Google Ads Account ID
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white text-xs font-bold">
                      {activeClient.accessVault.googleAdsId || 'Não vinculado'}
                    </span>
                  </div>
                  {activeClient.accessVault.googleAdsId && (
                    <button
                      onClick={() => copyToClipboard(activeClient.accessVault.googleAdsId, `gads_${activeClient.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                      title="Copiar ID Google Ads"
                    >
                      {copiedKey === `gads_${activeClient.id}` ? <Check className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Meta BM & Conta */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-[10px] font-black text-slate-500 dark:text-[#696969] uppercase tracking-wider block">
                      Meta BM & Conta de Anúncios
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white text-xs">
                      BM: {activeClient.metaBmId || 'N/A'} &middot; Conta: {activeClient.metaAccountId || 'N/A'}
                    </span>
                  </div>
                  {activeClient.metaBmId && (
                    <button
                      onClick={() => copyToClipboard(activeClient.metaBmId, `bm_${activeClient.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                      title="Copiar ID da BM"
                    >
                      {copiedKey === `bm_${activeClient.id}` ? <Check className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Grid de 2 Colunas: Logins Master + Sites Extras / Ferramentas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Coluna 1: Logins de Contingência / Master */}
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Logins Master & Contingência
                </h4>
              </div>

              <div className="space-y-3">
                
                {/* Meta Login */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 dark:text-[#696969] uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-blue-500" />
                      Login Facebook / Meta
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleReveal(`meta_pwd_${activeClient.id}`)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {revealedKeys[`meta_pwd_${activeClient.id}`] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(activeClient.accessVault.metaPassword, `cp_meta_${activeClient.id}`)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                        title="Copiar Senha"
                      >
                        {copiedKey === `cp_meta_${activeClient.id}` ? <Check className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs font-mono">
                    <p className="text-slate-800 dark:text-white font-semibold">{activeClient.accessVault.metaLogin || 'Sem login cadastrado'}</p>
                    <p className="text-slate-500 dark:text-[#A0AEC0] mt-0.5">
                      {revealedKeys[`meta_pwd_${activeClient.id}`]
                        ? (activeClient.accessVault.metaPassword || '••••••••')
                        : '••••••••••••'}
                    </p>
                  </div>
                </div>

                {/* Google Login */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 dark:text-[#696969] uppercase tracking-wider flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-amber-500" />
                      Login Google Workspace / Ads
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleReveal(`google_pwd_${activeClient.id}`)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {revealedKeys[`google_pwd_${activeClient.id}`] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(activeClient.accessVault.googlePassword, `cp_google_${activeClient.id}`)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                        title="Copiar Senha"
                      >
                        {copiedKey === `cp_google_${activeClient.id}` ? <Check className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs font-mono">
                    <p className="text-slate-800 dark:text-white font-semibold">{activeClient.accessVault.googleLogin || 'Não configurado'}</p>
                    <p className="text-slate-500 dark:text-[#A0AEC0] mt-0.5">
                      {revealedKeys[`google_pwd_${activeClient.id}`]
                        ? (activeClient.accessVault.googlePassword || '••••••••')
                        : '••••••••••••'}
                    </p>
                  </div>
                </div>

                {/* Notas de Segurança */}
                {activeClient.accessVault.securityNotes && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] flex items-start gap-2 text-xs text-slate-600 dark:text-[#A0AEC0]">
                    <ShieldCheck className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66] shrink-0 mt-0.5" />
                    <p>{activeClient.accessVault.securityNotes}</p>
                  </div>
                )}

              </div>
            </div>

            {/* Coluna 2: Gerenciador de Sites Extras & Plataformas */}
            <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Sites Extras & Ferramentas
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingExtraSite(!isAddingExtraSite)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-[#00FF66] border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Acesso</span>
                </button>
              </div>

              {/* Formulário para Adicionar Site Extra */}
              {isAddingExtraSite && (
                <form onSubmit={handleAddExtraSite} className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-emerald-500/30 dark:border-[#00FF66]/30 space-y-3 animate-fadeIn">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Cadastrar Nova Plataforma / Site</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-[#696969] block mb-1">Nome do Site *</label>
                      <input
                        type="text"
                        required
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                        placeholder="Ex: Hotmart, Shopify, RD"
                        className="w-full px-3 py-1.5 bg-white dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-[#696969] block mb-1">URL de Acesso</label>
                      <input
                        type="text"
                        value={newSiteUrl}
                        onChange={(e) => setNewSiteUrl(e.target.value)}
                        placeholder="https://app.exemplo.com"
                        className="w-full px-3 py-1.5 bg-white dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-[#696969] block mb-1">Usuário / Email</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="admin@cliente.com"
                        className="w-full px-3 py-1.5 bg-white dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-[#696969] block mb-1">Senha</label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Senha de acesso"
                        className="w-full px-3 py-1.5 bg-white dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-[#696969] block mb-1">Observações / Instruções de Acesso</label>
                    <input
                      type="text"
                      value={newSiteNotes}
                      onChange={(e) => setNewSiteNotes(e.target.value)}
                      placeholder="Ex: Código 2FA vai no WhatsApp do diretor"
                      className="w-full px-3 py-1.5 bg-white dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingExtraSite(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-200 dark:hover:bg-[#121315]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                    >
                      Salvar Acesso
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Sites Extras */}
              <div className="space-y-2.5">
                {(!activeClient.accessVault.extraSites || activeClient.accessVault.extraSites.length === 0) ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-[#2D3035] text-center text-xs text-slate-400 dark:text-[#696969]">
                    Nenhum site externo ou plataforma extra cadastrado para este cliente.
                  </div>
                ) : (
                  activeClient.accessVault.extraSites.map((site) => (
                    <div key={site.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] flex items-center justify-between gap-3">
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{site.siteName}</span>
                          {site.siteUrl && (
                            <a
                              href={site.siteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-[#277e1b] dark:text-[#00FF66] hover:underline flex items-center gap-0.5"
                            >
                              <span>Acessar</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 dark:text-[#A0AEC0] mt-0.5">
                          <span>User: {site.username || 'N/A'}</span>
                          {site.password && (
                            <>
                              <span>&middot;</span>
                              <span>
                                {revealedKeys[`site_${site.id}`] ? site.password : '••••••••'}
                              </span>
                            </>
                          )}
                        </div>
                        {site.notes && (
                          <p className="text-[10px] text-slate-400 dark:text-[#696969] mt-0.5 italic">{site.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {site.password && (
                          <button
                            onClick={() => toggleReveal(`site_${site.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-white transition-colors cursor-pointer"
                            title={revealedKeys[`site_${site.id}`] ? 'Ocultar' : 'Visualizar'}
                          >
                            {revealedKeys[`site_${site.id}`] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        {site.password && (
                          <button
                            onClick={() => copyToClipboard(site.password, `cp_site_${site.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#696969] dark:hover:text-[#00FF66] transition-colors cursor-pointer"
                            title="Copiar Senha"
                          >
                            {copiedKey === `cp_site_${site.id}` ? <Check className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteExtraSite(site.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:text-[#696969] dark:hover:text-red-400 transition-colors cursor-pointer"
                          title="Remover acesso"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
