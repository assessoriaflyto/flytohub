import React from 'react';
import { Bell, X, Check, Trash2, CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';
import { NotificationItem } from '../../types/hub';

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onDeleteNotification,
  onClearAll
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-[#277e1b] dark:text-[#00FF66]" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'LEAD':
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-3xl p-6 space-y-4 shadow-2xl beam-border-slow">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#1F2124] border border-emerald-200 dark:border-[#2D3035] flex items-center justify-center text-[#277e1b] dark:text-[#00FF66]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Central de Notificações</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E]">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#696969]">Alertas em tempo real do sistema FlytoHUB</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:text-[#696969] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ações de Lote */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between text-xs pt-1">
            {unreadCount > 0 ? (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-[#277e1b] dark:text-[#00FF66] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Marcar todas como lidas</span>
              </button>
            ) : <div />}

            <button
              onClick={onClearAll}
              className="text-[11px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
          </div>
        )}

        {/* Lista de Notificações */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Bell className="w-8 h-8 text-slate-300 dark:text-[#383C42] mx-auto" />
              <p className="text-xs text-slate-400 dark:text-[#696969]">Nenhuma notificação no momento.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 relative ${
                  !n.read
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40'
                    : 'bg-slate-50 dark:bg-[#121315] border-slate-200 dark:border-[#2D3035] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIcon(n.type)}
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {n.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-400 dark:text-[#696969]">
                      {n.timestamp}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(n.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-[#1F2124] transition-colors"
                      title="Excluir notificação"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-[#A0AEC0] leading-relaxed pl-6">
                  {n.message}
                </p>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#277e1b] dark:bg-[#00FF66] absolute left-2 top-4 animate-pulse" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#25282C] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
