import { StudyMaterial, TeamCall, TeamAnnouncement } from '../types/hub';

export const initialTeamAnnouncement: TeamAnnouncement = {
  id: 'ann_1',
  title: 'Diretrizes Oficiais de Operação da Assessoria Flyto',
  message: 'Bem-vindos à central operacional FlytoHUB. Todos os relatórios, alinhamentos e checklists de rotina devem ser registrados neste painel para supervisão em tempo real.',
  author: 'CEO Assessoria Flyto',
  authorRole: 'CEO & Diretoria',
  priority: 'IMPORTANTE',
  publishedAt: `${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString('pt-BR')}`
};

export const initialTeamCalls: TeamCall[] = [];

export const initialStudyMaterials: StudyMaterial[] = [
  {
    id: 'mat_1',
    title: 'Framework de Roteirização para Criativos de Alta Conversão',
    category: 'AUDIOVISUAL_CRIATIVOS',
    url: 'https://drive.google.com',
    instructor: 'Diretoria Flyto',
    description: 'Manual de criação com ganchos dos primeiros 3 segundos, quebra de objeções e chamadas para ação persuasivas.',
    duration: '25 min',
    tags: ['Reels', 'Criativos', 'Copywriting', 'Vídeo'],
    addedAt: new Date().toLocaleDateString('pt-BR')
  }
];
