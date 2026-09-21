import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemTypeDescription: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  itemTypeDescription,
  onConfirm,
  onClose
}) => {
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypedConfirmation('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = typedConfirmation.trim().toLowerCase() === itemName.trim().toLowerCase();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch) {
      setError(true);
      return;
    }
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#181A1D] border border-rose-200 dark:border-rose-950/60 rounded-3xl p-6 space-y-4 shadow-2xl relative">
        
        {/* Topo do Modal */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8E959E]">
                Ação irreversível de segurança
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem Explicativa */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
          Você está prestes a excluir permanentemente {itemTypeDescription}:
          <strong className="block mt-1 text-slate-900 dark:text-white font-extrabold text-sm">
            "{itemName}"
          </strong>
        </div>

        {/* Formulário com Confirmação Obrigatória por Digitação */}
        <form onSubmit={handleConfirm} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-[#A0AEC0] mb-1.5">
              Para confirmar, digite exatamente <span className="text-rose-600 dark:text-rose-400 font-black select-all">"{itemName}"</span> abaixo:
            </label>
            <input
              type="text"
              autoFocus
              value={typedConfirmation}
              onChange={(e) => {
                setTypedConfirmation(e.target.value);
                if (error) setError(false);
              }}
              placeholder={`Digite "${itemName}" para confirmar...`}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121315] border rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden transition-all ${
                error
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : isMatch
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-[#2D3035] focus:border-rose-500'
              }`}
            />
            {error && (
              <span className="text-[11px] text-rose-600 font-bold block mt-1">
                O nome digitado não corresponde ao item.
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#25282C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-[#A0AEC0] hover:bg-slate-100 dark:hover:bg-[#1F2124] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isMatch}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isMatch
                  ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
                  : 'bg-slate-200 dark:bg-[#25282C] text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Permanentemente</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
