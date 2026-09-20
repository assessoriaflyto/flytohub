// ============================================================================
// FLYTOHUB — FILA DE TAREFAS DE CRIATIVOS E SOCIAL MEDIA DA ASSESSORIA
// ============================================================================
import { CreativeTask } from '../types/hub';

export const INITIAL_CREATIVE_TASKS: CreativeTask[] = [
  {
    id: 'task_cr_1',
    clientId: 'cli_techcorp',
    clientName: 'TechCorp Brasil Enterprise',
    title: 'Vídeo Depoimento Caso de Sucesso + CTA para Demonstração',
    format: 'REELS_VIDEO',
    status: 'EDICAO',
    priority: 'ALTA',
    dueDate: '2026-09-22',
    driveAssetsUrl: 'https://drive.google.com/drive/folders/1TechCorpBruto-Assets',
    briefingNotes: 'Cortes rápidos, letterings dinâmicos estilo Alex Hormozi e gancho de 3s no início.',
    assignedTo: 'Lucas Videomaker'
  },
  {
    id: 'task_cr_2',
    clientId: 'cli_camila_dermato',
    clientName: 'Dra. Camila Dermatologia',
    title: 'Carrossel Explicativo: Por que o Bioestimulador é o melhor investimento aos 30+',
    format: 'CARROSSEL',
    status: 'APROVACAO',
    priority: 'MEDIA',
    dueDate: '2026-09-23',
    driveAssetsUrl: 'https://drive.google.com/drive/folders/1CamilaDermato-Criativos',
    briefingNotes: 'Design editorial limpo, tons neutros e dourado sutil. Prova social no slide 6.',
    assignedTo: 'Sofia Designer'
  },
  {
    id: 'task_cr_3',
    clientId: 'cli_lumina_decor',
    clientName: 'Lumina Decor Home & Interiores',
    title: 'Reels Tour de Ambientes Decorados com Mesa de Jantar Orgânica',
    format: 'REELS_VIDEO',
    status: 'GRAVACAO',
    priority: 'ALTA',
    dueDate: '2026-09-24',
    driveAssetsUrl: 'https://drive.google.com/drive/folders/1LuminaDecor-Drive',
    briefingNotes: 'Captação agendada para 24/09 às 10:00 na loja conceito. Levar estabilizador e luz quente.',
    assignedTo: 'Lucas Videomaker'
  },
  {
    id: 'task_cr_4',
    clientId: 'cli_vertice_eng',
    clientName: 'Vértice Engenharia & Empreendimentos',
    title: 'Anúncio Estático de Alta Conversão: Lançamento SkyLine Towers',
    format: 'ESTATICO',
    status: 'PUBLICADO',
    priority: 'URGENTE',
    dueDate: '2026-09-18',
    driveAssetsUrl: 'https://drive.google.com/drive/folders/1VerticeEngenharia-Arquivos',
    briefingNotes: 'Render fotorrealista da fachada com badge "Condições Exclusivas de Pré-Lançamento".',
    assignedTo: 'Sofia Designer'
  },
  {
    id: 'task_cr_5',
    clientId: 'cli_prime_law',
    clientName: 'Grupo Prime Advocacia Corporativa',
    title: 'Roteiro de Vídeo: Riscos Ocultos no Planejamento Tributário 2027',
    format: 'COPY_CAMPANHA',
    status: 'ROTEIRO',
    priority: 'MEDIA',
    dueDate: '2026-09-25',
    driveAssetsUrl: 'https://drive.google.com/drive/folders/1PrimeLaw-Docs',
    briefingNotes: 'Copy com tom sóbrio e autoritário. Destacar experiência do escritório com mais de 500 empresas.',
    assignedTo: 'Redator Flyto'
  },
  {
    id: 'task_cr_6',
    clientId: 'cli_lumina_decor',
    clientName: 'Lumina Decor Home & Interiores',
    title: 'Sequência de Stories Interativos: Quiz "Qual seu estilo de décor?"',
    format: 'STORY_INTERATIVO',
    status: 'AGENDADO',
    priority: 'BAIXA',
    dueDate: '2026-09-26',
    driveAssetsUrl: 'https://drive.google.com/drive/folders/1LuminaDecor-Drive',
    briefingNotes: '4 telas com enquete e caixinha de perguntas direcionando para o WhatsApp comercial.',
    assignedTo: 'Sofia Designer'
  }
];
