import React, { useState } from 'react';
import { Video, X } from 'lucide-react';
import { ClientData, ScheduledMeeting } from '../../types/hub';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  client: ClientData | null;
  onClose: () => void;
  onSaveMeeting: (clientId: string, meeting: ScheduledMeeting) => void;
  onCancelMeeting: (clientId: string) => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  client,
  onClose,
  onSaveMeeting,
  onCancelMeeting
}) => {
  const parseInitialDate = (rawDate?: string) => {
    if (!rawDate) {
      const today = new Date().toISOString().split('T')[0];
      return { date: today, time: '15:00' };
    }
    const parts = rawDate.split(' ');
    return {
      date: parts[0] || new Date().toISOString().split('T')[0],
      time: parts[1] || '15:00'
    };
  };

  const initial = parseInitialDate(client?.scheduledMeeting?.date);
  const [meetingDate, setMeetingDate] = useState(initial.date);
  const [meetingTime, setMeetingTime] = useState(initial.time);
  const [reason, setReason] = useState(client?.scheduledMeeting?.reason || 'Alinhamento Estratégico Mensal');
  const [meetUrl, setMeetUrl] = useState(client?.scheduledMeeting?.meetUrl || 'https://meet.google.com/');

  // Sincroniza quando o cliente muda
  const [prevClientId, setPrevClientId] = useState(client?.id);
  if (client && client.id !== prevClientId) {
    setPrevClientId(client.id);
    const parsed = parseInitialDate(client.scheduledMeeting?.date);
    setMeetingDate(parsed.date);
    setMeetingTime(parsed.time);
    setReason(client.scheduledMeeting?.reason || 'Alinhamento Estratégico Mensal');
    setMeetUrl(client.scheduledMeeting?.meetUrl || 'https://meet.google.com/');
  }

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate.trim() || !reason.trim()) return;

    const fullDateTime = `${meetingDate.trim()} ${meetingTime.trim()}`;

    onSaveMeeting(client.id, {
      date: fullDateTime,
      reason: reason.trim(),
      meetUrl: meetUrl.trim(),
      scheduledAt: new Date().toISOString()
    });
    onClose();
  };

  const handleRemove = () => {
    onCancelMeeting(client.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-slate-200 dark:border-[#2D3035] rounded-2xl p-6 space-y-4 shadow-2xl beam-border-slow">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#25282C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Agendar Reunião com Cliente</h3>
              <p className="text-[11px] text-slate-500 dark:text-[#696969]">{client.tradeName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:text-[#696969] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Data da Call *
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                Horário (24h) *
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
              Pauta do Alinhamento *
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Pauta da reunião..."
              className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
              Link da Sala (Google Meet)
            </label>
            <input
              type="url"
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full p-2.5 bg-slate-50 dark:bg-[#121315] border border-slate-200 dark:border-[#2D3035] focus:border-[#277e1b] dark:focus:border-[#00FF66] rounded-xl text-slate-900 dark:text-white focus:outline-hidden font-mono text-[11px]"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-[11px] text-blue-700 dark:text-blue-300">
            A call aparecerá na linha do cliente com tag destacada e horário no padrão brasileiro.
          </div>

          {/* Botões */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#25282C]">
            {client.scheduledMeeting ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                Cancelar Call
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#277e1b] dark:bg-[#00FF66] text-white dark:text-[#07130E] hover:opacity-95 transition-all shadow-xs cursor-pointer"
              >
                Confirmar Reunião
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
