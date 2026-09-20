import React, { useState } from 'react';
import { FolderOpen, X, ExternalLink, Check } from 'lucide-react';
import { ClientData } from '../../types/hub';

interface EditDriveModalProps {
  isOpen: boolean;
  client: ClientData | null;
  onClose: () => void;
  onSaveDriveUrl: (clientId: string, newUrl: string) => void;
}

export const EditDriveModal: React.FC<EditDriveModalProps> = ({
  isOpen,
  client,
  onClose,
  onSaveDriveUrl
}) => {
  const [driveUrl, setDriveUrl] = useState(client?.driveFolderUrl || '');

  // Sincroniza se o cliente mudar
  const [prevClientId, setPrevClientId] = useState(client?.id);
  if (client && client.id !== prevClientId) {
    setPrevClientId(client.id);
    setDriveUrl(client.driveFolderUrl || '');
  }

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;
    onSaveDriveUrl(client.id, driveUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0C1512] border border-[#1F382D] rounded-2xl p-5 space-y-4 shadow-2xl neon-card beam-top-line">
        
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2E25]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#142B21] flex items-center justify-center text-[#00FF66]">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Google Drive do Cliente</h3>
              <p className="text-[10px] text-[#768E85]">{client.tradeName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#768E85] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#A6C4B9] block mb-1.5">
              Link da Pasta no Google Drive (Brutos, Editados, Contratos)
            </label>
            <div className="relative">
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full pl-3 pr-8 py-2.5 bg-[#122019] border border-[#20382D] focus:border-[#00FF66] rounded-lg text-white font-mono text-[11px] focus:outline-none"
                required
              />
              {driveUrl && (
                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#00FF66] hover:text-white"
                  title="Testar link em nova aba"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-[#586E66] mt-1.5">
              Insira o link de compartilhamento da pasta raiz do cliente no Google Drive da assessoria.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1A2E25]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-[#768E85] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-extrabold bg-[#00FF66] text-[#07130E] hover:bg-[#1be06a] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#07130E]" />
              <span>Salvar Link do Drive</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
