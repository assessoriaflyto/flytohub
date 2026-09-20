import React from 'react';
import { Database, X } from 'lucide-react';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1513] border border-[#202C28] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1C2824] bg-[#141C19]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#6bea56]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Conexão com Banco de Dados Supabase</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#182320] text-[#6bea56] border border-[#263732] font-semibold">
                  Pronto para Ativação
                </span>
              </h3>
              <p className="text-[11px] text-[#6E817C]">
                Guia de ativação rápida para persistência permanente na nuvem
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#6E817C] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Guia */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#8EA09B]">
          
          <div className="p-3.5 rounded-lg bg-[#141C19] border border-[#202C28] text-[#B5C4C0] leading-relaxed">
            <strong className="text-white">Aviso sobre o Supabase:</strong> Como você mencionou no prompt, o sistema 
            está <span className="text-[#6bea56] font-bold">100% modelado e preparado</span> para rodar no Supabase 
            (PostgreSQL). O schema Prisma já possui todos os campos e relações prontos.
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#2f9b20] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Criar o Projeto no Supabase</span>
            </h4>
            <p className="pl-6">
              Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#6bea56] underline">supabase.com</a>, crie uma organização e um novo projeto (ex: <code className="text-white">flytohub-production</code>). Selecione a região <strong>São Paulo (sa-east-1)</strong> para menor latência em Brasília e no Brasil.
            </p>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <span className="w-5 h-5 rounded-full bg-[#2f9b20] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Copiar a Connection String do Supabase</span>
            </h4>
            <p className="pl-6">
              No painel do Supabase, vá em <strong>Project Settings &gt; Database &gt; Connection String</strong>:
            </p>
            <div className="pl-6 space-y-1.5">
              <div className="p-2.5 rounded bg-[#080C0B] border border-[#1A2522] font-mono text-[11px] text-zinc-300">
                <span className="text-[#6E817C]"># Modo Connection Pooling (Porta 6543)</span><br />
                DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"<br /><br />
                <span className="text-[#6E817C]"># Modo Direct Connection (Porta 5432)</span><br />
                DIRECT_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
              </div>
              <p className="text-[11px] text-[#6E817C]">
                Basta preencher essas variáveis no arquivo <code className="text-white">.env</code> do projeto (temos o modelo pronto em <code className="text-white">.env.example</code>).
              </p>
            </div>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <span className="w-5 h-5 rounded-full bg-[#2f9b20] text-white flex items-center justify-center text-[10px]">3</span>
              <span>Criar as Tabelas no Banco com 1 Comando</span>
            </h4>
            <p className="pl-6">
              Com as variáveis salvas no <code className="text-white">.env</code>, basta rodar no terminal dentro da pasta FlytoHUB:
            </p>
            <div className="pl-6">
              <div className="p-2.5 rounded bg-[#080C0B] border border-[#1A2522] font-mono text-xs text-[#6bea56] flex items-center justify-between">
                <span>npx prisma db push</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <span className="w-5 h-5 rounded-full bg-[#2f9b20] text-white flex items-center justify-center text-[10px]">4</span>
              <span>Conexão Finalizada!</span>
            </h4>
            <p className="pl-6">
              Todas as 8 tabelas (<code className="text-white">clients</code>, <code className="text-white">access_vaults</code>, <code className="text-white">audits_instagram</code>, <code className="text-white">audits_menu</code>, etc.) aparecerão instantaneamente no seu painel do Supabase com visualização em tabela e segurança Row Level Security (RLS).
            </p>
          </div>

        </div>

        {/* Rodapé */}
        <div className="p-3 border-t border-[#1C2824] bg-[#0F1513] flex items-center justify-between">
          <span className="text-xs text-[#6E817C]">Assim que criar o Supabase, me avise que fazemos a conexão!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2f9b20] hover:bg-[#277e1b] text-white font-bold text-xs rounded-lg cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
