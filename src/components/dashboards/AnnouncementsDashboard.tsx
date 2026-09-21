import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  X, 
  Pin,
  Flame,
  Info,
  ShieldAlert
} from 'lucide-react';
import { TeamAnnouncement, UserAccount } from '../../types/hub';

interface AnnouncementsDashboardProps {
  announcements: TeamAnnouncement[];
  currentUser: UserAccount;
  onAddAnnouncement: (announcement: Omit<TeamAnnouncement, 'id'>) => void;
  onUpdateAnnouncement: (announcement: TeamAnnouncement) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const AnnouncementsDashboard: React.FC<AnnouncementsDashboardProps> = ({
  announcements,
  currentUser,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamAnnouncement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'IMPORTANTE' | 'URGENTE'>('NORMAL');

  // Acknowledged list stored in local state
  const [acknowledgedIds, setAcknowledgedIds] = useState<Record<string, boolean>>({});

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setMessage('');
    setPriority('NORMAL');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TeamAnnouncement) => {
    setEditingItem(item);
    setTitle(item.title);
    setMessage(item.message);
    setPriority(item.priority);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const now = new Date();
    const timeNow = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateNow = now.toLocaleDateString('pt-BR');
    const publishedAt = `${timeNow} - ${dateNow}`;

    if (editingItem) {
      onUpdateAnnouncement({
        ...editingItem,
        title: title.trim(),
        message: message.trim(),
        priority,
        publishedAt
      });
    } else {
      onAddAnnouncement({
        title: title.trim(),
        message: message.trim(),
        author: currentUser.name,
        authorRole: currentUser.role === 'ADMIN' ? 'CEO & Diretoria' : currentUser.role,
        priority,
        publishedAt
      });
    }

    setIsModalOpen(false);
  };

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPriorityBadge = (p: 'NORMAL' | 'IMPORTANTE' | 'URGENTE') => {
    switch (p) {
      case 'URGENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400 animate-pulse">
            <Flame className="w-3.5 h-3.5" /> Urgente
          </span>
        );
      case 'IMPORTANTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" /> Importante
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Info className="w-3.5 h-3.5" /> Geral
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Mural de Avisos & Comunicados
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Oficial Flyto
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Diretrizes estratégicas, comunicados urgentes da diretoria e alinhamentos operacionais.
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4" />
            Publicar Novo Comunicado
          </button>
        )}
      </div>

      {/* Lista de Avisos */}
      <div className="grid grid-cols-1 gap-5">
        {announcements.length === 0 ? (
          <div className="text-center py-16 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <Megaphone className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum aviso ativo no momento</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Quando a diretoria emitir comunicados ou diretrizes, eles aparecerão com destaque neste mural.
            </p>
          </div>
        ) : (
          announcements.map((item) => {
            const isAcknowledged = acknowledgedIds[item.id];

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                  item.priority === 'URGENTE'
                    ? 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 shadow-sm hover:border-rose-300 dark:hover:border-rose-800'
                    : item.priority === 'IMPORTANTE'
                    ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40 shadow-sm hover:border-amber-300 dark:hover:border-amber-800'
                    : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/30'
                } p-6`}
              >
                {/* Top bar with pin & actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <Pin className={`w-4 h-4 ${
                      item.priority === 'URGENTE' ? 'text-rose-500' : item.priority === 'IMPORTANTE' ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                    {getPriorityBadge(item.priority)}
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.publishedAt}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-emerald-500" />
                      {item.author} ({item.authorRole})
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-500 transition"
                          title="Editar comunicado"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {onDeleteAnnouncement && (
                          <button
                            onClick={() => onDeleteAnnouncement(item.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-500 transition"
                            title="Excluir comunicado"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Message */}
                <div className="py-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {item.message}
                </div>

                {/* Footer action: Acknowledge */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Assessoria Flyto · Diretoria & Operações
                  </div>

                  <button
                    onClick={() => toggleAcknowledge(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      isAcknowledged
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isAcknowledged ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {isAcknowledged ? 'Ciente Registrado' : 'Marcar como Ciente'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Criar / Editar Aviso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingItem ? 'Editar Comunicado' : 'Novo Comunicado da Diretoria'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    O comunicado será exibido com prioridade para toda a equipe Flyto
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Título do Aviso *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Atualização Obrigatória de Relatórios de Terça-Feira"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Prioridade *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority('NORMAL')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      priority === 'NORMAL'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Geral / Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('IMPORTANTE')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      priority === 'IMPORTANTE'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Importante
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('URGENTE')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      priority === 'URGENTE'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Urgente
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Mensagem / Diretriz Completa *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva os detalhes, prazos, instruções ou alterações de procedimentos operacionais..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition shadow-lg shadow-emerald-500/25"
                >
                  {editingItem ? 'Atualizar Comunicado' : 'Publicar Comunicado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
