import React, { useState } from 'react';
import { 
  GraduationCap, 
  Video, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  BookOpen, 
  Megaphone, 
  Edit3, 
  X, 
  Tag, 
  Share2,
  PlayCircle
} from 'lucide-react';
import { StudyMaterial, StudyCategory, TeamCall, TeamAnnouncement, TeamCallStatus } from '../../types/hub';
import { formatDateTimeBR, formatDateBR } from '../../utils/formatters';

interface TrainingAndAlignmentDashboardProps {
  announcement: TeamAnnouncement;
  teamCalls: TeamCall[];
  studyMaterials: StudyMaterial[];
  onUpdateAnnouncement: (announcement: TeamAnnouncement) => void;
  onAddTeamCall: (call: Omit<TeamCall, 'id'>) => void;
  onUpdateCallStatus: (id: string, status: TeamCallStatus) => void;
  onAddStudyMaterial: (material: Omit<StudyMaterial, 'id'>) => void;
}

export const TrainingAndAlignmentDashboard: React.FC<TrainingAndAlignmentDashboardProps> = ({
  announcement,
  teamCalls,
  studyMaterials,
  onUpdateAnnouncement,
  onAddTeamCall,
  onUpdateCallStatus,
  onAddStudyMaterial
}) => {
  // Filtro de categorias do acervo
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | StudyCategory>('ALL');

  // Modais
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [isNewCallOpen, setIsNewCallOpen] = useState(false);
  const [isNewMaterialOpen, setIsNewMaterialOpen] = useState(false);

  // Form Aviso
  const [annTitle, setAnnTitle] = useState(announcement.title);
  const [annMessage, setAnnMessage] = useState(announcement.message);
  const [annPriority, setAnnPriority] = useState(announcement.priority);

  // Form Call
  const [callTitle, setCallTitle] = useState('');
  const [callAgenda, setCallAgenda] = useState('');
  const [callDate, setCallDate] = useState(new Date().toISOString().split('T')[0]);
  const [callTime, setCallTime] = useState('09:00');
  const [callMeetUrl, setCallMeetUrl] = useState('https://meet.google.com/');
  const [callHost, setCallHost] = useState('Lucas Mendonça');

  // Form Material
  const [matTitle, setMatTitle] = useState('');
  const [matCategory, setMatCategory] = useState<StudyCategory>('TRAFEGO_PAGO');
  const [matUrl, setMatUrl] = useState('');
  const [matInstructor, setMatInstructor] = useState('');
  const [matDuration, setMatDuration] = useState('');
  const [matDescription, setMatDescription] = useState('');
  const [matTags, setMatTags] = useState('');

  // Copiado
  const [copiedCallId, setCopiedCallId] = useState<string | null>(null);

  const handleCopyMeet = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedCallId(id);
    setTimeout(() => setCopiedCallId(null), 2000);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeNow = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateNow = now.toLocaleDateString('pt-BR');
    
    onUpdateAnnouncement({
      ...announcement,
      title: annTitle.trim(),
      message: annMessage.trim(),
      priority: annPriority,
      publishedAt: `${timeNow} - ${dateNow}`
    });
    setIsEditAnnouncementOpen(false);
  };

  const handleSaveCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callTitle.trim() || !callMeetUrl.trim()) return;

    onAddTeamCall({
      title: callTitle.trim(),
      agenda: callAgenda.trim(),
      date: `${callDate} ${callTime}`,
      meetUrl: callMeetUrl.trim(),
      hostName: callHost.trim(),
      status: 'AGENDADA'
    });

    setCallTitle('');
    setCallAgenda('');
    setIsNewCallOpen(false);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matUrl.trim()) return;

    const tagsArray = matTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddStudyMaterial({
      title: matTitle.trim(),
      category: matCategory,
      url: matUrl.trim(),
      instructor: matInstructor.trim() || undefined,
      duration: matDuration.trim() || undefined,
      description: matDescription.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Treinamento', 'Flyto'],
      addedAt: new Date().toLocaleDateString('pt-BR')
    });

    setMatTitle('');
    setMatUrl('');
    setMatInstructor('');
    setMatDuration('');
    setMatDescription('');
    setMatTags('');
    setIsNewMaterialOpen(false);
  };

  const filteredMaterials = selectedCategory === 'ALL'
    ? studyMaterials
    : studyMaterials.filter(m => m.category === selectedCategory);

  const getCategoryLabel = (cat: StudyCategory) => {
    switch(cat) {
      case 'TRAFEGO_PAGO': return 'Tráfego Pago';
      case 'VENDAS_COMERCIAL': return 'Vendas & Comercial';
      case 'AUDIOVISUAL_CRIATIVOS': return 'Audiovisual & Criativos';
      case 'ESTRATEGIA_GROWTH': return 'Estratégia & Escala';
      case 'FERRAMENTAS_AUTOMACAO': return 'Automação & n8n';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-4 shadow-xs beam-border-slow">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#277e1b]/10 dark:bg-[#00FF66]/10 border border-[#277e1b]/20 dark:border-[#00FF66]/30 flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Academy, Estudos & Alinhamento de Equipe
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#696969]">
              Mural de avisos gerais, reuniões internas pelo Meet e acervo de cursos e playbooks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewCallOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-700 dark:text-white border border-slate-200 dark:border-[#2D3035] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Agendar Call de Equipe</span>
          </button>

          <button
            onClick={() => setIsNewMaterialOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Estudo</span>
          </button>
        </div>
      </div>

      {/* 2. Mural de Aviso Geral da Equipe (Broadcast) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-[#00FF66]/10 dark:via-[#181A1D] dark:to-[#181A1D] border border-emerald-200 dark:border-emerald-900/40 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#00FF66]">
                  Aviso Geral da Assessoria
                </span>
                <span className="text-xs text-slate-400 dark:text-[#8E959E]">
                  Publicado em: {announcement.publishedAt}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                {announcement.title}
              </h3>
              <p className="text-xs text-slate-700 dark:text-[#C5D1CB] mt-1 leading-relaxed max-w-3xl">
                {announcement.message}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-[#8E959E] mt-2 font-medium">
                Por: <strong className="text-slate-800 dark:text-white">{announcement.author}</strong> ({announcement.authorRole})
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditAnnouncementOpen(true)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-600 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#2D3035] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Aviso</span>
          </button>
        </div>
      </div>

      {/* 3. Calls de Alinhamento da Equipe (Google Meet) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Calls de Alinhamento & Workshops Internos
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-[#696969]">{teamCalls.length} reuniões registradas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teamCalls.map((call) => (
            <div 
              key={call.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {call.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#8E959E] mt-1">
                    <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {/* Horário - Data */}
                      {formatDateTimeBR(call.date)}
                    </span>
                    <span>&middot;</span>
                    <span>Host: {call.hostName}</span>
                  </div>
                </div>

                <select
                  value={call.status}
                  onChange={(e) => onUpdateCallStatus(call.id, e.target.value as TeamCallStatus)}
                  className={`text-[10px] font-bold rounded-lg px-2 py-0.5 border cursor-pointer focus:outline-hidden ${
                    call.status === 'AGENDADA'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                      : call.status === 'EM_ANDAMENTO'
                      ? 'bg-emerald-50 text-[#277e1b] dark:bg-emerald-950/40 dark:text-[#00FF66] border-emerald-300 dark:border-emerald-800/40'
                      : 'bg-slate-100 text-slate-600 dark:bg-[#1F2124] dark:text-[#8E959E] border-slate-200 dark:border-[#2D3035]'
                  }`}
                >
                  <option value="AGENDADA">Agendada</option>
                  <option value="EM_ANDAMENTO">Ao Vivo</option>
                  <option value="CONCLUIDA">Concluída</option>
                </select>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#A0AEC0] line-clamp-2">
                {call.agenda}
              </p>

              {/* Botões do Meet */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <a
                  href={call.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Entrar no Google Meet</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={() => handleCopyMeet(call.id, call.meetUrl)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-600 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#2D3035] transition-colors cursor-pointer"
                  title="Copiar link da reunião"
                >
                  {copiedCallId === call.id ? <Check className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Acervo de Estudos, Playbooks & Ensinamentos */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Acervo de Estudos & Materiais da Flyto
            </h3>
          </div>

          {/* Filtro de Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'TRAFEGO_PAGO', 'VENDAS_COMERCIAL', 'AUDIOVISUAL_CRIATIVOS', 'ESTRATEGIA_GROWTH', 'FERRAMENTAS_AUTOMACAO'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#277e1b]/10 dark:bg-[#00FF66]/15 text-[#277e1b] dark:text-[#00FF66] border border-[#277e1b]/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Todos os Temas' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Materiais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <div 
              key={mat.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-[#3A3E45] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-[#277e1b] dark:bg-emerald-950/40 dark:text-[#00FF66] border border-emerald-200 dark:border-emerald-800/40">
                    {getCategoryLabel(mat.category)}
                  </span>
                  {mat.duration && (
                    <span className="text-[11px] font-bold text-slate-400 dark:text-[#696969] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mat.duration}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  {mat.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-[#A0AEC0] line-clamp-3 leading-relaxed">
                  {mat.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {mat.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-semibold text-slate-500 dark:text-[#8E959E] bg-slate-100 dark:bg-[#121315] px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#25282C] flex items-center justify-between">
                <span className="text-[10px] text-slate-400 dark:text-[#696969]">
                  {mat.instructor ? `Por: ${mat.instructor}` : `Adicionado em ${mat.addedAt}`}
                </span>

                <a
                  href={mat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1F2124] dark:hover:bg-[#25282C] text-slate-800 dark:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-[#277e1b] dark:text-[#00FF66]" />
                  <span>Acessar Material</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: EDITAR AVISO GERAL */}
      {isEditAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Editar Aviso Geral da Equipe</h3>
              <button onClick={() => setIsEditAnnouncementOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Título do Comunicado *</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Título do aviso..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Mensagem do Time *</label>
                <textarea
                  rows={4}
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder="Instruções, metas e avisos para a assessoria..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsEditAnnouncementOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                >
                  Salvar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGENDAR CALL DE EQUIPE */}
      {isNewCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Agendar Call de Equipe</h3>
              <button onClick={() => setIsNewCallOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCall} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Título da Call *</label>
                <input
                  type="text"
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  placeholder="Nome da reunião ou workshop..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Data *</label>
                  <input
                    type="date"
                    value={callDate}
                    onChange={(e) => setCallDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Horário (24h) *</label>
                  <input
                    type="time"
                    value={callTime}
                    onChange={(e) => setCallTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Link do Google Meet *</label>
                <input
                  type="url"
                  value={callMeetUrl}
                  onChange={(e) => setCallMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Pauta / Tópicos Abordados</label>
                <textarea
                  rows={2}
                  value={callAgenda}
                  onChange={(e) => setCallAgenda(e.target.value)}
                  placeholder="Pauta da call de alinhamento..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsNewCallOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                >
                  Agendar Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR MATERIAL DE ESTUDO */}
      {isNewMaterialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Adicionar Material de Estudo / Curso</h3>
              <button onClick={() => setIsNewMaterialOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Título do Material / Aula *</label>
                <input
                  type="text"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  placeholder="Nome do curso ou aula..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Categoria *</label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value as StudyCategory)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="TRAFEGO_PAGO">Tráfego Pago</option>
                    <option value="VENDAS_COMERCIAL">Vendas & Comercial</option>
                    <option value="AUDIOVISUAL_CRIATIVOS">Audiovisual & Criativos</option>
                    <option value="ESTRATEGIA_GROWTH">Estratégia & Escala</option>
                    <option value="FERRAMENTAS_AUTOMACAO">Automação & n8n</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Duração Estimada</label>
                  <input
                    type="text"
                    value={matDuration}
                    onChange={(e) => setMatDuration(e.target.value)}
                    placeholder="Ex: 30 min ou 1h20"
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Link de Acesso (Drive / Notion / YouTube / Plataforma) *</label>
                <input
                  type="url"
                  value={matUrl}
                  onChange={(e) => setMatUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden font-mono text-[11px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Instrutor / Fonte</label>
                  <input
                    type="text"
                    value={matInstructor}
                    onChange={(e) => setMatInstructor(e.target.value)}
                    placeholder="Nome do instrutor ou canal..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Tags (Separadas por vírgula)</label>
                  <input
                    type="text"
                    value={matTags}
                    onChange={(e) => setMatTags(e.target.value)}
                    placeholder="Meta, Escala, Criativos..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">Descrição / Resumo do Ensinamento</label>
                <textarea
                  rows={2}
                  value={matDescription}
                  onChange={(e) => setMatDescription(e.target.value)}
                  placeholder="O que o time irá aprender com esse material..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] rounded-xl text-slate-900 dark:text-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
                <button
                  type="button"
                  onClick={() => setIsNewMaterialOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]"
                >
                  Salvar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
