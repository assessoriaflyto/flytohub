import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  FolderOpen, 
  ExternalLink, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  Flame,
  CalendarDays
} from 'lucide-react';
import { CreativeTask, CreativeStatus, CreativeFormat, TaskPriority, ClientData } from '../../types/hub';
import { SEASONAL_CALENDAR_EVENTS } from '../../data/mockSeasonalCalendar';
import { formatDateBR } from '../../utils/formatters';

interface SocialMediaDashboardProps {
  tasks: CreativeTask[];
  clients: ClientData[];
  onUpdateTaskStatus: (taskId: string, newStatus: CreativeStatus) => void;
  onAddTask: (task: Omit<CreativeTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenEditDriveModal: (client: ClientData) => void;
}

export const SocialMediaDashboard: React.FC<SocialMediaDashboardProps> = ({
  tasks,
  clients,
  onUpdateTaskStatus,
  onAddTask,
  onDeleteTask,
  onOpenEditDriveModal
}) => {
  const currentMonthNumber = new Date().getMonth() + 1; // 1 a 12 (Setembro = 9)
  const [activeCalendarMonth, setActiveCalendarMonth] = useState<number>(currentMonthNumber || 9);
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal de Nova Demanda
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [format, setFormat] = useState<CreativeFormat>('REELS_VIDEO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIA');
  const [dueDate, setDueDate] = useState('');
  const [briefingNotes, setBriefingNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('Lucas Videomaker');

  const filteredTasks = tasks.filter(t => {
    if (selectedFormat !== 'ALL' && t.format !== selectedFormat) return false;
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
    return true;
  });

  const monthNames = [
    { num: 1, name: 'Jan' },
    { num: 2, name: 'Fev' },
    { num: 3, name: 'Mar' },
    { num: 4, name: 'Abr' },
    { num: 5, name: 'Mai' },
    { num: 6, name: 'Jun' },
    { num: 7, name: 'Jul' },
    { num: 8, name: 'Ago' },
    { num: 9, name: 'Set' },
    { num: 10, name: 'Out' },
    { num: 11, name: 'Nov' },
    { num: 12, name: 'Dez' }
  ];

  const monthEvents = SEASONAL_CALENDAR_EVENTS.filter(e => e.month === activeCalendarMonth);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetClient = clients.find(c => c.id === clientId) || clients[0];

    onAddTask({
      clientId: targetClient.id,
      clientName: targetClient.tradeName,
      title,
      format,
      status: 'ROTEIRO',
      priority,
      dueDate: dueDate || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      briefingNotes,
      assignedTo,
      driveAssetsUrl: targetClient.driveFolderUrl
    });

    setTitle('');
    setBriefingNotes('');
    setIsModalOpen(false);
  };

  const getFormatLabel = (fmt: CreativeFormat) => {
    switch (fmt) {
      case 'REELS_VIDEO': return 'Reels / Vídeo';
      case 'CARROSSEL': return 'Carrossel';
      case 'ESTATICO': return 'Anúncio Estático';
      case 'STORY_INTERATIVO': return 'Story';
      case 'COPY_CAMPANHA': return 'Copy / Roteiro';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Header do Social Media */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl shadow-sm beam-border-slow">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
            <span>Social Media & Produção Audiovisual</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#696969] mt-0.5">
            Fila de criativos, briefing e calendário sazonal anual de campanhas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Demanda</span>
        </button>
      </div>

      {/* 2. CALENDÁRIO SAZONAL ANUAL (JANEIRO A DEZEMBRO) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#277e1b] dark:text-[#00FF66]" />
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Calendário Sazonal de Marketing (12 Meses)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#696969]">
                Oportunidades estratégicas do comércio e e-commerce brasileiro para antecipar criativos
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#1F2124] text-slate-700 dark:text-[#00FF66] border border-slate-200 dark:border-[#2D3035]">
            Mês Ativo: {monthNames.find(m => m.num === activeCalendarMonth)?.name}
          </span>
        </div>

        {/* Seletor dos 12 Meses (Abas Elegantes) */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 p-1 bg-slate-50 dark:bg-[#121315] rounded-xl border border-slate-200 dark:border-[#25282C]">
          {monthNames.map((m) => {
            const isSelected = activeCalendarMonth === m.num;
            const isCurrent = currentMonthNumber === m.num;

            return (
              <button
                key={m.num}
                onClick={() => setActiveCalendarMonth(m.num)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center relative cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-[#00FF66] text-white dark:text-[#07130E] shadow-sm'
                    : 'text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-200/60 dark:hover:bg-[#1F2124]'
                }`}
              >
                <span>{m.name}</span>
                {isCurrent && (
                  <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 dark:bg-[#07130E]' : 'bg-[#277e1b] dark:bg-[#00FF66]'}`} title="Mês Atual" />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid de Datas & Oportunidades do Mês Selecionado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {monthEvents.length === 0 ? (
            <div className="col-span-full p-8 text-center text-xs text-slate-400 dark:text-[#696969] bg-slate-50 dark:bg-[#121315] rounded-xl border border-dashed border-slate-200 dark:border-[#2D3035]">
              Nenhum evento registrado para este mês.
            </div>
          ) : (
            monthEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  evt.highlighted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/50'
                    : 'bg-slate-50/60 dark:bg-[#1F2124]/50 border-slate-200 dark:border-[#2D3035]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#8E959E] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#277e1b] dark:text-[#00FF66]" />
                      {String(evt.day).padStart(2, '0')}/{String(evt.month).padStart(2, '0')}
                    </span>
                    {evt.highlighted && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 dark:bg-[#00FF66] text-white dark:text-[#07130E] flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" />
                        Alta Conversão
                      </span>
                    )}
                  </div>
                  <strong className="text-xs font-black text-slate-900 dark:text-white block">
                    {evt.title}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-[#A0AEC0] mt-1 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-[#2D3035] text-[10px] text-[#277e1b] dark:text-[#00FF66] font-semibold">
                  Ação: {evt.suggestedAction}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* 3. Tabela de Fila de Produção */}
      <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl overflow-hidden shadow-sm">
        
        {/* Filtros de Status */}
        <div className="p-3.5 border-b border-slate-200 dark:border-[#2D3035] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#696969] mr-1">Status:</span>
          {['ALL', 'ROTEIRO', 'GRAVACAO', 'EDICAO', 'APROVACAO', 'AGENDADO', 'PUBLICADO'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-slate-900 dark:bg-[#00FF66] text-white dark:text-[#07130E] shadow-xs'
                  : 'text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124]'
              }`}
            >
              {st === 'ALL' ? 'Todos' : st}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#121315] border-b border-slate-200 dark:border-[#2D3035] text-[11px] font-extrabold uppercase text-slate-500 dark:text-[#696969] tracking-wider">
                <th className="py-3.5 px-4">Cliente & Criativo</th>
                <th className="py-3.5 px-3">Formato</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Prioridade</th>
                <th className="py-3.5 px-3">Entrega</th>
                <th className="py-3.5 px-3">Responsável</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#25282C] text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-[#696969]">
                    Nenhuma demanda de criativo encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-[#1F2124] transition-colors">
                    
                    {/* Cliente & Título */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 dark:text-white font-bold text-xs block">
                        {t.title}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                        {t.clientName}
                      </span>
                    </td>

                    {/* Formato */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-[#1F2124] text-slate-700 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#2D3035]">
                        {getFormatLabel(t.format)}
                      </span>
                    </td>

                    {/* Status com Seletor Rápido */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as CreativeStatus)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                      >
                        <option value="ROTEIRO">Roteiro</option>
                        <option value="GRAVACAO">Gravação</option>
                        <option value="EDICAO">Edição</option>
                        <option value="APROVACAO">Aprovação</option>
                        <option value="AGENDADO">Agendado</option>
                        <option value="PUBLICADO">Publicado</option>
                      </select>
                    </td>

                    {/* Prioridade */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold ${
                        t.priority === 'URGENTE' ? 'text-rose-600 dark:text-rose-400' :
                        t.priority === 'ALTA' ? 'text-amber-600 dark:text-amber-400' :
                        'text-slate-500 dark:text-[#8E959E]'
                      }`}>
                        {t.priority}
                      </span>
                    </td>

                    {/* Prazo no formato Brasileiro DD/MM/AAAA */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-700 dark:text-[#A0AEC0]">
                      {formatDateBR(t.dueDate)}
                    </td>

                    {/* Responsável */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-[#8E959E]">
                      {t.assignedTo}
                    </td>

                    {/* Ação */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.driveAssetsUrl && (
                          <a
                            href={t.driveAssetsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#8E959E] dark:hover:text-[#00FF66] transition-colors"
                            title="Abrir pasta no Drive"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:text-[#8E959E] dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Excluir demanda"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação de Demanda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Criar Nova Demanda de Conteúdo</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#8E959E] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Título da Demanda *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Reels Institucional - Diferenciais de Atendimento"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00FF66]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Cliente *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.tradeName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Formato</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as CreativeFormat)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="REELS_VIDEO">Reels / Vídeo 4K</option>
                    <option value="CARROSSEL">Carrossel Editorial</option>
                    <option value="ESTATICO">Anúncio Estático</option>
                    <option value="STORY_INTERATIVO">Story Interativo</option>
                    <option value="COPY_CAMPANHA">Copy / Roteiro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Prazo de Entrega</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Briefing / Instruções</label>
                <textarea
                  rows={3}
                  value={briefingNotes}
                  onChange={(e) => setBriefingNotes(e.target.value)}
                  placeholder="Instruções para o editor ou videomaker, referências e gancho..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1F2124] border border-slate-200 dark:border-[#2D3035] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-90"
                >
                  Adicionar Demanda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
